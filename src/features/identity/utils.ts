import type { FacialEnrollmentStatus, UserRole } from "@prisma/client";
import { identityFeatureFlags } from "@/features/identity/constants";
import type { FacialEnrollmentDraft, FacialEnrollmentSummary, FacialVerificationStatus, IdentityAudience } from "@/features/identity/types";

export function getIdentityAudienceLabel(audience: IdentityAudience) {
  return audience === "profissional" ? "profissional" : "cliente";
}

export function mapPrismaFacialStatusToFrontend(status?: FacialEnrollmentStatus | null): FacialVerificationStatus {
  if (status === "APPROVED") return "aprovado";
  if (status === "REJECTED") return "rejeitado";
  if (status === "IN_REVIEW") return "em_analise";

  return "pendente";
}

export function getFacialStatusLabel(status?: FacialVerificationStatus | "") {
  if (status === "aprovado") return "Aprovado";
  if (status === "rejeitado") return "Rejeitado";
  if (status === "em_analise") return "Em analise";
  if (status === "pendente") return "Pendente";

  return "Nao iniciado";
}

export function createDefaultFacialEnrollmentDraft(): FacialEnrollmentDraft {
  return {
    consentAccepted: false,
    captureSource: "",
    status: "",
    retryCount: 0,
    recoveryEnabled: false,
  };
}

export function getFacialStatusTone(status?: FacialVerificationStatus | "") {
  if (status === "aprovado") return "success";
  if (status === "rejeitado") return "danger";
  if (status === "em_analise") return "info";

  return "warning";
}

export function isIdentityVerificationEnabledForRole(role: UserRole | "CLIENT" | "WORKER") {
  if (role === "WORKER") {
    return identityFeatureFlags.workerEnrollmentEnabled;
  }

  return identityFeatureFlags.clientEnrollmentEnabled;
}

export function buildFacialEnrollmentSummary(input: {
  id?: string;
  status?: FacialVerificationStatus | "";
  captureSource?: "webcam" | "upload";
  consentAccepted?: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  retryCount?: number;
  recoveryEnabled?: boolean;
}): FacialEnrollmentSummary {
  return {
    id: input.id,
    status: input.status || "pendente",
    captureSource: input.captureSource,
    consentAccepted: input.consentAccepted ?? false,
    submittedAt: input.submittedAt,
    reviewedAt: input.reviewedAt,
    reviewNotes: input.reviewNotes,
    retryCount: input.retryCount ?? 0,
    recoveryEnabled: input.recoveryEnabled ?? false,
  };
}
