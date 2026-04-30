import type { TrustVerificationStatus } from "@prisma/client";

export function mapTrustStatusToLabel(status?: TrustVerificationStatus | null) {
  if (status === "VERIFIED") return "Conta verificada";
  if (status === "IN_REVIEW") return "Verificação em análise";
  if (status === "PENDING") return "Pendente";
  if (status === "REJECTED") return "Rejeitado";
  if (status === "NEEDS_REVIEW") return "Revisão necessaria";

  return "Não verificado";
}

export function mapTrustStatusToFrontend(status?: TrustVerificationStatus | null) {
  if (status === "VERIFIED") return "verificado";
  if (status === "IN_REVIEW") return "em_analise";
  if (status === "PENDING") return "pendente";
  if (status === "REJECTED") return "rejeitado";
  if (status === "NEEDS_REVIEW") return "revisao_necessaria";

  return "nao_verificado";
}

export function mapTrustStatusToBadgeVariant(status?: TrustVerificationStatus | null) {
  if (status === "VERIFIED") return "success";
  if (status === "IN_REVIEW") return "info";
  if (status === "PENDING") return "warning";
  if (status === "REJECTED") return "danger";
  if (status === "NEEDS_REVIEW") return "warning";

  return "neutral";
}
