import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ListingForm, ListingFormData } from "@/components/ListingForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createListing, uploadListingImage } from "@/lib/listings";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ========================================
  // إعادة التوجيه إذا غير مسجل
  // ========================================

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?next=/add");
    }
  }, [user, authLoading, navigate]);

  // ========================================
  // معالجة الإرسال
  // ========================================

  const handleSubmit = async (
    formData: ListingFormData,
    newImages: File[],
    _deletedImageIds: string[]
  ) => {
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

      // إنشاء الإعلان
      const listing = await createListing({
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

      // رفع الصور بشكل متوازي لتسريع العملية
      if (newImages.length > 0) {
        await Promise.all(
          newImages.map((file) =>
            uploadListingImage(listing.id, file).catch((err) => {
              console.error("Error uploading image:", err);
            })
          )
        );
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "حدث خطأ",
        description: error?.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // عرض حالة التحميل
  // ========================================

  if (authLoading) {
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
  // عرض حالة النجاح
  // ========================================

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-3">تم نشر إعلانك بنجاح!</h1>
          <p className="text-muted-foreground mb-8">
            إعلانك متاح الآن للجميع. نتمنى أن تجد من يحتاج لهذا السكن قريباً.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/">
              <Button className="w-full">العودة للرئيسية</Button>
            </Link>
            <Link to="/my">
              <Button variant="outline" className="w-full">
                عرض إعلاناتي
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // العرض الرئيسي
  // ========================================

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <h1 className="text-2xl font-bold mb-6">إضافة إعلان جديد</h1>

        <ListingForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="نشر الإعلان"
        />
      </main>
    </div>
  );
}
