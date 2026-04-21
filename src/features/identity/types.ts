export type FacialVerificationStatus = "pendente" | "em_analise" | "aprovado" | "rejeitado";

export type FacialCaptureSource = "webcam" | "upload";

export type FacialEnrollmentDraft = {
  consentAccepted: boolean;
  captureSource: "" | FacialCaptureSource;
  previewUrl?: string;
  status: "" | FacialVerificationStatus;
  retryCount: number;
  submittedAt?: string;
  reviewNotes?: string;
  recoveryEnabled?: boolean;
};

export type FacialEnrollmentSummary = {
  id?: string;
  status: FacialVerificationStatus;
  captureSource?: FacialCaptureSource;
  consentAccepted: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  retryCount: number;
  recoveryEnabled: boolean;
};

export type IdentityAudience = "cliente" | "profissional";
