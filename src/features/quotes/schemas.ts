import { z } from "zod";

export const quoteRequestSchema = z.object({
  workerId: z.string().min(1),
  workerSlug: z.string().optional(),
  clientName: z.string().min(2, "Informe seu nome."),
  clientEmail: z.string().email("Informe um e-mail valido."),
  clientPhone: z.string().min(10, "Informe um telefone ou WhatsApp valido."),
  serviceType: z.string().min(3, "Informe o servico desejado."),
  city: z.string().min(2, "Informe a cidade."),
  neighborhood: z.string().min(2, "Informe o bairro."),
  description: z.string().min(20, "Descreva o servico com pelo menos 20 caracteres."),
  extraNotes: z.string().max(600, "Use no maximo 600 caracteres.").optional(),
  preferredDate: z.string().optional(),
  budgetMin: z.coerce.number().positive().optional(),
  budgetMax: z.coerce.number().positive().optional(),
});

export const quoteStatusSchema = z.enum(["OPEN", "IN_CONTACT", "ACCEPTED", "DECLINED", "COMPLETED"]);

export const workerQuoteStatusUpdateSchema = z.object({
  quoteId: z.string().min(1),
  status: quoteStatusSchema,
});
