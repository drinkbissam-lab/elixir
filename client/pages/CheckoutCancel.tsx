import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { updateOrder } from "@/lib/orders";

export default function CheckoutCancel() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(t("paymentCancelledMessage"));

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      updateOrder(orderId, {
        status: "cancelled",
        payment_status: "cancelled",
      });
    }

    const timer = setTimeout(() => {
      navigate("/checkout");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600 dark:bg-red-950">
          ×
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">{t("cancelled")}</h1>
        <p className="mb-6 text-muted-foreground">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/checkout")} className="flex-1 bg-primary text-primary-foreground">
            {t("backToCheckoutBtn")}
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
            {t("homeButton")}
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{t("redirectingToCheckoutMessage")}</p>
      </div>
    </div>
  );
}
