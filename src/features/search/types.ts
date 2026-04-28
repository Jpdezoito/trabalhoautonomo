export type SearchFilters = {
  keyword?: string;
  service?: string;
  category?: string;
  city?: string;
  neighborhood?: string;
  verifiedOnly?: boolean;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  withPortfolio?: boolean;
  sortBy?: SearchSortOption;
  quality?: string;
};

export type SearchSortOption = "relevance" | "rating" | "price_asc" | "price_desc" | "response_time" | "experience";

export type SearchResultWorker = {
  priceAmount: number;
  worker: import("@/types/marketplace").Worker;
};
