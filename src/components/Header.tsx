import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Plus, Shield, User, LogOut, List, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14 sm:h-16 px-4">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-primary">سكن غزة</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link to="/safety">
            <Button variant="ghost" size="sm" className="gap-1">
              <Shield className="w-4 h-4" />
              نصائح الأمان
            </Button>
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link to="/add">
                    <Button size="sm" className="gap-1 btn-touch h-10">
                      <Plus className="w-4 h-4" />
                      أضف إعلان
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 h-10">
                        <User className="w-4 h-4" />
                        حسابي
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/my" className="flex items-center gap-2 cursor-pointer">
                          <List className="w-4 h-4" />
                          إعلاناتي
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="gap-1 h-10">
                      <User className="w-4 h-4" />
                      دخول
                    </Button>
                  </Link>
                  <Link to="/add">
                    <Button size="sm" className="gap-1 btn-touch h-10">
                      <Plus className="w-4 h-4" />
                      أضف إعلان
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-primary/20">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-right">القائمة</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 mt-6">
                 <Link to="/add" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                    <Plus className="w-5 h-5" />
                    أضف إعلان
                  </Button>
                </Link>

                <Link to="/safety" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                    <Shield className="w-5 h-5" />
                    نصائح الأمان
                  </Button>
                </Link>

               

                {!loading && (
                  <>
                    {user ? (
                      <>
                        <div className="border-t border-border my-2" />
                        <Link to="/my" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                            <List className="w-5 h-5" />
                            إعلاناتي
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start gap-2 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="w-5 h-5" />
                          تسجيل الخروج
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-border my-2" />
                        <Link to="/login" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                            <User className="w-5 h-5" />
                            تسجيل الدخول
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                            <User className="w-5 h-5" />
                            إنشاء حساب
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
