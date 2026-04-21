import { z } from "zod";

export const favoriteSchema = z.object({
  workerSlug: z.string().min(1, "Profissional obrigatorio."),
  action: z.enum(["add", "remove", "toggle"]).default("toggle"),
});

export type FavoriteInput = z.infer<typeof favoriteSchema>;
