import { MessageCircle, Heart, Facebook, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container px-4 py-6 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 items-start">
          
          {/* قسم التعريف */}
          <div className="text-right py-4 md:py-9 space-y-2">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="العودة للصفحة الرئيسية">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
                <Home className="w-6 h-6 text-primary-foreground " />
              </div>
              <span className="text-2xl font-bold text-primary">سكن غزة</span>
            </Link>
            <p className="text-lg text-muted-foreground max-w-md md:max-w-none leading-relaxed">
              منصة تهدف لتسهيل البحث عن سكن للعائلات النازحة في قطاع غزة.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="hidden md:flex flex-col items-center md:items-start gap-4 md:pl-8 lg:pl-0 w-full md:w-auto">
            <h4 className="font-bold text-lg text-foreground w-full text-right md:text-right">روابط هامة</h4>
            <nav className="grid grid-cols-2 gap-3 text-sm text-muted-foreground w-full md:flex md:flex-col md:items-start">
              <Link to="/" className="hover:text-primary hover:-translate-x-1 transition-all duration-300 flex items-center justify-start gap-2">
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity"></span>
                الرئيسية
              </Link>
              <Link to="/add" className="hover:text-primary hover:-translate-x-1 transition-all duration-300 flex items-center justify-start gap-2">
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity"></span>
                أضف إعلان
              </Link>
              <Link to="/my" className="hover:text-primary hover:-translate-x-1 transition-all duration-300 flex items-center justify-start gap-2">
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity"></span>
                إعلاناتي
              </Link>
              <Link to="/safety" className="hover:text-primary hover:-translate-x-1 transition-all duration-300 flex items-center justify-start gap-2">
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity"></span>
                نصائح الأمان
              </Link>
              <Link to="/privacy-policy" className="hover:text-primary hover:-translate-x-1 transition-all duration-300 flex items-center justify-start gap-2">
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity"></span>
                سياسة الخصوصية
              </Link>
            </nav>
          </div>


          {/* قسم التواصل */}
          <div className="flex flex-col items-start gap-4 w-full md:w-auto">
            <h4 className="font-bold text-lg text-foreground w-full text-right">تواصل معنا</h4>
            <div className="flex flex-row md:flex-col gap-4 w-full items-start">
              <a 
                href="https://wa.me/+9720597986160" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline group"
                aria-label="تواصل معنا عبر واتساب"
              >
                <div className="flex items-center gap-3 transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-green-600 transition-colors" aria-hidden="true" />
                  <span className="font-medium text-sm text-muted-foreground group-hover:text-green-600 transition-colors">واتساب</span>
                </div>
              </a>

              <a 
                href="https://www.facebook.com/profile.php?id=61587479751048" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline group"
                aria-label="تابعنا على فيسبوك"
              >
                <div className="flex items-center gap-3 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" aria-hidden="true" />
                  <span className="font-medium text-sm text-muted-foreground group-hover:text-blue-600 transition-colors">فيسبوك</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* الحقوق */}
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>جميع الحقوق محفوظة - سكن غزة © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
