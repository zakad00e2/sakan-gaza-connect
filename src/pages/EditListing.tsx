import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ListingForm, ListingFormData } from "@/components/ListingForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  getListingForEdit,
  updateListing,
  uploadListingImage,
  deleteListingImage,
} from "@/lib/listings";
import { Listing } from "@/lib/constants";
import { ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // إعادة التوجيه إذا غير مسجل
  // ========================================

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?next=/my/edit/${id}`);
    }
  }, [user, authLoading, navigate, id]);

  // ========================================
  // جلب الإعلان
  // ========================================

  useEffect(() => {
    const fetchListing = async () => {
      if (!user || !id) return;

      try {
        const data = await getListingForEdit(id);

        if (!data) {
          setError("الإعلان غير موجود أو ليس لديك صلاحية تعديله");
          return;
        }

        setListing(data);
      } catch (err: unknown) {
        console.error("Error fetching listing:", err);
        const error = err as { message?: string };
        setError(error.message || "حدث خطأ في تحميل الإعلان");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchListing();
    }
  }, [user, id]);

  // ========================================
  // معالجة الحفظ
  // ========================================

  const handleSubmit = async (
    formData: ListingFormData,
    newImages: File[],
    deletedImageIds: string[]
  ) => {
    if (!id || !listing) return;

    setIsSubmitting(true);

    try {
      // تحويل بيانات المرافق
      const utilities = {
        water:
          formData.utilities.water === "available"
            ? true
            : formData.utilities.water === "limited"
            ? "limited"
            : false,
        electricity:
          formData.utilities.electricity === "available"
            ? true
            : formData.utilities.electricity === "limited"
            ? "limited"
            : false,
        internet:
          formData.utilities.internet === "available"
            ? true
            : formData.utilities.internet === "limited"
            ? "limited"
            : false,
      };

      // تحديث الإعلان
      await updateListing(id, {
        title: formData.title,
        type: formData.type,
        property_type: formData.property_type,
        area: formData.area,
        price: formData.price ? parseInt(formData.price) : null,
        price_note: formData.price_note || null,
        rooms: formData.property_type === "apartment" ? parseInt(formData.rooms) : null,
        floor_area: formData.property_type !== "apartment" && formData.floor_area ? parseInt(formData.floor_area) : null,
        capacity: parseInt(formData.capacity),
        utilities,
        description: formData.description || null,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        whatsapp_enabled: formData.whatsapp_enabled,
      });

      // حذف الصور المحذوفة ورفع الجديدة بشكل متوازي
      const deletePromises = deletedImageIds.map((imageId) => {
        const imageToDelete = listing.listing_images?.find(
          (img) => img.id === imageId
        );
        if (imageToDelete) {
          return deleteListingImage(imageId, imageToDelete.url).catch((err) => {
            console.error("Error deleting image:", err);
          });
        }
        return Promise.resolve();
      });

      const uploadPromises = newImages.map((file) =>
        uploadListingImage(id, file).catch((err) => {
          console.error("Error uploading image:", err);
        })
      );

      await Promise.all([...deletePromises, ...uploadPromises]);

      toast({ title: "تم تحديث الإعلان بنجاح" });
      navigate("/my");
    } catch (err: unknown) {
      console.error("Error updating listing:", err);
      const error = err as { message?: string };
      toast({
        title: "حدث خطأ في تحديث الإعلان",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // عرض حالة التحميل
  // ========================================

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // سيتم إعادة التوجيه
  }

  // ========================================
  // عرض حالة الخطأ
  // ========================================

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center max-w-md mx-auto">
          <AlertTriangle className="w-16 h-16 mx-auto text-destructive/50 mb-4" />
          <h2 className="text-xl font-bold mb-2">غير مصرح</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/my">
            <Button>العودة لإعلاناتي</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center max-w-md mx-auto">
          <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-bold mb-2">الإعلان غير موجود</h2>
          <p className="text-muted-foreground mb-6">
            ربما تم حذف هذا الإعلان
          </p>
          <Link to="/my">
            <Button>العودة لإعلاناتي</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ========================================
  // العرض
  // ========================================

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 max-w-2xl mx-auto">
        <Link
          to="/my"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة لإعلاناتي
        </Link>

        <h1 className="text-2xl font-bold mb-6">تعديل الإعلان</h1>

        <ListingForm
          initialData={listing}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="حفظ التغييرات"
          onCancel={() => navigate("/my")}
        />
      </main>
    </div>
  );
}
