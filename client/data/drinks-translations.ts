import type { Language } from "@/hooks/use-language";

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

export const drinksTranslations: DrinkTranslation[] = [
  {
    id: "0",
    name: {
      en: "ELIXIR TRINITY COLLECTION",
      fr: "COLLECTION TRINITÉ ÉLIXIR",
      ar: "مجموعة إكسير الثلاثية",
    },
    description: {
      en: "",
      fr: "",
      ar: "",
    },
    ingredients: {
      en: [
        "Natural hibiscus rich in antioxidants",
        "Fresh tropical pineapple pieces",
        "Pure ice",
        "Natural desert honey",
        "Selected desert plants",
      ],
      fr: [
        "Hibiscus naturel riche en antioxydants",
        "Morceaux d'ananas tropicaux frais",
        "Glaçons purs",
        "Miel désertique naturel",
        "Plantes désertiques sélectionnées",
      ],
      ar: [
        "كركديه طبيعي غني بمضادات الأكسدة",
        "قطع أناناس طازجة استوائية",
        "ثلج نقي",
        "عسل صحراوي طبيعي",
        "نباتات صحراوية مختارة",
      ],
    },
    price: 500,
    image: "/image 9.jpeg",
  },
  {
    id: "1",
    name: {
      en: "BISSAM ORGANIC",
      fr: "BISSAM BIOLOGIQUE",
      ar: "بيصام عضوي",
    },
    description: {
      en: "Organic Cordial | 150 g",
      fr: "Sirop Biologique | 150 g",
      ar: "شراب عضوي | 150 غرام",
    },
    ingredients: {
      en: ["Dried hibiscus", "Natural honey", "Beeswax", "Baobab fruit (Tabaldi)"],
      fr: [
        "Hibiscus séché",
        "Miel naturel",
        "Cire d'abeille",
        "Fruit de Baobab (Tabaldi)",
      ],
      ar: ["كركديه مجفف", "عسل طبيعي", "شمع العسل", "ثمار التبلدي (الباوباب)"],
    },
    price: 30,
    image: "/image 0.jpeg",
  },
  {
    id: "2",
    name: {
      en: "OASIS BALANCE ELIXIR",
      fr: "ÉLIXIR ÉQUILIBRE OASIS",
      ar: "إكسير توازن الواحة",
    },
    description: {
      en: "Dietary Supplement | 150 g Powder",
      fr: "Complément Alimentaire | 150 g Poudre",
      ar: "مكمل غذائي | 150 غرام مسحوق",
    },
    ingredients: {
      en: ["Dried hibiscus", "Natural honey", "Fresh lemon", "Fresh mint"],
      fr: ["Hibiscus séché", "Miel naturel", "Citron frais", "Menthe fraîche"],
      ar: ["كركديه مجفف", "عسل طبيعي", "ليمون طازج", "نعناع طازج"],
    },
    price: 200,
    image: "/im4.jpeg",
  },
  {
    id: "3",
    name: {
      en: "NOMAD FUEL ELIXIR",
      fr: "ÉLIXIR CARBURANT NOMADE",
      ar: "إكسير وقود الرحالة",
    },
    description: {
      en: "Dietary Supplement | 150 g Edible Balls",
      fr: "Complément Alimentaire | 150 g Boules Comestibles",
      ar: "مكمل غذائي | 150 غرام كرات صالحة للأكل",
    },
    ingredients: {
      en: ["Dried hibiscus", "Natural desert honey", "Fresh orange"],
      fr: ["Hibiscus séché", "Miel désertique naturel", "Orange fraîche"],
      ar: ["كركديه مجفف", "عسل صحراوي طبيعي", "برتقال طازج"],
    },
    price: 200,
    image: "/im3.jpeg",
  },
];

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
