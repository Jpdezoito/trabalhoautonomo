import { createDefaultFacialEnrollmentDraft } from "@/features/identity/utils";
import type { ClientOnboardingDraft } from "@/features/clients/onboarding/types";

export const defaultClientOnboardingDraft: ClientOnboardingDraft = {
  fullName: "",
  profileNote: "",
  city: "",
  neighborhood: "",
  favoriteCategories: [],
  serviceInterests: [],
  whatsapp: "",
  phone: "",
  email: "",
  facialEnrollment: createDefaultFacialEnrollmentDraft(),
};

export function calculateClientOnboardingProgress(draft: ClientOnboardingDraft) {
  const checks = [
    draft.fullName.length >= 2,
    draft.city.length >= 2,
    draft.neighborhood.length >= 2,
    draft.favoriteCategories.length > 0,
    draft.serviceInterests.length > 0,
    draft.whatsapp.length >= 10,
    draft.phone.length >= 10,
    draft.email.includes("@"),
    draft.facialEnrollment.status === "" || draft.facialEnrollment.status === "em_analise" || draft.facialEnrollment.status === "aprovado",
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}
