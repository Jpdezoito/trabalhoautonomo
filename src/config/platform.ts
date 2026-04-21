export const platformConfig = {
  name: "AutonomoPro",
  supportEmail: "suporte@autonomopro.com.br",
  defaultCity: "Sao Paulo",
  defaultCountry: "BR",
  quoteResponseTargetHours: 24,
  minimumReviewRating: 1,
  maximumReviewRating: 5,
  featureFlags: {
    whatsappContact: true,
    profileModeration: true,
    workerVerification: true,
    publicReviews: true,
    favorites: true,
  },
} as const;

export type PlatformConfig = typeof platformConfig;
