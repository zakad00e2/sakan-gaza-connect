import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase يتعامل تلقائياً مع الـ hash fragments
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          return;
        }

        if (data.session) {
          // تم تسجيل الدخول بنجاح
          // جلب الـ redirect URL من localStorage إذا كان موجوداً
          const redirectTo = localStorage.getItem("auth_redirect") || "/";
          localStorage.removeItem("auth_redirect");
          navigate(redirectTo, { replace: true });
        } else {
          // لا يوجد session، ربما انتهت صلاحية الرابط
          setError("انتهت صلاحية الرابط أو تم استخدامه مسبقاً");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("حدث خطأ غير متوقع");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <div className="text-destructive text-lg font-semibold">{error}</div>
          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:underline"
          >
            العودة لصفحة تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}
