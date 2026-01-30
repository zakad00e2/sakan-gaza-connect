import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AREAS, LISTING_TYPES, PROPERTY_TYPES, UtilityKey, Listing, PropertyType } from "@/lib/constants";
import { Upload, X, Loader2, Home, MapPin, Warehouse } from "lucide-react";

// ========================================
// أنواع البيانات
// ========================================

export interface ListingFormData {
  title: string;
  type: "rent" | "sale";
  property_type: PropertyType;
  area: string;
  price: string;
  price_note: string;
  rooms: string;
  floor_area: string;
  capacity: string;
  utilities: {
    water: string;
    electricity: string;
    internet: string;
  };
  description: string;
  contact_name: string;
  contact_phone: string;
  whatsapp_enabled: boolean;
}

interface ExistingImage {
  id: string;
  url: string;
}

interface ListingFormProps {
  initialData?: Listing;
  onSubmit: (data: ListingFormData, newImages: File[], deletedImageIds: string[]) => Promise<void>;
  isSubmitting: boolean;
  submitText: string;
  onCancel?: () => void;
}

// ========================================
// القيم الافتراضية
// ========================================

const defaultFormData: ListingFormData = {
  title: "",
  type: "rent",
  property_type: "apartment",
  area: "",
  price: "",
  price_note: "",
  rooms: "",
  floor_area: "",
  capacity: "1",
  utilities: {
    water: "unavailable",
    electricity: "unavailable",
    internet: "unavailable",
  },
  description: "",
  contact_name: "",
  contact_phone: "",
  whatsapp_enabled: true,
};

// ========================================
// تحويل البيانات
// ========================================

function listingToFormData(listing: Listing): ListingFormData {
  const getUtilityValue = (value: boolean | string): string => {
    if (value === true || value === "available") return "available";
    if (value === "limited") return "limited";
    return "unavailable";
  };

  return {
    title: listing.title,
    type: listing.type,
    property_type: listing.property_type || "apartment",
    area: listing.area,
    price: listing.price?.toString() || "",
    price_note: listing.price_note || "",
    rooms: listing.rooms?.toString() || "",
    floor_area: listing.floor_area?.toString() || "",
    capacity: listing.capacity.toString(),
    utilities: {
      water: getUtilityValue(listing.utilities.water),
      electricity: getUtilityValue(listing.utilities.electricity),
      internet: getUtilityValue(listing.utilities.internet),
    },
    description: listing.description || "",
    contact_name: listing.contact_name,
    contact_phone: listing.contact_phone,
    whatsapp_enabled: listing.whatsapp_enabled ?? true,
  };
}

// ========================================
// المكون
// ========================================

