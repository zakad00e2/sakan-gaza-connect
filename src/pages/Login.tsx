import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithMagicLink, signInWithGoogle, signInWithFacebook } from "@/lib/auth";
import { ArrowRight, Loader2, Mail, Facebook } from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const nextUrl = searchParams.get("next") || "/";

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({ title: "يرجى إدخال البريد الإلكتروني", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await signInWithMagicLink(email.trim(), nextUrl);
      setMagicLinkSent(true);
      toast({ title: "تم إرسال رابط الدخول إلى بريدك الإلكتروني" });
    } catch (error: unknown) {
      console.error("Magic link error:", error);
      const err = error as { message?: string };
      toast({
        title: err.message || "حدث خطأ أثناء إرسال الرابط",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(nextUrl);
    } catch (error: unknown) {
      console.error("Google login error:", error);
      const err = error as { message?: string };
      toast({
        title: err.message || "حدث خطأ أثناء تسجيل الدخول بـ Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      await signInWithFacebook(nextUrl);
    } catch (error: unknown) {
      console.error("Facebook login error:", error);
      const err = error as { message?: string };
      toast({
        title: err.message || "حدث خطأ أثناء تسجيل الدخول بـ Facebook",
        variant: "destructive",
      });
      setIsFacebookLoading(false);
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
            <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
            <p className="text-muted-foreground">
              سجل دخولك لتتمكن من إضافة إعلان
            </p>
          </div>

          {magicLinkSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">تحقق من بريدك الإلكتروني</h2>
              <p className="text-muted-foreground text-sm">
                أرسلنا رابط الدخول إلى <span className="font-medium text-foreground" dir="ltr">{email}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                اضغط على الرابط في البريد للدخول تلقائياً
              </p>
              <Button
                variant="ghost"
                onClick={() => setMagicLinkSent(false)}
                className="mt-4"
              >
                استخدام بريد آخر
              </Button>
            </div>
          ) : (
            <>
              {/* Facebook Login */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full btn-touch gap-3 mb-3 text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/5"
                onClick={handleFacebookLogin}
                disabled={isFacebookLoading || isGoogleLoading}
              >
                {isFacebookLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Facebook className="w-5 h-5" />
                )}
                الدخول عبر Facebook
              </Button>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full btn-touch gap-3 mb-6"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isFacebookLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                الدخول عبر Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              {/* Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-5">
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
                  <p className="text-xs text-muted-foreground">
                    سنرسل لك رابط دخول مباشر بدون كلمة مرور
                  </p>
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
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال رابط الدخول"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
