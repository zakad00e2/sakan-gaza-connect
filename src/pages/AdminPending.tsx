import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle, Eye, Loader2, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { getPendingListings, approveListing, rejectListing } from "@/lib/listings";
import { Listing } from "@/lib/constants";
import { LISTING_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPending() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [listingToReject, setListingToReject] = useState<Listing | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingListings();
      setListings(data);
    } catch (error) {
      console.error("Error fetching pending listings:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل تحميل الإعلانات المعلقة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchPending();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleApprove = async (listing: Listing) => {
    try {
      setActioningId(listing.id);
      await approveListing(listing.id);
      toast({
        title: "تمت الموافقة",
        description: "تم نشر الإعلان بنجاح",
      });
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
    } catch (error) {
      console.error("Error approving listing:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل الموافقة على الإعلان",
        variant: "destructive",
      });
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectClick = (listing: Listing) => {
    setListingToReject(listing);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!listingToReject) return;
    try {
      setActioningId(listingToReject.id);
      await rejectListing(listingToReject.id);
      toast({
        title: "تم الرفض",
        description: "تم رفض الإعلان ولن يظهر في الموقع",
      });
      setListings((prev) => prev.filter((l) => l.id !== listingToReject.id));
      setRejectDialogOpen(false);
      setListingToReject(null);
    } catch (error) {
      console.error("Error rejecting listing:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل رفض الإعلان",
        variant: "destructive",
      });
    } finally {
      setActioningId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12">
            <Loader2 className="inline-block w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                الوصول مرفوض
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {!user
                  ? "يجب تسجيل الدخول للوصول إلى صفحة الموافقة على الإعلانات"
                  : "هذه الصفحة مخصصة للمسؤولين فقط"}
              </p>
              {!user ? (
                <Link to="/login">
                  <Button className="w-full">تسجيل الدخول</Button>
                </Link>
              ) : (
                <Link to="/">
                  <Button className="w-full">العودة للصفحة الرئيسية</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            إعلانات قيد المراجعة
          </h1>
          <p className="text-muted-foreground mt-2">
            الموافقة على الإعلانات الجديدة قبل ظهورها في الموقع
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="inline-block w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">جاري تحميل الإعلانات...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد إعلانات معلقة</h3>
              <p className="text-muted-foreground">
                جميع الإعلانات تمت مراجعتها، أو لم يُضف إعلان جديد بعد.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* الصورة */}
                  <div className="sm:w-48 shrink-0 aspect-video sm:aspect-square bg-muted">
                    {listing.listing_images?.[0]?.url ? (
                      <img
                        src={listing.listing_images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        لا صورة
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4">
                    <CardHeader className="p-0 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <Badge variant="secondary">{LISTING_TYPES[listing.type]}</Badge>
                        <Badge variant="outline">
                          {PROPERTY_TYPES[listing.property_type] ?? listing.property_type}
                        </Badge>
                      </div>
                      <CardDescription>{formatDate(listing.created_at)}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">المنطقة:</span>{" "}
                        <span className="font-medium">{listing.area}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">المعلن:</span>{" "}
                        <span className="font-medium">{listing.contact_name}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">السعر:</span>{" "}
                        <span className="font-medium">
                          {listing.price
                            ? `${listing.price.toLocaleString("ar-EG")} ₪`
                            : listing.price_note || "—"}
                        </span>
                      </p>
                      {listing.description && (
                        <p className="text-muted-foreground line-clamp-2 mt-2">
                          {listing.description}
                        </p>
                      )}
                    </CardContent>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link to={`/listing/${listing.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          معاينة
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(listing)}
                        disabled={actioningId === listing.id}
                      >
                        {actioningId === listing.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        موافقة
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleRejectClick(listing)}
                        disabled={actioningId === listing.id}
                      >
                        {actioningId === listing.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        رفض
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>رفض الإعلان</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رفض هذا الإعلان؟ لن يظهر في الموقع وستظهر حالته للمُعلن كـ &quot;مخفي&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setListingToReject(null);
              }}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              رفض
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
