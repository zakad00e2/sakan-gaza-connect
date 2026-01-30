import { supabase } from "@/integrations/supabase/client";
import { Listing, ListingStatus, Utilities, PropertyType } from "./constants";
import { getCurrentUser } from "./auth";
import { Json } from "@/integrations/supabase/types";

// Default utilities value
const DEFAULT_UTILITIES: Utilities = {
  water: false,
  electricity: false,
  internet: false,
};

// Helper function to safely cast JSON to Utilities
function toUtilities(json: Json | null): Utilities {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return DEFAULT_UTILITIES;
  }
  const obj = json as Record<string, unknown>;
  return {
    water: obj.water as boolean | string ?? false,
    electricity: obj.electricity as boolean | string ?? false,
    internet: obj.internet as boolean | string ?? false,
  };
}

// Type for listing update data matching Supabase schema
type ListingUpdateData = {
  title?: string;
  type?: string;
  property_type?: string;
  area?: string;
  price?: number | null;
  price_note?: string | null;
  rooms?: number | null;
  floor_area?: number | null;
  capacity?: number;
  utilities?: Json;
  description?: string | null;
  contact_name?: string;
  contact_phone?: string;
  whatsapp_enabled?: boolean;
};

// ========================================
// أنواع البيانات
// ========================================

export interface ListingFormData {
  title: string;
  type: "rent" | "sale";
  property_type: PropertyType;
  area: string;
  price: number | null;
  price_note: string | null;
  rooms?: number | null;
  floor_area: number | null;
  capacity: number;
  utilities: {
    water: boolean | string;
    electricity: boolean | string;
    internet: boolean | string;
  };
  description: string | null;
  contact_name: string;
  contact_phone: string;
  whatsapp_enabled: boolean;
}

export interface CreateListingResult {
  listing: Listing;
  error: null;
}

// ========================================
// دوال الإعلانات
// ========================================

/**
 * جلب إعلانات المستخدم الحالي
 */
export async function getMyListings(): Promise<Listing[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      listing_images (id, url)
    `)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => {
    const anyItem = item as Record<string, unknown>;
    return {
      ...item,
      type: item.type as "rent" | "sale",
      property_type: ((anyItem.property_type as string) || "apartment") as PropertyType,
      rooms: item.rooms ?? null,
      floor_area: (anyItem.floor_area as number) ?? null,
      status: item.status as ListingStatus,
      utilities: toUtilities(item.utilities),
    };
  });
}

/**
 * جلب إعلان معين للتعديل (مع التحقق من الملكية)
 */
export async function getListingForEdit(id: string): Promise<Listing | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      listing_images (id, url)
    `)
    .eq("id", id)
    .eq("owner_id", user.id) // التحقق من الملكية
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const anyData = data as Record<string, unknown>;
  return {
    ...data,
    type: data.type as "rent" | "sale",
    property_type: ((anyData.property_type as string) || "apartment") as PropertyType,
    rooms: data.rooms ?? null,
    floor_area: (anyData.floor_area as number) ?? null,
    status: data.status as ListingStatus,
    utilities: toUtilities(data.utilities),
  };
}

/**
 * إنشاء إعلان جديد
 */
export async function createListing(
  formData: ListingFormData
): Promise<Listing> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول لإضافة إعلان");
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      title: formData.title.trim(),
      type: formData.type,
      property_type: formData.property_type,
      area: formData.area,
      price: formData.price,
      price_note: formData.price_note?.trim() || null,
      rooms: formData.rooms ?? null,
      floor_area: formData.floor_area,
      capacity: formData.capacity,
      utilities: formData.utilities,
      description: formData.description?.trim() || null,
      contact_name: formData.contact_name.trim(),
      contact_phone: formData.contact_phone.trim(),
      whatsapp_enabled: formData.whatsapp_enabled,
      status: "pending", // قيد المراجعة حتى يوافق المشرف
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  const anyData = data as Record<string, unknown>;
  return {
    ...data,
    type: data.type as "rent" | "sale",
    property_type: ((anyData.property_type as string) || "apartment") as PropertyType,
    rooms: data.rooms ?? null,
    floor_area: (anyData.floor_area as number) ?? null,
    status: data.status as ListingStatus,
    utilities: toUtilities(data.utilities),
  };
}

/**
 * تحديث إعلان
 */
