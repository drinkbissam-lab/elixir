import type { Language } from "@/hooks/use-language";
import { drinksTranslations } from "./drinksTranslations";

export interface TranslatedText {
  en: string;
  fr: string;
  ar: string;
}

export interface TranslatedIngredients {
  en: string[];
  fr: string[];
  ar: string[];
}

export interface DrinkTranslation {
  id: string;
  name: TranslatedText;
  description: TranslatedText;
  ingredients: TranslatedIngredients;
  price: number;
  image: string;
}

/**
 * Get translated drink data for a specific language
 * Falls back to English if translation is missing
 */
export function getTranslatedDrinks(language: Language) {
  return drinksTranslations.map((drink) => ({
    id: drink.id,
    name: drink.name[language] || drink.name.en,
    description: drink.description[language] || drink.description.en,
    ingredients: drink.ingredients[language] || drink.ingredients.en,
    price: drink.price,
    image: drink.image,
  }));
}

/**
 * Get a single translated drink by ID
 */
export function getTranslatedDrink(id: string, language: Language) {
  const drink = drinksTranslations.find((d) => d.id === id);
  if (!drink) return null;

  return {
    id: drink.id,
    name: drink.name[language] || drink.name.en,
    description: drink.description[language] || drink.description.en,
    ingredients: drink.ingredients[language] || drink.ingredients.en,
    price: drink.price,
    image: drink.image,
  };
}
