import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CART_UPDATED_EVENT, CartItem, getCartItems } from "@/lib/cart";
import { upsertOrder, updateOrder } from "@/lib/orders";

const formatCurrency = (value: number) => `د.م. ${value.toFixed(2)}`;

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<"alamal" | "alqassim" | "other" | "">("");
  const [customAddress, setCustomAddress] = useState("");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [paymentMethod, setPaymentMethod] = useState<"cod">("cod");
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCartItems(user?.id));
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate delivery fee based on selected neighborhood
  const delivery = (selectedNeighborhood === "alamal" || selectedNeighborhood === "alqassim") ? 10 : 20;
  const total = subtotal + delivery;

  // Use custom address for delivery
  const deliveryAddress = customAddress;

  useEffect(() => {
    const syncCart = () => setCartItems(getCartItems(user?.id));

    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const validateCheckoutForm = () => {
    if (!user) {
      toast({
        title: t("error"),
        description: t("loginRequired"),
        variant: "destructive",
      });
      navigate("/login");
      return false;
    }

    if (!selectedNeighborhood) {
      toast({
        title: t("error"),
        description: t("selectNeighborhoodError"),
        variant: "destructive",
      });
      return false;
    }

    if (!customAddress.trim()) {
      toast({
        title: t("error"),
        description: t("enterAddressDetailsError"),
        variant: "destructive",
      });
      return false;
    }

    if (!phone || phone.length < 10) {
      toast({
        title: t("error"),
        description: t("errorPhoneRequired"),
        variant: "destructive",
      });
      return false;
    }

    if (!cartItems.length) {
      toast({
        title: t("error"),
        description: t("emptyCart"),
        variant: "destructive",
      });
      navigate("/");
      return false;
    }

    return true;
  };

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateCheckoutForm()) {
      return;
    }

    setIsLoading(true);

    const orderId = `order-${Date.now()}`;
    const itemsText = cartItems.map((item) => `${item.name} x${item.quantity}`).join(", ");
    const pendingOrder = {
      id: orderId,
      date: new Date().toLocaleDateString(),
      items: itemsText,
      total,
      status: "pending" as const,
      payment_status: "pending" as const,
      payment_method: paymentMethod,
    };

    upsertOrder(pendingOrder as any, user?.id);
    localStorage.setItem("userPhone", phone);

    try {
      // Cash on Delivery - Order placed successfully
      updateOrder(orderId, {
        status: "confirmed",
        payment_status: "pending",
      });

      // Send order confirmation email
      try {
        const getNeighborhoodName = (neighborhood: string) => {
          const neighborhoods: { [key: string]: string } = {
            alamal: "أحياء العمال",
            alqassim: "البقيع/القسم",
            other: "احياء اخرى",
          };
          return neighborhoods[neighborhood] || neighborhood;
        };

        const customerName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "عميل";

        await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            customerName,
            customerEmail: user?.email,
            phoneNumber: phone,
            neighborhood: getNeighborhoodName(selectedNeighborhood),
            address: deliveryAddress,
            addressDetails: deliveryAddress,
            items: itemsText,
            total,
            paymentMethod: paymentMethod === "cod" ? "cash" : "card",
          }),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      toast({
        title: t("orderConfirmedMessage"),
        description: t("contactSoonForConfirmation"),
      });

      setTimeout(() => {
        // Clear cart
        localStorage.setItem("cartItems", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/account");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      updateOrder(orderId, {
        status: "failed",
        payment_status: "failed",
      });

      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("errorProcessing"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">{t("emptyCart")}</h1>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t("continueShopping")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="sticky top-20 rounded-2xl bg-card p-6 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{t("orderSummary")}</h2>

              <div className="mb-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("delivery")}</span>
                  <span className="font-semibold">{formatCurrency(delivery)}</span>
                </div>
                <div className="-mx-6 flex justify-between bg-primary/10 px-6 py-3 text-lg font-bold">
                  <span>{t("total")}</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-lg sm:p-8">
              <h2 className="mb-2 text-2xl font-bold text-foreground">{t("orderConfirmation")}</h2>
              <p className="mb-6 text-muted-foreground">
                {t("selectPaymentMethodDesc")}
              </p>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="mb-4 block text-sm font-medium text-foreground">{t("deliveryAddress")}</label>
                  <div className="space-y-3">
                    {/* Al Amal Neighborhood */}
                    <div className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedNeighborhood("alamal")}>
                      <input
                        type="radio"
                        name="neighborhood"
                        value="alamal"
                        checked={selectedNeighborhood === "alamal"}
                        onChange={() => setSelectedNeighborhood("alamal")}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t("almohFieldArea")}</p>
                      </div>
                    </div>

                    {/* Al Qassim Neighborhood */}
                    <div className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedNeighborhood("alqassim")}>
                      <input
                        type="radio"
                        name="neighborhood"
                        value="alqassim"
                        checked={selectedNeighborhood === "alqassim"}
                        onChange={() => setSelectedNeighborhood("alqassim")}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t("alqassimArea")}</p>
                      </div>
                    </div>

                    {/* Other Neighborhood */}
                    <div className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedNeighborhood("other")}>
                      <input
                        type="radio"
                        name="neighborhood"
                        value="other"
                        checked={selectedNeighborhood === "other"}
                        onChange={() => setSelectedNeighborhood("other")}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t("otherArea")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Details Input - Always shown */}
                  {selectedNeighborhood && (
                    <textarea
                      value={customAddress}
                      onChange={(event) => setCustomAddress(event.target.value)}
                      placeholder={t("enterAddressDetailsPlaceholder")}
                      rows={3}
                      className="mt-4 w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{t("phoneNumber")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                    placeholder={t("enterPhoneNumber")}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">{t("paymentMethodLabel")}</label>
                  <div className="space-y-3">
                    {/* Cash on Delivery Option */}
                    <div className="flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-4 dark:bg-green-900/20">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        disabled
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-foreground">{t("cashOnDeliveryLabel")}</p>
                        <p className="text-xs text-muted-foreground">{t("payOnDeliveryDirectly")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Summary */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                  <p className="font-medium">{t("cashOnDeliveryLabel")}</p>
                  <p className="mt-1">{t("totalAmountLabel")} {formatCurrency(total)}</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? t("processing") : `${t("confirmOrderWithAmount")} ${formatCurrency(total)}`}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
