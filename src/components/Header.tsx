import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Plus, Shield, User, LogOut, List, Menu, Flag, ChevronDown, ClipboardCheck, MessageCircle } from "lucide-react";
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
import { useIsAdmin } from "@/hooks/use-is-admin";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border" role="banner">
      <div className="container flex items-center justify-between h-14 sm:h-16 px-4">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2" aria-label="سكن غزة - الصفحة الرئيسية">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
            <Home className="w-6 h-6 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-primary">سكن غزة</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-2">
          
       

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
                  
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 h-10"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        حسابي
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-48"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <DropdownMenuItem asChild>
                        <Link to="/my" className="flex items-center gap-2 cursor-pointer">
                          <List className="w-4 h-4" />
                          إعلاناتي
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/pending" className="flex items-center gap-2 cursor-pointer">
                              <ClipboardCheck className="w-4 h-4" />
                              إعلانات المراجعة
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/reports" className="flex items-center gap-2 cursor-pointer">
                              <Flag className="w-4 h-4" />
                              البلاغات
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
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
                  <Link to="/add">
                    <Button size="sm" className="gap-1 btn-touch h-10">
                      <Plus className="w-4 h-4" />
                      أضف إعلان
                    </Button>
                  </Link>
                     <Link to="/safety">
            <Button variant="ghost" size="sm" className="gap-1">
              <Shield className="w-4 h-4" />
              نصائح الأمان
            </Button>
          </Link>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="gap-1 h-10">
                      <User className="w-4 h-4" />
                      دخول
                    </Button>
                  </Link>
                
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile Navigation: زر إضافة إعلان بجانب زر القائمة */}
        <div className="sm:hidden flex items-center gap-2">
          <Link to="/add">
            <Button size="sm" className="gap-1 btn-touch h-10">
              <Plus className="w-4 h-4" />
              أضف إعلان
            </Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-primary/20 shrink-0" aria-label="فتح القائمة">
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
                        {isAdmin && (
                          <>
                            <Link to="/admin/pending" onClick={closeMobileMenu}>
                              <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                                <ClipboardCheck className="w-5 h-5" />
                                إعلانات المراجعة
                              </Button>
                            </Link>
                            <Link to="/admin/reports" onClick={closeMobileMenu}>
                              <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                                <Flag className="w-5 h-5" />
                                البلاغات
                              </Button>
                            </Link>
                          </>
                        )}
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
                        {/* <Link to="/signup" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                            <User className="w-5 h-5" />
                            إنشاء حساب
                          </Button>
                        </Link> */}
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
