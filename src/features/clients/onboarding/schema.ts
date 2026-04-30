import { z } from "zod";

export const clientOnboardingDraftSchema = z.object({
  profilePhotoPreview: z.string().optional(),
  fullName: z.string().min(2, "Informe seu nome completo."),
  profileNote: z.string().max(240, "Use no máximo 240 caracteres."),
  city: z.string().min(2, "Escolha sua cidade principal."),
  neighborhood: z.string().min(2, "Escolha seu bairro principal."),
  favoriteCategories: z.array(z.string().min(1)).min(1, "Escolha pelo menos uma categoria."),
  serviceInterests: z.array(z.string().min(2)).min(1, "Adicione pelo menos um interesse de serviço."),
  whatsapp: z.string().min(10, "Informe um WhatsApp valido."),
  phone: z.string().min(10, "Informe um telefone valido."),
  email: z.string().email("Informe um e-mail valido."),
  facialEnrollment: z.object({
    consentAccepted: z.boolean(),
    captureSource: z.enum(["", "webcam", "upload"]),
    previewUrl: z.string().optional(),
    status: z.enum(["", "pendente", "em_analise", "aprovado", "rejeitado"]),
    retryCount: z.number().int().min(0),
    submittedAt: z.string().optional(),
    reviewNotes: z.string().optional(),
    recoveryEnabled: z.boolean().optional(),
  }),
});

export const clientStepSchemas = {
  profile: clientOnboardingDraftSchema.pick({
    fullName: true,
    profileNote: true,
  }),
  location: clientOnboardingDraftSchema.pick({
    city: true,
    neighborhood: true,
  }),
  interests: clientOnboardingDraftSchema.pick({
    favoriteCategories: true,
    serviceInterests: true,
  }),
  contact: clientOnboardingDraftSchema.pick({
    whatsapp: true,
    phone: true,
    email: true,
  }),
  verification: clientOnboardingDraftSchema.pick({
    facialEnrollment: true,
  }).superRefine((data, ctx) => {
    if (!data.facialEnrollment.consentAccepted) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["facialEnrollment"],
        message: "Aceite o consentimento para registrar a verificação facial.",
      });
    }

    if (!data.facialEnrollment.captureSource || !data.facialEnrollment.previewUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["facialEnrollment"],
        message: "Capture ou envie uma imagem para concluir a verificação facial.",
      });
    }
  }),
  review: clientOnboardingDraftSchema,
};
