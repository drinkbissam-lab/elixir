export interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
  ingredients: string[];
  description?: string;
}

export const drinks: Drink[] = [
  {
    id: "0",
    name: "بيصام طبيعي",
    price: 20,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fd93e2cbf758c499f8097e596610f40f7%2F2b3026e24fff47d7a8f9daa79ebb7690?format=webp&width=800&height=1200",
    description: "مشروب طبيعي استثنائي بمكونات صحراوية طبيعية",
    ingredients: ["كركديه طبيعي غني بمضادات الأكسدة", "قطع أناناس طازجة استوائية", "ثلج نقي", "عسل صحراوي طبيعي", "نباتات صحراوية مختارة"],
  },
  {
    id: "1",
    name: "كركديه التبلدي و العسل",
    price: 30,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fd93e2cbf758c499f8097e596610f40f7%2Fc95335967b0e44969777d81b01feaf41?format=webp&width=800&height=1200",
    description: "مشروب طبيعي بنكهة زهرية حمضية",
    ingredients: ["كركديه مجفف", "عسل طبيعي", "شمع العسل", "ثمار التبلدي (الباوباب)"],
  },
  {
    id: "2",
    name: "كركديه النعناع و الليمون",
    price: 30,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fd93e2cbf758c499f8097e596610f40f7%2F148140be20994034aa761ba1eb5d807b?format=webp&width=800&height=1200",
    description: "مزيج منعش بنكهة حمضية طبيعية",
    ingredients: ["كركديه مجفف", "عسل طبيعي", "ليمون طازج", "نعناع طازج"],
  },
  {
    id: "3",
    name: "كركديه العسل و البرتقال",
    price: 30,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fd93e2cbf758c499f8097e596610f40f7%2F1aec9781bd7d4251a4b0a8a19b2b004d?format=webp&width=800&height=1200",
    description: "مشروب دافئ بنكهة حمضية منعشة",
    ingredients: ["كركديه مجفف", "عسل صحراوي طبيعي", "برتقال طازج"],
  },
  {
    id: "4",
    name: "مزيج التجفيف الصحراوي",
    price: 40,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fd93e2cbf758c499f8097e596610f40f7%2F3febf68c48834065b87444cbbba50bdb?format=webp&width=800&height=1200",
    description: "مزيج استوائي من الفواكه المجففة",
    ingredients: ["أناناس مجفف", "نعناع مجفف", "كركديه مجفف", "تبلدي مجفف", "شرائح ليمون مجفف", "شرائح برتقال مجفف"],
  },
  {
    id: "5",
    name: "المثلثة",
    price: 30,
    image: "https://cdn.builder.io/api/v1/image/assets%2F3cb1ea1ba7f14d53bd22812ecb87640e%2Fe2cce7aed8034fb7809cde3c79a076e5?format=webp&width=800&height=1200",
    description: "مشروب تقليدي بنكهات صحراوية أصيلة",
    ingredients: ["مكونات صحراوية طبيعية", "أعشاب طبية", "عسل أصلي", "ثلج نقي"],
  },
];
