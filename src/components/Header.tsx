import { Link } from "react-router-dom";
import { Home, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">سكن غزة</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/safety">
            <Button variant="ghost" size="sm" className="gap-1">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">نصائح الأمان</span>
            </Button>
          </Link>
          <Link to="/add">
            <Button size="sm" className="gap-1 btn-touch h-10">
              <Plus className="w-4 h-4" />
              أضف إعلان
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
