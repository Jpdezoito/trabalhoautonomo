import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";

export const priceOptions = [
  { label: "Qualquer preço", min: "", max: "" },
  { label: "Ate R$ 100", min: "0", max: "100" },
  { label: "R$ 100 a R$ 300", min: "100", max: "300" },
  { label: "R$ 300 a R$ 800", min: "300", max: "800" },
  { label: "Acima de R$ 800", min: "800", max: "" },
] as const;

export const sortOptions = [
  { label: "Mais relevantes", value: "relevance" },
  { label: "Melhor avaliados", value: "rating" },
  { label: "Menor preço inicial", value: "price_asc" },
  { label: "Maior preço inicial", value: "price_desc" },
  { label: "Resposta mais rápida", value: "response_time" },
  { label: "Mais experientes", value: "experience" },
] as const;

export const searchFilterOptions = {
  categories: publicCategories,
  cities,
  neighborhoods,
  prices: priceOptions,
  sorting: sortOptions,
};
