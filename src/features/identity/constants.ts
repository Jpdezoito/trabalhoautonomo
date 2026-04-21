export const identityFeatureFlags = {
  workerEnrollmentEnabled: true,
  clientEnrollmentEnabled: true,
  providerName: "internal-v1",
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxDataUrlLength: 6_000_000,
} as const;
