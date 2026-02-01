import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ReportDialog } from "@/components/ReportDialog";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Listing, LISTING_TYPES, UTILITIES } from "@/lib/constants";
import {
  ArrowRight,
  MapPin,
  Users,
  BedDouble,
  Droplets,
  Zap,
  Wifi,
  Phone,
  MessageCircle,
  Loader2,
  AlertTriangle,
  Ruler,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("listings")
          .select(`
            *,
            listing_images (id, url)
          `)
          .eq("id", id)
          .eq("status", "active")
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError(true);
          return;
        }

        const anyData = data as Record<string, unknown>;
        setListing({
          ...data,
          type: data.type as "rent" | "sale",
          property_type: ((anyData.property_type as string) || "apartment") as "apartment" | "land" | "warehouse",
          rooms: data.rooms ?? null,
          floor_area: (anyData.floor_area as number) ?? null,
          status: data.status as "active" | "pending" | "hidden",
          utilities: (data.utilities as { water: boolean; electricity: boolean; internet: boolean }) || { water: false, electricity: false, internet: false },
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const formatPrice = () => {
    if (listing?.price) {
      return `${listing.price.toLocaleString("ar-EG")} ₪`;
    }
    return listing?.price_note || "تفاوض";
  };

  const getUtilityStatus = (value: boolean | string) => {
    if (value === true || value === "available") return { class: "utility-available", text: "متوفر" };
    if (value === "limited") return { class: "utility-limited", text: "محدود" };
    return { class: "utility-unavailable", text: "غير متوفر" };
  };

  const formatWhatsApp = (phone: string) => {
    // إزالة كل شيء عدا الأرقام
    let cleaned = phone.replace(/\D/g, "");
    
    // إذا بدأ بـ 00 نزيلها
    if (cleaned.startsWith("00")) {
      cleaned = cleaned.slice(2);
    }
    
    // إذا بدأ بـ 972 أو 970 نستخدم 972
    if (cleaned.startsWith("970")) {
      return "972" + cleaned.slice(3);
    }
    if (cleaned.startsWith("972")) {
      return cleaned;
    }
    
    // إذا بدأ بـ 0 (مثل 0597986160) نستبدله بـ 972
    if (cleaned.startsWith("0")) {
      return "972" + cleaned.slice(1);
    }
    
    // إذا كان 9 أرقام نضيف 972
    if (cleaned.length === 9) {
      return "972" + cleaned;
    }
    
    return "972" + cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-bold mb-2">الإعلان غير موجود</h2>
          <p className="text-muted-foreground mb-6">
            ربما تم حذف هذا الإعلان أو أنه غير متاح حالياً
          </p>
          <Link to="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 max-w-3xl mx-auto">
        {/* زر الرجوع */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للإعلانات
        </Link>

        {/* الصور */}
        <ImageCarousel images={listing.listing_images || []} />

        {/* التفاصيل */}
        <div className="mt-6 space-y-6">
          {/* العنوان والنوع */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={listing.type === "rent" ? "badge-rent" : "badge-sale"}>
                {LISTING_TYPES[listing.type]}
              </span>
              <h1 className="text-2xl font-bold mt-2">{listing.title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.area}</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-primary">{formatPrice()}</p>
              {listing.type === "rent" && <span className="text-sm text-muted-foreground">شهرياً</span>}
            </div>
          </div>

          {/* المعلومات الأساسية */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="grid grid-cols-2 gap-4">
              {listing.property_type === "apartment" && listing.rooms != null ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BedDouble className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">عدد الغرف</p>
                    <p className="font-bold">{listing.rooms}</p>
                  </div>
                </div>
              ) : listing.property_type !== "apartment" ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المساحة</p>
                    <p className="font-bold">{listing.floor_area || "—"} م²</p>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">سعة الأشخاص</p>
                  <p className="font-bold">{listing.capacity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* المرافق */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold mb-3">المرافق المتوفرة</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(UTILITIES).map(([key, label]) => {
                const status = getUtilityStatus(listing.utilities?.[key as keyof typeof listing.utilities]);
                const Icon = key === "water" ? Droplets : key === "electricity" ? Zap : Wifi;
                return (
                  <div
                    key={key}
                    className={`${status.class} flex flex-col items-center gap-1 p-3 rounded-xl`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs opacity-80">{status.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* الوصف */}
          {listing.description && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-bold mb-2">الوصف</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* معلومات التواصل */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold mb-3">التواصل</h3>
            <p className="text-muted-foreground mb-4">
              صاحب الإعلان: <strong className="text-foreground">{listing.contact_name}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {listing.whatsapp_enabled && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${formatWhatsApp(listing.contact_phone)}&text=${encodeURIComponent("مرحباً، رأيت إعلانك على موقع سكن غزة وأريد الاستفسار عنه")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp flex-1 justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  واتساب
                </a>
              )}
              <a
                href={`tel:${listing.contact_phone}`}
                className="contact-phone flex-1 justify-center"
              >
                <Phone className="w-5 h-5" />
                {listing.contact_phone}
              </a>
            </div>
          </div>

          {/* التاريخ والإبلاغ */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              نُشر {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: ar })}
            </span>
            <ReportDialog listingId={listing.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
