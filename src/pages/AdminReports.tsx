import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, Trash2, Eye, Flag, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
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

interface Report {
  id: string;
  created_at: string;
  reason: string;
  details: string | null;
  listing_id: string;
  listing?: {
    id: string;
    title: string;
    area: string;
    status: string;
    contact_name: string;
  };
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"report" | "listing" | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          listing:listings(
            id,
            title,
            area,
            status,
            contact_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل تحميل البلاغات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", selectedReport.id);

      if (error) throw error;

      toast({
        title: "تم حذف البلاغ",
        description: "تم حذف البلاغ بنجاح",
      });

      setReports(reports.filter((r) => r.id !== selectedReport.id));
      setDeleteDialogOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل حذف البلاغ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteListing = async () => {
    if (!selectedReport?.listing) return;

    try {
      // حذف الإعلان
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", selectedReport.listing.id);

      if (error) throw error;

      toast({
        title: "تم حذف الإعلان",
        description: "تم حذف الإعلان المبلغ عنه بنجاح",
      });

      // حذف جميع البلاغات المرتبطة بهذا الإعلان
      setReports(reports.filter((r) => r.listing_id !== selectedReport.listing_id));
      setDeleteDialogOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل حذف الإعلان",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (report: Report, type: "report" | "listing") => {
    setSelectedReport(report);
    setActionType(type);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                  ? "يجب تسجيل الدخول للوصول إلى لوحة إدارة البلاغات"
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
            <Flag className="w-8 h-8 text-primary" />
            إدارة البلاغات
          </h1>
          <p className="text-muted-foreground mt-2">
            عرض وإدارة البلاغات المقدمة من المستخدمين
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل البلاغات...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Flag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد بلاغات</h3>
              <p className="text-muted-foreground">
                لا توجد بلاغات مقدمة حالياً
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Flag className="w-5 h-5 text-destructive" />
                        {report.listing?.title || "إعلان محذوف"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(report.created_at)}
                      </CardDescription>
                    </div>
                    {report.listing && (
                      <Badge
                        variant={report.listing.status === "active" ? "default" : "secondary"}
                      >
                        {report.listing.status === "active" ? "نشط" : "غير نشط"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">سبب البلاغ:</h4>
                      <Badge variant="destructive">{report.reason}</Badge>
                    </div>

                    {report.details && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">التفاصيل:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {report.details}
                        </p>
                      </div>
                    )}

                    {report.listing && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">معلومات الإعلان:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm bg-muted p-3 rounded-md">
                          <div>
                            <span className="text-muted-foreground">المنطقة:</span>{" "}
                            <span className="font-medium">{report.listing.area}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">اسم المعلن:</span>{" "}
                            <span className="font-medium">{report.listing.contact_name}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      {report.listing && (
                        <>
                          <Link to={`/listing/${report.listing.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              عرض الإعلان
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                            onClick={() => openDeleteDialog(report, "listing")}
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف الإعلان
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 mr-auto"
                        onClick={() => openDeleteDialog(report, "report")}
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف البلاغ فقط
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "listing" ? "حذف الإعلان" : "حذف البلاغ"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "listing"
                ? "هل أنت متأكد من حذف هذا الإعلان؟ سيتم حذف جميع البلاغات المرتبطة به أيضاً. هذا الإجراء لا يمكن التراجع عنه."
                : "هل أنت متأكد من حذف هذا البلاغ؟ هذا الإجراء لا يمكن التراجع عنه."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "listing" ? handleDeleteListing : handleDeleteReport}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
