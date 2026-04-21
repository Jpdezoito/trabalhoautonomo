import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";

export const ratingOptions = [
  { label: "Todas as notas", value: "" },
  { label: "4,5 ou mais", value: "4.5" },
  { label: "4,0 ou mais", value: "4" },
  { label: "3,5 ou mais", value: "3.5" },
] as const;

export const priceOptions = [
  { label: "Qualquer preco", min: "", max: "" },
  { label: "Ate R$ 100", min: "0", max: "100" },
  { label: "R$ 100 a R$ 300", min: "100", max: "300" },
  { label: "R$ 300 a R$ 800", min: "300", max: "800" },
  { label: "Acima de R$ 800", min: "800", max: "" },
] as const;

export const sortOptions = [
  { label: "Mais relevantes", value: "relevance" },
  { label: "Melhor avaliados", value: "rating" },
  { label: "Menor preco inicial", value: "price_asc" },
  { label: "Maior preco inicial", value: "price_desc" },
  { label: "Resposta mais rapida", value: "response_time" },
  { label: "Mais experientes", value: "experience" },
] as const;

export const searchFilterOptions = {
  categories: publicCategories,
  cities,
  neighborhoods,
  ratings: ratingOptions,
  prices: priceOptions,
  sorting: sortOptions,
};
