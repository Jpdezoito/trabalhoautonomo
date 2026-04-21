import type { FacialEnrollmentDraft } from "@/features/identity/types";

export type ClientOnboardingDraft = {
  profilePhotoPreview?: string;
  fullName: string;
  profileNote: string;
  city: string;
  neighborhood: string;
  favoriteCategories: string[];
  serviceInterests: string[];
  whatsapp: string;
  phone: string;
  email: string;
  facialEnrollment: FacialEnrollmentDraft;
};

export type ClientOnboardingStepId = "profile" | "location" | "interests" | "contact" | "verification" | "review";

export type ClientOnboardingStep = {
  id: ClientOnboardingStepId;
  title: string;
  description: string;
};
