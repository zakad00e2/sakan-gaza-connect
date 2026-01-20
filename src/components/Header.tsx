import { Link } from "react-router-dom";
import { Home, Plus, Shield, User, LogOut, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
                        <span className="hidden sm:inline">حسابي</span>
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
                      <span className="hidden sm:inline">دخول</span>
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
      </div>
    </header>
  );
}
