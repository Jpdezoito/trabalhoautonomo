import type { FacialEnrollmentDraft } from "@/features/identity/types";

export type WorkerActivityEvidenceType =
  | "activity_proof"
  | "worker_on_site"
  | "workshop_evidence"
  | "vehicle_evidence"
  | "portfolio_proof";

export type PortfolioDraftItem = {
  id: string;
  title: string;
  description: string;
  previewUrl?: string;
  evidenceType: WorkerActivityEvidenceType;
  workerVisible: boolean;
};

export type WorkerQualificationDraft = {
  id: string;
  type: "education" | "course" | "certification" | "license";
  title: string;
  institution: string;
  year?: string;
  registrationNumber?: string;
  previewUrl?: string;
};

export type WorkerOnboardingDraft = {
  fullName: string;
  profilePhotoPreview?: string;
  coverImagePreview?: string;
  publicName: string;
  professionTitle: string;
  categorySlug: string;
  additionalCategorySlugs: string[];
  services: string[];
  startingPrice: string;
  city: string;
  neighborhood: string;
  serviceAreas: string[];
  workAreaSummary: string;
  description: string;
  whatsapp: string;
  phone: string;
  email: string;
  availability: string;
  emergencyAvailable: boolean;
  identityDocumentReference: string;
  identityDocumentPreview?: string;
  addressProofPreview?: string;
  termsAccepted: boolean;
  verificationConsentAccepted: boolean;
  facialEnrollment: FacialEnrollmentDraft;
  portfolio: PortfolioDraftItem[];
  experienceYears: string;
  experienceSummary: string;
  educationLevel: string;
  courseSummary: string;
  collegeName: string;
  licenseRegistrationNumber: string;
  meiNumber: string;
  companyName: string;
  companyDocument: string;
  qualifications: WorkerQualificationDraft[];
};

export type OnboardingStepId = "account" | "services" | "verification" | "activity" | "qualifications" | "review";

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  description: string;
};
