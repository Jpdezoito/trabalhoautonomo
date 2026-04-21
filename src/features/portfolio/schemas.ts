import { z } from "zod";

export const portfolioImageFileSchema = z
  .custom<File>((file) => file instanceof File, "Envie um arquivo de imagem.")
  .refine((file) => file.type.startsWith("image/"), "Envie um arquivo de imagem.")
  .refine((file) => file.size <= 3 * 1024 * 1024, "A imagem deve ter no maximo 3 MB.");

export const portfolioItemSchema = z.object({
  title: z.string().min(3, "Informe um titulo com pelo menos 3 caracteres.").max(90, "Use no maximo 90 caracteres."),
  description: z.string().max(500, "Use no maximo 500 caracteres.").optional(),
  imageUrl: z.string().min(1, "Adicione uma imagem."),
  city: z.string().min(2).optional(),
  completedAt: z.string().optional(),
});

export const portfolioDraftItemSchema = portfolioItemSchema.extend({
  id: z.string().min(1),
  sortOrder: z.number().int().min(0),
  isFeatured: z.boolean(),
});
