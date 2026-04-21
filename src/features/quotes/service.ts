import type { QuoteLifecycleStatus, QuoteRequestInput, QuoteRequestRecord } from "@/features/quotes/types";

export function createQuoteDraft(input: QuoteRequestInput, workerName = "Profissional"): QuoteRequestRecord {
  return {
    id: crypto.randomUUID(),
    code: createQuoteCode(),
    workerName,
    ...input,
    status: "OPEN" as const,
    createdAt: new Date().toISOString(),
  };
}

export function createQuoteCode() {
  return `ORC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const quoteStatusLabels: Record<QuoteLifecycleStatus, string> = {
  OPEN: "Novo",
  IN_CONTACT: "Em contato",
  ACCEPTED: "Aceito",
  DECLINED: "Recusado",
  COMPLETED: "Concluido",
};

export const quoteStatusVariants: Record<QuoteLifecycleStatus, "primary" | "info" | "success" | "danger" | "neutral"> = {
  OPEN: "primary",
  IN_CONTACT: "info",
  ACCEPTED: "success",
  DECLINED: "danger",
  COMPLETED: "neutral",
};
