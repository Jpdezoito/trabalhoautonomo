export type QuoteLifecycleStatus = "OPEN" | "IN_CONTACT" | "ACCEPTED" | "DECLINED" | "COMPLETED";

export type QuoteRequestInput = {
  workerId: string;
  workerSlug?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  city: string;
  neighborhood: string;
  description: string;
  extraNotes?: string;
  preferredDate?: string;
  budgetMin?: number;
  budgetMax?: number;
};

export type QuoteRequestRecord = QuoteRequestInput & {
  id: string;
  code: string;
  workerName: string;
  status: QuoteLifecycleStatus;
  createdAt: string;
};
