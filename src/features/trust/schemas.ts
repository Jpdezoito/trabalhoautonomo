import { z } from "zod";

export const trustVerificationRequestSchema = z.object({
  documentType: z.string().min(2, "Informe o tipo de documento."),
  documentReference: z.string().min(4, "Informe uma referencia do documento."),
  addressReference: z.string().optional(),
  activityReference: z.string().optional(),
  consentIdentity: z.boolean().refine((value) => value, {
    message: "Aceite o consentimento para verificacao de identidade.",
  }),
  consentBackground: z.boolean().optional(),
  requestBackgroundCheck: z.boolean().optional(),
});

export const trustVerificationReviewSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "VERIFIED", "REJECTED", "NEEDS_REVIEW"]),
  reviewNotes: z.string().max(800, "Use ate 800 caracteres.").optional(),
});
