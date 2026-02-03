import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">سياسة الخصوصية</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-right" dir="rtl">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">مقدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لموقعنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">المعلومات التي نجمعها</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              قد نجمع المعلومات التالية:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
              <li>المعلومات الشخصية مثل الاسم والبريد الإلكتروني عند التسجيل.</li>
              <li>معلومات عن العقارات التي تقوم بنشرها.</li>
              <li>بيانات الاتصال التي تشاركها للتواصل مع المستخدمين الآخرين.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">كيفية استخدام المعلومات</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم المعلومات لتقديم خدماتنا وتحسينها، وللتواصل معك بخصوص حسابك أو إعلاناتك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">تسجيل الدخول عبر أطراف ثالثة</h2>
            <p className="text-gray-600 leading-relaxed">
              عند استخدامك لخيارات تسجيل الدخول عبر Google أو Facebook، فإننا نجمع فقط المعلومات الأساسية اللازمة لإنشاء حسابك والمصرح بها من قبلك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">حذف البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              يمكنك طلب حذف بياناتك في أي وقت عن طريق التواصل معنا.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
