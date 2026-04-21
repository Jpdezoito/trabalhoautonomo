import { z } from "zod";

export const searchFiltersSchema = z.object({
  keyword: z.string().trim().optional(),
  service: z.string().trim().optional(),
  category: z.string().trim().optional(),
  city: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  availableOnly: z.coerce.boolean().optional(),
  minimumRating: z.coerce.number().min(1).max(5).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  withPortfolio: z.coerce.boolean().optional(),
  sortBy: z.enum(["relevance", "rating", "price_asc", "price_desc", "response_time", "experience"]).optional(),
});
