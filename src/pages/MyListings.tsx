import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { MyListingCard } from "@/components/MyListingCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMyListings, deleteListing, updateListingStatus } from "@/lib/listings";
import { Listing, ListingStatus } from "@/lib/constants";
import { ArrowRight, Plus, Loader2, Package } from "lucide-react";

export default function MyListings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // حالة حذف الإعلان
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ========================================
  // إعادة التوجيه إذا غير مسجل
  // ========================================

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?next=/my");
    }
  }, [user, authLoading, navigate]);

  // ========================================
  // جلب الإعلانات
  // ========================================

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      try {
        const data = await getMyListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "حدث خطأ في تحميل الإعلانات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user, toast]);

  // ========================================
  // معالجة التعديل
  // ========================================

  const handleEdit = (id: string) => {
    navigate(`/my/edit/${id}`);
  };

  // ========================================
  // معالجة تغيير الحالة
  // ========================================

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await updateListingStatus(id, newStatus as ListingStatus);
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? { ...listing, status: newStatus as ListingStatus }
            : listing
        )
      );
      toast({
        title: newStatus === "active" ? "تم تفعيل الإعلان" : "تم إخفاء الإعلان",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "حدث خطأ في تحديث الحالة",
        variant: "destructive",
      });
    }
  };

  // ========================================
  // معالجة الحذف
  // ========================================

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      await deleteListing(deleteId);
      setListings((prev) => prev.filter((l) => l.id !== deleteId));
      toast({ title: "تم حذف الإعلان بنجاح" });
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "حدث خطأ في حذف الإعلان",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
  // العرض
  // ========================================

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 max-w-4xl mx-auto">
        {/* شريط التنقل */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Link>

          <Link to="/add">
            <Button className="gap-1">
              <Plus className="w-4 h-4" />
              إعلان جديد
            </Button>
          </Link>
        </div>

        {/* العنوان */}
        <h1 className="text-2xl font-bold mb-6">إعلاناتي</h1>

        {/* قائمة الإعلانات */}
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-bold mb-2">لا توجد إعلانات</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بإضافة أي إعلانات بعد
            </p>
            <Link to="/add">
              <Button>
                <Plus className="w-4 h-4 ml-1" />
                أضف إعلانك الأول
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <MyListingCard
                key={listing.id}
                listing={listing}
                onEdit={handleEdit}
                onDelete={setDeleteId}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}

        {/* نافذة تأكيد الحذف */}
        <ConfirmModal
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="حذف الإعلان"
          description="هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="حذف"
          cancelText="إلغاء"
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          variant="destructive"
        />
      </main>
    </div>
  );
}
