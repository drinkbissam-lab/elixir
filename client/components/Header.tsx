import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { CART_UPDATED_EVENT, getCartCount, getCartItems } from "@/lib/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const syncCartState = () => {
      setCartCount(getCartCount(getCartItems(user?.id)));
    };

    syncCartState();

    const handleCartUpdate = () => syncCartState();

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, [user?.id]);

  useEffect(() => {
    setCartCount(getCartCount(getCartItems(user?.id)));
  }, [location.pathname, user?.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {t("brandLogo")}
          </div>
          <span className="text-base font-bold text-foreground sm:text-lg">{t("brandName")}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/settings" title={t("settings")}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" title={t("shoppingCart")} className="relative h-10 w-10">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {!user ? (
            <Link to="/login">
              <Button size="sm" className="h-10 px-4 text-sm">
                <User className="mr-2 h-4 w-4" />
                {t("login")}
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate("/account")}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary sm:flex"
                title={t("myAccount")}
              >
                <User className="h-4 w-4" />
                <span className="max-w-28 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </span>
              </button>
              <button
                onClick={() => navigate("/account")}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted hover:text-primary sm:hidden"
                title={t("myAccount")}
              >
                <User className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted hover:text-primary"
                title={t("logout")}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
