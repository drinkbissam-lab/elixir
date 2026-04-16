import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import QuantitySelector from "@/components/QuantitySelector";
import { Button } from "@/components/ui/button";
import { getTranslatedDrink } from "@/data/drinks-translations";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addCartItem } from "@/lib/cart";

export default function DrinkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const drink = getTranslatedDrink(id || "", language);

  if (!drink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">{t("drinkNotFound")}</h1>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
            {t("home")}
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addCartItem(
      {
        id: drink.id,
        name: drink.name,
        price: drink.price,
      },
      quantity,
      user?.id,
    );

    toast({
      title: t("success"),
      description: `${drink.name} × ${quantity} ${t("addedToCart")}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-foreground hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-center">
            <div className="aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-muted shadow-sm">
              <img src={drink.image} alt={drink.name} className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">{drink.name}</h1>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">د.م. {drink.price.toFixed(2)}</span>
              </div>
              <p className="mb-8 text-lg text-muted-foreground">{drink.description}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{t("quantity")}</p>
                  <QuantitySelector
                    quantity={quantity}
                    onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                    onIncrease={() => setQuantity((current) => current + 1)}
                  />
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-primary py-6 text-base text-primary-foreground hover:bg-primary/90 sm:w-auto sm:min-w-52"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("addToCart")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
