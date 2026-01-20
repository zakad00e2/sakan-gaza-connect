import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/lib/auth";
import { ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nextUrl = searchParams.get("next") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الصحة
    if (!fullName.trim()) {
      toast({ title: "يرجى إدخال الاسم", variant: "destructive" });
      return;
    }
    if (!email.trim()) {
      toast({ title: "يرجى إدخال البريد الإلكتروني", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "كلمتا المرور غير متطابقتين", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const { user, session } = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      if (session) {
        // تسجيل دخول مباشر
        toast({ title: "تم إنشاء الحساب بنجاح!" });
        navigate(nextUrl);
      } else if (user) {
        // يحتاج تأكيد البريد
        toast({
          title: "تم إنشاء الحساب",
          description: "يرجى تأكيد بريدك الإلكتروني للدخول",
        });
        navigate("/login");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);

      let message = "حدث خطأ أثناء إنشاء الحساب";
      const err = error as { message?: string };
      if (err.message?.includes("already registered")) {
        message = "هذا البريد الإلكتروني مسجل مسبقاً";
      } else if (err.message?.includes("Password")) {
        message = "كلمة المرور ضعيفة، اختر كلمة أقوى";
      }

      toast({
        title: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground">
              سجل للتمكن من إضافة وإدارة إعلاناتك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أحمد محمد"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 input-touch"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 input-touch"
                  dir="ltr"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 input-touch"
                  dir="ltr"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                6 أحرف على الأقل
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 input-touch"
                  dir="ltr"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full btn-touch"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">لديك حساب؟ </span>
            <Link
              to={`/login${nextUrl !== "/" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
              className="text-primary hover:underline font-medium"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
