import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";

import QuantitySelector from "@/components/QuantitySelector";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CART_UPDATED_EVENT, CartItem, getCartItems, setCartItems } from "@/lib/cart";

export default function Cart() {
  const [cartItems, setCartState] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const syncCart = () => setCartState(getCartItems(user?.id));

    syncCart();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [user?.id]);

  const updateCart = (items: CartItem[]) => {
    setCartState(items);
    setCartItems(items, user?.id);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
    toast({
      description: t("deleteAddressSuccess"),
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );

    updateCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 10;
  const total = subtotal + delivery;

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: t("pleaseLogin"),
        description: t("loginToCheckout"),
      });
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-4 text-3xl font-bold text-foreground">{t("emptyCart")}</h1>
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">{t("startShopping")}</p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">{t("selectedDrinks")}</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="font-bold text-primary">د.م. {item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <QuantitySelector
                    compact
                    quantity={item.quantity}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                    title={t("remove")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-20 h-fit rounded-2xl bg-card p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-foreground">{t("summary")}</h2>

            <div className="mb-6 space-y-4 border-b border-border pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-semibold">د.م. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("delivery")}</span>
                <span className="font-semibold">د.م. {delivery.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6 flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-primary">د.م. {total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-primary py-6 text-lg font-bold text-primary-foreground hover:bg-primary/90"
            >
              {t("proceedToCheckout")}
            </Button>

            <Link to="/" className="mt-4 block">
              <Button variant="outline" className="w-full">
                {t("continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
