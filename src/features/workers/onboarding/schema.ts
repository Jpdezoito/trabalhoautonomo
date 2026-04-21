import { z } from "zod";

const qualificationSchema = z.object({
  id: z.string(),
  type: z.enum(["education", "course", "certification", "license"]),
  title: z.string().min(2, "Informe o titulo."),
  institution: z.string(),
  year: z.string().optional(),
  registrationNumber: z.string().optional(),
  previewUrl: z.string().optional(),
});

const portfolioSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string(),
  previewUrl: z.string().optional(),
  evidenceType: z.enum(["activity_proof", "worker_on_site", "workshop_evidence", "vehicle_evidence", "portfolio_proof"]),
  workerVisible: z.boolean(),
});

export const workerOnboardingDraftSchema = z.object({
  fullName: z.string().min(3, "Informe seu nome completo."),
  profilePhotoPreview: z.string().optional(),
  coverImagePreview: z.string().optional(),
  publicName: z.string().min(2, "Informe o nome que sera exibido no perfil."),
  professionTitle: z.string().min(3, "Informe seu titulo profissional."),
  categorySlug: z.string().min(1, "Escolha uma categoria principal."),
  additionalCategorySlugs: z.array(z.string().min(1)),
  services: z.array(z.string().min(2)).min(1, "Adicione pelo menos um servico."),
  startingPrice: z.string().min(2, "Informe um preco inicial ou criterio de orcamento."),
  city: z.string().min(2, "Informe sua cidade."),
  neighborhood: z.string().min(2, "Informe seu bairro base."),
  serviceAreas: z.array(z.string().min(2)).min(1, "Adicione pelo menos uma area atendida."),
  workAreaSummary: z.string().min(10, "Explique como e onde voce atende."),
  description: z.string().min(40, "Descreva sua experiencia com pelo menos 40 caracteres."),
  whatsapp: z.string().min(10, "Informe um WhatsApp valido."),
  phone: z.string().min(10, "Informe um telefone valido."),
  email: z.string().email("Informe um e-mail valido."),
  availability: z.string().min(5, "Informe sua disponibilidade."),
  emergencyAvailable: z.boolean(),
  identityDocumentReference: z.string().min(4, "Informe a referencia do documento de identidade."),
  identityDocumentPreview: z.string().optional(),
  addressProofPreview: z.string().optional(),
  termsAccepted: z.boolean(),
  verificationConsentAccepted: z.boolean(),
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
  portfolio: z.array(portfolioSchema),
  experienceYears: z.string(),
  experienceSummary: z.string(),
  educationLevel: z.string(),
  courseSummary: z.string(),
  collegeName: z.string(),
  licenseRegistrationNumber: z.string(),
  meiNumber: z.string(),
  companyName: z.string(),
  companyDocument: z.string(),
  qualifications: z.array(qualificationSchema),
});

export const stepSchemas = {
  account: workerOnboardingDraftSchema.pick({
    fullName: true,
    publicName: true,
    professionTitle: true,
    whatsapp: true,
    phone: true,
    email: true,
  }),
  services: workerOnboardingDraftSchema.pick({
    categorySlug: true,
    services: true,
    startingPrice: true,
    city: true,
    neighborhood: true,
    serviceAreas: true,
    workAreaSummary: true,
    description: true,
    availability: true,
    emergencyAvailable: true,
  }),
  verification: workerOnboardingDraftSchema
    .pick({
      identityDocumentReference: true,
      identityDocumentPreview: true,
      addressProofPreview: true,
      termsAccepted: true,
      verificationConsentAccepted: true,
      facialEnrollment: true,
    })
    .superRefine((data, ctx) => {
      if (!data.identityDocumentPreview) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identityDocumentPreview"],
          message: "Envie o documento de identidade.",
        });
      }

      if (!data.addressProofPreview) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["addressProofPreview"],
          message: "Envie o comprovante de endereco.",
        });
      }

      if (!data.termsAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["termsAccepted"],
          message: "Aceite os termos para continuar.",
        });
      }

      if (!data.verificationConsentAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verificationConsentAccepted"],
          message: "Aceite o consentimento de verificacao.",
        });
      }

      if (!data.facialEnrollment.consentAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["facialEnrollment"],
          message: "Aceite o consentimento para registrar a verificacao facial.",
        });
      }

      if (!data.facialEnrollment.captureSource || !data.facialEnrollment.previewUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["facialEnrollment"],
          message: "Capture ou envie uma imagem para concluir a verificacao facial.",
        });
      }
    }),
  activity: workerOnboardingDraftSchema.pick({
    portfolio: true,
  }).superRefine((data, ctx) => {
    if (data.portfolio.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["portfolio"],
        message: "Envie pelo menos 3 imagens reais de trabalhos executados.",
      });
    }

    if (!data.portfolio.some((item) => item.workerVisible)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["portfolio"],
        message: "Inclua pelo menos uma imagem com voce no local ou junto ao trabalho, quando aplicavel.",
      });
    }
  }),
  qualifications: workerOnboardingDraftSchema.pick({
    experienceYears: true,
    experienceSummary: true,
    educationLevel: true,
    courseSummary: true,
    collegeName: true,
    licenseRegistrationNumber: true,
    meiNumber: true,
    companyName: true,
    companyDocument: true,
    qualifications: true,
  }),
  review: workerOnboardingDraftSchema.superRefine((data, ctx) => {
    if (!data.identityDocumentPreview) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identityDocumentPreview"],
        message: "Envie o documento de identidade.",
      });
    }

    if (!data.addressProofPreview) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addressProofPreview"],
        message: "Envie o comprovante de endereco.",
      });
    }

    if (!data.termsAccepted || !data.verificationConsentAccepted) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verificationConsentAccepted"],
        message: "Aceite os termos e consentimentos obrigatorios.",
      });
    }

    if (!data.facialEnrollment.captureSource || !data.facialEnrollment.previewUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["facialEnrollment"],
        message: "Conclua a verificacao facial.",
      });
    }

    if (data.portfolio.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["portfolio"],
        message: "Envie pelo menos 3 imagens reais de trabalhos executados.",
      });
    }
  }),
};