export function ListingForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitText,
  onCancel,
}: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>(
    initialData ? listingToFormData(initialData) : defaultFormData
  );

  // الصور الموجودة (للتعديل)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialData?.listing_images || []
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // الصور الجديدة
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalImages = existingImages.length + newImages.length;

  // ========================================
  // معالجة الصور
  // ========================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - totalImages;

    if (files.length > remainingSlots) {
      setErrors({ ...errors, images: `يمكنك إضافة ${remainingSlots} صور فقط` });
      return;
    }

    const newFiles = files.slice(0, remainingSlots);
    setNewImages([...newImages, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
    setErrors({ ...errors, images: "" });
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
    setDeletedImageIds([...deletedImageIds, imageId]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // ========================================
  // تحديث المرافق
  // ========================================

  const updateUtility = (key: UtilityKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      utilities: { ...prev.utilities, [key]: value },
    }));
  };

  // ========================================
  // التحقق من الصحة
  // ========================================

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "يرجى إدخال عنوان الإعلان";
    }
    if (!formData.area) {
      newErrors.area = "يرجى اختيار المنطقة";
    }
    if (formData.property_type === "apartment" && !formData.rooms) {
      newErrors.rooms = "يرجى تحديد عدد الغرف";
    }
    if (!formData.contact_name.trim()) {
      newErrors.contact_name = "يرجى إدخال اسم التواصل";
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = "يرجى إدخال رقم التواصل";
    } else {
      const phoneRegex = /^[\d\s\-+()]{8,15}$/;
      if (!phoneRegex.test(formData.contact_phone)) {
        newErrors.contact_phone = "رقم الهاتف غير صحيح";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // الإرسال
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData, newImages, deletedImageIds);
  };

  // ========================================
  // العرض
  // ========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* نوع العرض */}
      <div className="space-y-3">
        <Label className="text-base">نوع العرض</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(v) =>
            setFormData({ ...formData, type: v as "rent" | "sale" })
          }
          className="flex gap-4"
        >
          {Object.entries(LISTING_TYPES).map(([key, label]) => (
            <Label
              key={key}
              htmlFor={key}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === key
                  ? key === "rent"
                    ? "border-rent bg-rent/5"
                    : "border-sale bg-sale/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <RadioGroupItem value={key} id={key} className="sr-only" />
              <span className="font-medium">{label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* نوع العقار */}
      <div className="space-y-3">
        <Label className="text-base">نوع العقار</Label>
        <RadioGroup
          value={formData.property_type}
          onValueChange={(v) =>
            setFormData({ ...formData, property_type: v as PropertyType })
          }
          className="flex gap-3"
        >
          {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
            <Label
              key={key}
              htmlFor={`property-${key}`}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.property_type === key
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <RadioGroupItem value={key} id={`property-${key}`} className="sr-only" />
              {key === "apartment" && <Home className="w-6 h-6" />}
              {key === "land" && <MapPin className="w-6 h-6" />}
              {key === "warehouse" && <Warehouse className="w-6 h-6" />}
              <span className="font-medium text-sm">{label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* العنوان */}
      <div className="space-y-2">
        <Label htmlFor="title">عنوان الإعلان *</Label>
        <Input
          id="title"
          placeholder={
            formData.property_type === "apartment" 
              ? "مثال: شقة غرفتين في الرمال" 
              : formData.property_type === "land"
              ? "مثال: أرض للبيع في خان يونس"
              : "مثال: حاصل للإيجار في دير البلح"
          }
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-touch"
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* المنطقة */}
      <div className="space-y-2">
        <Label>المنطقة *</Label>
        <Select
          value={formData.area}
          onValueChange={(v) => setFormData({ ...formData, area: v })}
        >
          <SelectTrigger className="input-touch">
            <SelectValue placeholder="اختر المنطقة" />
          </SelectTrigger>
          <SelectContent>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.area && (
          <p className="text-sm text-destructive">{errors.area}</p>
        )}
      </div>

      {/* السعر */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (شيكل)</Label>
          <Input
            id="price"
            type="number"
            placeholder="مثال: 500"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input-touch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_note">أو ملاحظة</Label>
          <Input
            id="price_note"
            placeholder="تفاوض / مساعدة"
            value={formData.price_note}
            onChange={(e) =>
              setFormData({ ...formData, price_note: e.target.value })
            }
            className="input-touch"
          />
        </div>
      </div>

      {/* حقول حسب نوع العقار */}
      {formData.property_type === "apartment" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>عدد الغرف *</Label>
            <Select
              value={formData.rooms}
              onValueChange={(v) => setFormData({ ...formData, rooms: v })}
            >
              <SelectTrigger className="input-touch">
                <SelectValue placeholder="اختر عدد الغرف" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n === 4 ? "4 غرف أو أكثر" : `${n} غرفة`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rooms && (
              <p className="text-sm text-destructive">{errors.rooms}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>سعة الأشخاص</Label>
            <Select
              value={formData.capacity}
              onValueChange={(v) => setFormData({ ...formData, capacity: v })}
            >
              <SelectTrigger className="input-touch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {formData.property_type === "land" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor_area">مساحة الأرض (متر مربع)</Label>
            <Input
              id="floor_area"
              type="number"
              placeholder="مثال: 200"
              value={formData.floor_area}
              onChange={(e) => setFormData({ ...formData, floor_area: e.target.value })}
              className="input-touch"
            />
          </div>
          <div className="space-y-2">
            <Label>سعة الأشخاص</Label>
            <Select
              value={formData.capacity}
              onValueChange={(v) => setFormData({ ...formData, capacity: v })}
            >
              <SelectTrigger className="input-touch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {formData.property_type === "warehouse" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor_area">مساحة الحاصل (متر مربع)</Label>
            <Input
              id="floor_area"
              type="number"
              placeholder="مثال: 50"
              value={formData.floor_area}
              onChange={(e) => setFormData({ ...formData, floor_area: e.target.value })}
              className="input-touch"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">عدد الأشخاص</Label>
            <Select
              value={formData.capacity}
              onValueChange={(v) => setFormData({ ...formData, capacity: v })}
            >
              <SelectTrigger className="input-touch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* المرافق */}
      {formData.property_type && (
        <div className="space-y-3">
          <Label className="text-base">المرافق</Label>
          <div className="grid grid-cols-3 gap-3">
            {(["water", "electricity", "internet"] as UtilityKey[]).map((key) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {key === "water"
                    ? "الماء"
                    : key === "electricity"
                    ? "الكهرباء"
                    : "الإنترنت"}
                </Label>
                <Select
                  value={formData.utilities[key]}
                  onValueChange={(v) => updateUtility(key, v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">متوفر</SelectItem>
                    <SelectItem value="limited">محدود</SelectItem>
                    <SelectItem value="unavailable">غير متوفر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الوصف */}
      <div className="space-y-2">
        <Label htmlFor="description">وصف إضافي</Label>
        <Textarea
          id="description"
          placeholder={
            formData.property_type === "apartment"
              ? "أضف تفاصيل عن السكن، الموقع الدقيق، المميزات..."
              : formData.property_type === "land"
              ? "أضف تفاصيل عن الأرض، الموقع الدقيق، طبيعة الأرض..."
              : "أضف تفاصيل عن الحاصل، الموقع الدقيق، المميزات..."
          }
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-[120px]"
          maxLength={1000}
        />
      </div>

      {/* الصور */}
      <div className="space-y-3">
        <Label className="text-base">
          الصور (اختياري - حتى 5 صور) - {totalImages}/5
        </Label>

        <div className="flex flex-wrap gap-3">
          {/* الصور الموجودة */}
          {existingImages.map((image) => (
            <div
              key={image.id}
              className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted"
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(image.id)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* الصور الجديدة */}
          {previewUrls.map((url, idx) => (
            <div
              key={`new-${idx}`}
              className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted border-2 border-primary/30"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 text-[10px] bg-primary text-primary-foreground px-1 rounded">
                جديدة
              </span>
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* زر الإضافة */}
          {totalImages < 5 && (
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">إضافة</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
                multiple
              />
            </label>
          )}
        </div>

        {errors.images && (
          <p className="text-sm text-destructive">{errors.images}</p>
        )}
      </div>

      {/* معلومات التواصل */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-4">
        <h3 className="font-bold">معلومات التواصل</h3>

        <div className="space-y-2">
          <Label htmlFor="contact_name">الاسم *</Label>
          <Input
            id="contact_name"
            placeholder="اسمك أو اسم المسؤول"
            value={formData.contact_name}
            onChange={(e) =>
              setFormData({ ...formData, contact_name: e.target.value })
            }
            className="input-touch"
            maxLength={50}
          />
          {errors.contact_name && (
            <p className="text-sm text-destructive">{errors.contact_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">رقم الهاتف *</Label>
          <Input
            id="contact_phone"
            type="tel"
            placeholder="مثال: 059XXXXXXX"
            value={formData.contact_phone}
            onChange={(e) =>
              setFormData({ ...formData, contact_phone: e.target.value })
            }
            className="input-touch"
            dir="ltr"
          />
          {errors.contact_phone && (
            <p className="text-sm text-destructive">{errors.contact_phone}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="whatsapp">تفعيل التواصل عبر واتساب</Label>
          <Switch
            id="whatsapp"
            checked={formData.whatsapp_enabled}
            onCheckedChange={(v) =>
              setFormData({ ...formData, whatsapp_enabled: v })
            }
          />
        </div>
      </div>

      {/* أزرار الإرسال */}
      <div className="flex gap-3">
        <Button
          type="submit"
          size="lg"
          className="flex-1 btn-touch"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            submitText
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
}
