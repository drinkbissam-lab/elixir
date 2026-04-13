import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
  compact?: boolean;
}

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  className,
  compact = false,
}: QuantitySelectorProps) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border bg-card shadow-sm",
        compact ? "gap-1 px-1 py-1" : "gap-2 px-2 py-2",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted",
          compact ? "h-8 w-8" : "h-10 w-10",
        )}
        aria-label={t("decreaseQuantity")}
        title={t("decreaseQuantity")}
      >
        <Minus className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </button>

      <span
        className={cn(
          "text-center font-semibold text-foreground",
          compact ? "min-w-8 text-sm" : "min-w-10 text-base",
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted",
          compact ? "h-8 w-8" : "h-10 w-10",
        )}
        aria-label={t("increaseQuantity")}
        title={t("increaseQuantity")}
      >
        <Plus className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </button>
    </div>
  );
}
