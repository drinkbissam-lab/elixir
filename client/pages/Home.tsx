import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";

import QuantitySelector from "@/components/QuantitySelector";
import { Button } from "@/components/ui/button";
import { getTranslatedDrinks } from "@/data/drinks-translations";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addCartItem } from "@/lib/cart";

export default function Home() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const drinks = getTranslatedDrinks(language);
  const featuredDrink = drinks[0];
  const otherDrinks = drinks.slice(1);

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, nextQuantity: number) => {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(1, nextQuantity),
    }));
  };

  const handleAddToCart = (drink: (typeof drinks)[number]) => {
    const quantity = getQuantity(drink.id);

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
      <section className="relative h-96 w-full overflow-hidden bg-cover bg-center bg-no-repeat">
        <img
          src="/image 1.jpeg"
          alt="Welcome banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tighter leading-tight">
              ✦ {t("welcomeMessage")} ✦
            </h2>
          </div>
        </div>
      </section>

      <section 
        className="relative h-96 w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/image 10.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </section>

      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
              {t("featuredDrink")}
            </span>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("featuredDrink")}</h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl bg-card shadow-lg md:grid-cols-2 lg:gap-12">
            <Link to={`/drink/${featuredDrink.id}`} className="relative block h-80 overflow-hidden md:h-full">
              <img
                src={featuredDrink.image}
                alt={featuredDrink.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <div className="p-6 sm:p-8 lg:p-12">
              <h3 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">{featuredDrink.name}</h3>
              <p className="mb-6 text-lg text-muted-foreground">{featuredDrink.description}</p>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{t("currencySymbol")} {featuredDrink.price.toFixed(2)}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                  {t("readyToOrder")}
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <QuantitySelector
                  quantity={getQuantity(featuredDrink.id)}
                  onDecrease={() => updateQuantity(featuredDrink.id, getQuantity(featuredDrink.id) - 1)}
                  onIncrease={() => updateQuantity(featuredDrink.id, getQuantity(featuredDrink.id) + 1)}
                />

                <div className="flex flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link to={`/drink/${featuredDrink.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {t("viewDetails")}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(featuredDrink)}
                    className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("addToCart")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">{t("drinks")}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherDrinks.map((drink) => (
              <div key={drink.id} className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md">
                <Link to={`/drink/${drink.id}`} className="group block">
                  <div className="relative h-48 overflow-hidden bg-muted sm:h-56">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="mb-2 line-clamp-2 text-base font-semibold text-card-foreground sm:text-lg">
                      {drink.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{drink.description}</p>
                  </div>
                </Link>

                <div className="mt-auto space-y-4 border-t border-border p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-primary sm:text-xl">
                      {t("currencySymbol")} {drink.price.toFixed(2)}
                    </span>
                    <QuantitySelector
                      compact
                      quantity={getQuantity(drink.id)}
                      onDecrease={() => updateQuantity(drink.id, getQuantity(drink.id) - 1)}
                      onIncrease={() => updateQuantity(drink.id, getQuantity(drink.id) + 1)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/drink/${drink.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t("viewDetails")}
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      title={t("addToCart")}
                      onClick={() => handleAddToCart(drink)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("buy")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
