import { CreditCard, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface PaymentOptionsProps {
  drinkName: string;
  quantity: number;
  price: number;
  onConfirm?: (paymentMethod: string) => void;
}

export default function PaymentOptions({
  drinkName,
  quantity,
  price,
  onConfirm,
}: PaymentOptionsProps) {
  const { t } = useLanguage();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const totalPrice = price * quantity;

  const handleConfirm = () => {
    if (selectedPayment && onConfirm) {
      onConfirm(selectedPayment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-muted rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t("orderSummaryTitle")}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{drinkName}</span>
            <span className="text-foreground font-medium">× {quantity}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{t("total")}:</span>
              <span className="text-2xl font-bold text-primary">
                {t("currencySymbol")} {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("selectPaymentMethod")}
        </h3>

        {/* Cash on Delivery Option */}
        <button
          onClick={() => setSelectedPayment("cash")}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selectedPayment === "cash"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                selectedPayment === "cash"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}
            >
              {selectedPayment === "cash" && (
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              )}
            </div>
            <div className="text-right flex-1">
              <div className="flex items-center gap-2 justify-between">
                <h4 className="text-base font-semibold text-foreground">
                  {t("cashOnDeliveryPayment")}
                </h4>
                <Truck className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("payOnDeliveryDesc")}
              </p>
            </div>
          </div>
        </button>

        {/* Visa Payment Option */}
        <button
          onClick={() => setSelectedPayment("visa")}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selectedPayment === "visa"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                selectedPayment === "visa"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}
            >
              {selectedPayment === "visa" && (
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              )}
            </div>
            <div className="text-right flex-1">
              <div className="flex items-center gap-2 justify-between">
                <h4 className="text-base font-semibold text-foreground">
                  {t("visaPaymentOption")}
                </h4>
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("paySecurelyWithCard")}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!selectedPayment}
        size="lg"
        className={`w-full py-6 text-base ${
          selectedPayment
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {t("confirmOrderButton")}
      </Button>
    </div>
  );
}
