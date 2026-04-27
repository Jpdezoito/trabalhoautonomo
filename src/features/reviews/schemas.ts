import { z } from "zod";
import { platformConfig } from "@/config/platform";

export const reviewSchema = z.object({
  workerSlug: z.string().min(1, "Profissional obrigatorio."),
  author: z.string().max(80, "Use ate 80 caracteres.").optional().or(z.literal("")),
  email: z.email("Informe um e-mail valido.").optional().or(z.literal("")),
  showName: z.boolean().optional().default(false),
  serviceReference: z.string().max(120, "Use ate 120 caracteres.").optional().or(z.literal("")),
  rating: z.coerce.number().int().min(platformConfig.minimumReviewRating).max(platformConfig.maximumReviewRating),
  title: z.string().min(3, "Digite um titulo curto.").max(80, "Use ate 80 caracteres."),
  comment: z.string().min(10, "Conte um pouco mais sobre o atendimento.").max(800, "Use ate 800 caracteres."),
});

export const reviewModerationSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(["published", "hidden", "rejected", "flagged"]),
  note: z.string().max(500).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