export async function updateListing(
  id: string,
  formData: Partial<ListingFormData>
): Promise<Listing> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  // التحقق من الملكية أولاً
  const existing = await getListingForEdit(id);
  if (!existing) {
    throw new Error("الإعلان غير موجود أو ليس لديك صلاحية تعديله");
  }

  const updateData: ListingUpdateData = {};

  if (formData.title !== undefined)
    updateData.title = formData.title.trim();
  if (formData.type !== undefined) updateData.type = formData.type;
  if (formData.property_type !== undefined) updateData.property_type = formData.property_type;
  if (formData.area !== undefined) updateData.area = formData.area;
  if (formData.price !== undefined) updateData.price = formData.price;
  if (formData.price_note !== undefined)
    updateData.price_note = formData.price_note?.trim() || null;
  if (formData.rooms !== undefined) updateData.rooms = formData.rooms;
  if (formData.floor_area !== undefined) updateData.floor_area = formData.floor_area;
  if (formData.capacity !== undefined)
    updateData.capacity = formData.capacity;
  if (formData.utilities !== undefined)
    updateData.utilities = formData.utilities as unknown as Json;
  if (formData.description !== undefined)
    updateData.description = formData.description?.trim() || null;
  if (formData.contact_name !== undefined)
    updateData.contact_name = formData.contact_name.trim();
  if (formData.contact_phone !== undefined)
    updateData.contact_phone = formData.contact_phone.trim();
  if (formData.whatsapp_enabled !== undefined)
    updateData.whatsapp_enabled = formData.whatsapp_enabled;

  const { data, error } = await supabase
    .from("listings")
    .update(updateData)
    .eq("id", id)
    .eq("owner_id", user.id) // حماية إضافية
    .select()
    .single();

  if (error) throw error;

  const anyData = data as Record<string, unknown>;
  return {
    ...data,
    type: data.type as "rent" | "sale",
    property_type: ((anyData.property_type as string) || "apartment") as PropertyType,
    rooms: data.rooms ?? null,
    floor_area: (anyData.floor_area as number) ?? null,
    status: data.status as ListingStatus,
    utilities: toUtilities(data.utilities),
  };
}

/**
 * تغيير حالة الإعلان
 */
export async function updateListingStatus(
  id: string,
  status: ListingStatus
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw error;
}

/**
 * موافقة المشرف على إعلان (للمشرفين فقط - تتحكم RLS)
 */
export async function approveListing(id: string): Promise<void> {
  const { error } = await supabase
    .from("listings")
    .update({ status: "active" })
    .eq("id", id);
  if (error) throw error;
}

/**
 * رفض إعلان من المشرف (للمشرفين فقط - تتحكم RLS)
 */
export async function rejectListing(id: string): Promise<void> {
  const { error } = await supabase
    .from("listings")
    .update({ status: "hidden" })
    .eq("id", id);
  if (error) throw error;
}

/**
 * جلب الإعلانات المعلقة (قيد المراجعة) - للمشرفين فقط
 */
export async function getPendingListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      listing_images (id, url)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => {
    const anyItem = item as Record<string, unknown>;
    return {
      ...item,
      type: item.type as "rent" | "sale",
      property_type: ((anyItem.property_type as string) || "apartment") as PropertyType,
      rooms: item.rooms ?? null,
      floor_area: (item.floor_area as number) ?? null,
      status: item.status as ListingStatus,
      utilities: toUtilities(item.utilities),
    };
  });
}

/**
 * حذف إعلان مع صوره
 */
export async function deleteListing(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  // جلب الصور لحذفها من Storage
  const { data: images } = await supabase
    .from("listing_images")
    .select("url")
    .eq("listing_id", id);

  // حذف ملفات الصور من Storage
  if (images && images.length > 0) {
    const filePaths = images
      .map((img) => {
        // استخراج مسار الملف من URL
        const url = img.url;
        const match = url.match(/listings\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      await supabase.storage.from("listings").remove(filePaths);
    }
  }

  // حذف الإعلان (الصور ستُحذف تلقائياً بسبب CASCADE)
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw error;
}

/**
 * ضغط الصورة قبل الرفع
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    // إذا كانت الصورة صغيرة أصلاً، لا داعي للضغط
    if (file.size < 500 * 1024) { // أقل من 500KB
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // تصغير الأبعاد إذا كانت كبيرة
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * رفع صورة للإعلان
 */
export async function uploadListingImage(
  listingId: string,
  file: File
): Promise<string> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  // ضغط الصورة قبل الرفع
  const compressedFile = await compressImage(file);

  const fileExt = "jpg"; // دائماً نحفظ بصيغة jpg بعد الضغط
  const fileName = `${listingId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("listings")
    .upload(fileName, compressedFile);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("listings")
    .getPublicUrl(fileName);

  // حفظ رابط الصورة في قاعدة البيانات
  const { error: dbError } = await supabase.from("listing_images").insert({
    listing_id: listingId,
    url: urlData.publicUrl,
  });

  if (dbError) throw dbError;

  return urlData.publicUrl;
}

/**
 * حذف صورة من الإعلان
 */
export async function deleteListingImage(
  imageId: string,
  imageUrl: string
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول");
  }

  // حذف من قاعدة البيانات
  const { error: dbError } = await supabase
    .from("listing_images")
    .delete()
    .eq("id", imageId);

  if (dbError) throw dbError;

  // حذف من Storage
  const match = imageUrl.match(/listings\/(.+)$/);
  if (match) {
    await supabase.storage.from("listings").remove([match[1]]);
  }
}

/**
 * جلب عدد صور الإعلان
 */
export async function getListingImagesCount(listingId: string): Promise<number> {
  const { count, error } = await supabase
    .from("listing_images")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId);

  if (error) throw error;
  return count || 0;
}
