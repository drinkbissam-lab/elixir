import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { clearCart } from "@/lib/cart";
import { updateOrder } from "@/lib/orders";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(t("orderConfirmedSuccessfully"));
  const [isVerifying, setIsVerifying] = useState(true);
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      setMessage(t("orderNotFoundMessage"));
      setIsVerifying(false);
      return;
    }

    try {
      // Update order status
      updateOrder(orderId, {
        status: "confirmed",
        payment_status: "completed",
      });

      clearCart();
      setMessage(t("redirectingToAccountMessage"));
      toast({
        title: t("orderSuccess"),
        description: "تم تسجيل الطلب بنجاح",
      });

      setTimeout(() => {
        navigate("/account");
      }, 1800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ أثناء معالجة الطلب");
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("errorProcessing"),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate, orderId, t, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
          ✓
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">{t("orderSuccess")}</h1>
        <p className="mb-6 text-muted-foreground">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/account")} className="flex-1 bg-primary text-primary-foreground">
            {t("goToAccountButton")}
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
            {t("homeButton")}
          </Button>
        </div>

        {isVerifying && <p className="mt-4 text-sm text-muted-foreground">{t("processing")}</p>}
      </div>
    </div>
  );
}
