import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldAlert,
  Eye,
  CreditCard,
  Phone,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Safety() {
  const tips = [
    {
      icon: Eye,
      title: "عاين السكن قبل الدفع",
      description: "لا تدفع أي مبلغ قبل أن ترى السكن بنفسك وتتأكد من حالته ومطابقته للوصف.",
      color: "text-primary",
    },
    {
      icon: CreditCard,
      title: "لا تدفع عربون مقدماً",
      description: "احذر من طلب عربون أو حجز قبل المعاينة. هذا أسلوب احتيال شائع.",
      color: "text-destructive",
    },
    {
      icon: Phone,
      title: "تحقق من هوية المعلن",
      description: "تأكد من أن الشخص الذي تتواصل معه هو فعلاً مالك العقار أو وكيله المعتمد.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "اصطحب شخصاً معك",
      description: "عند المعاينة، اصطحب أحد أفراد عائلتك أو صديقاً موثوقاً للأمان.",
      color: "text-primary",
    },
    {
      icon: AlertTriangle,
      title: "أبلغ عن المشبوهين",
      description: "إذا شككت في أي إعلان، استخدم زر الإبلاغ لتنبيهنا ومساعدة الآخرين.",
      color: "text-warning",
    },
  ];

  const redFlags = [
    "طلب دفع مبلغ قبل المعاينة",
    "أسعار أقل بكثير من المعتاد (قد تكون خدعة)",
    "الإلحاح الشديد على إتمام الصفقة بسرعة",
    "رفض إعطاء معلومات واضحة عن الموقع",
    "طلب تحويل المال عبر وسيط أو شخص ثالث",
    "صور لا تتطابق مع الوصف أو تبدو احترافية جداً",
  ];

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

        {/* العنوان */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">نصائح الأمان</h1>
          <p className="text-muted-foreground">
            احمِ نفسك وعائلتك من الاستغلال والاحتيال
          </p>
        </div>

        {/* تحذير مهم */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-destructive mb-1">تحذير هام جداً</h2>
              <p className="text-sm">
                للأسف، هناك من يستغل ظروف النازحين الصعبة للاحتيال عليهم. كن حذراً 
                ولا تتردد في الإبلاغ عن أي إعلان مشبوه.
              </p>
            </div>
          </div>
        </div>

        {/* النصائح */}
        <div className="space-y-4 mb-8">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl p-4 border border-border flex gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0`}>
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              <div>
                <h3 className="font-bold mb-1">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* علامات الخطر */}
        <div className="bg-card rounded-2xl p-5 border border-border mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            علامات الخطر - كن حذراً إذا رأيت:
          </h2>
          <ul className="space-y-2">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* نصيحة إيجابية */}
        <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-success mb-1">تذكر</h2>
              <p className="text-sm">
                معظم الناس يريدون المساعدة بصدق. لكن الحذر واجب لحماية نفسك وعائلتك. 
                ثق بحدسك - إذا شعرت أن شيئاً غير صحيح، فربما يكون كذلك.
              </p>
            </div>
          </div>
        </div>

        {/* دعاء */}
        <div className="text-center text-muted-foreground">
          <p className="text-sm mb-4">
            نسأل الله أن يحفظ أهلنا في غزة ويفرج كربهم 🤲
          </p>
          <Link to="/">
            <Button variant="outline">العودة للإعلانات</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
