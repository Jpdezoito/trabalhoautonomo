"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Send } from "lucide-react";
import { z } from "zod";
import { LeadWhatsappButton } from "@/components/marketplace/lead-whatsapp-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, Input, Label, Textarea } from "@/components/ui/form";
import { quoteRequestSchema } from "@/features/quotes/schemas";
import { estimateQuotePrice, formatCurrency, type QuotePricingEstimate } from "@/lib/quote-pricing";
import type { Worker } from "@/types/marketplace";

type QuoteRequestFormProps = {
  worker: Worker;
};

type FormState = z.infer<typeof quoteRequestSchema>;

const initialFormState: FormState = {
  workerId: "",
  workerSlug: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  serviceType: "",
  city: "",
  neighborhood: "",
  description: "",
  extraNotes: "",
  preferredDate: "",
  budgetMin: undefined,
  budgetMax: undefined,
};

export function QuoteRequestForm({ worker }: QuoteRequestFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialFormState,
    workerId: worker.slug,
    workerSlug: worker.slug,
    city: worker.city,
    neighborhood: worker.neighborhood,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [protocol, setProtocol] = useState("");
  const [confirmedEstimate, setConfirmedEstimate] = useState<QuotePricingEstimate | null>(null);

  const message = `Ola, ${worker.name}. Encontrei seu perfil na AutonomoPro e gostaria de solicitar um orcamento.`;
  const estimate = estimateQuotePrice({
    serviceType: form.serviceType,
    description: form.description,
    city: form.city,
    neighborhood: form.neighborhood,
    worker,
  });

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitQuote() {
    const parsed = quoteRequestSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Nao foi possivel enviar o pedido.");
      }

      setProtocol(data.code ?? "ORC-DEMO");
      setConfirmedEstimate(data.estimate ?? estimate);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-5 rounded-[8px] border border-success/30 bg-success-soft p-5">
        <CheckCircle2 className="text-success" size={28} />
        <h3 className="mt-3 text-xl font-black text-foreground">Pedido enviado</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Seu pedido foi registrado com o protocolo <strong>{protocol}</strong>. A AutonomoPro calculou uma faixa inicial para alinhar cliente, profissional e taxa da plataforma.
        </p>
        {confirmedEstimate ? <QuoteEstimateSummary estimate={confirmedEstimate} /> : null}
        <Button type="button" variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
          Enviar outro pedido
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-5 grid min-w-0 gap-4">
      <Field>
        <Label>Servico desejado</Label>
        <Input value={form.serviceType} onChange={(event) => updateField("serviceType", event.target.value)} placeholder="Ex.: trocar tomadas da cozinha" />
        <InlineError message={errors.serviceType} />
      </Field>

      <FieldGroup className="sm:grid-cols-1 xl:grid-cols-2">
        <Field>
          <Label>Seu nome</Label>
          <Input value={form.clientName} onChange={(event) => updateField("clientName", event.target.value)} placeholder="Nome completo" />
          <InlineError message={errors.clientName} />
        </Field>
        <Field>
          <Label>WhatsApp ou telefone</Label>
          <Input value={form.clientPhone} onChange={(event) => updateField("clientPhone", event.target.value)} placeholder="(11) 99999-9999" />
          <InlineError message={errors.clientPhone} />
        </Field>
      </FieldGroup>

      <Field>
        <Label>E-mail</Label>
        <Input type="email" value={form.clientEmail} onChange={(event) => updateField("clientEmail", event.target.value)} placeholder="voce@email.com" />
        <InlineError message={errors.clientEmail} />
      </Field>

      <FieldGroup className="sm:grid-cols-1 xl:grid-cols-2">
        <Field>
          <Label>Cidade</Label>
          <Input value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Sao Paulo" />
          <InlineError message={errors.city} />
        </Field>
        <Field>
          <Label>Bairro</Label>
          <Input value={form.neighborhood} onChange={(event) => updateField("neighborhood", event.target.value)} placeholder="Tatuape" />
          <InlineError message={errors.neighborhood} />
        </Field>
      </FieldGroup>

      <FieldGroup className="sm:grid-cols-1 xl:grid-cols-2">
        <Field>
          <Label>Data preferida</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
            <Input type="date" value={form.preferredDate} onChange={(event) => updateField("preferredDate", event.target.value)} className="pl-9" />
          </div>
        </Field>
        <Field>
          <Label>Limite de orcamento opcional</Label>
          <Input
            value={form.budgetMax?.toString() ?? ""}
            onChange={(event) => updateField("budgetMax", event.target.value ? Number(event.target.value) : undefined)}
            placeholder="Ex.: 500"
            inputMode="numeric"
          />
        </Field>
      </FieldGroup>

      <Field>
        <Label>Descricao</Label>
        <Textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Inclua medidas, urgencia, fotos disponiveis e melhor horario para contato." />
        <InlineError message={errors.description} />
      </Field>

      <Field>
        <Label>Observacoes extras</Label>
        <Textarea value={form.extraNotes} onChange={(event) => updateField("extraNotes", event.target.value)} placeholder="Ex.: prefiro contato pela manha, estacionamento no local, acesso por portaria." />
        <InlineError message={errors.extraNotes} />
      </Field>

      <QuoteEstimateSummary estimate={estimate} />

      {status === "error" && !Object.keys(errors).length ? (
        <p className="rounded-[8px] bg-danger-soft p-3 text-sm font-bold text-danger">Nao foi possivel enviar o pedido agora. Tente novamente.</p>
      ) : null}

      <Button type="button" className="w-full" onClick={() => void submitQuote()} disabled={status === "submitting"}>
        <Send className="mr-2" size={18} />
        {status === "submitting" ? "Enviando..." : "Enviar pedido"}
      </Button>
      <LeadWhatsappButton worker={worker} message={message} source="quote_request_form" className="w-full" />
    </form>
  );
}

function QuoteEstimateSummary({ estimate }: { estimate: QuotePricingEstimate }) {
  return (
    <div className="rounded-[8px] border border-border bg-surface-muted p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-foreground">Estimativa AutonomoPro</p>
          <p className="mt-1 text-xs font-semibold text-muted">Faixa sugerida antes da validacao final de escopo e materiais.</p>
        </div>
        <Badge variant={estimate.confidence === "alta" ? "success" : estimate.confidence === "media" ? "info" : "warning"}>
          Confianca {estimate.confidence}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <EstimateMetric label="Cliente paga" value={`${formatCurrency(estimate.min)} - ${formatCurrency(estimate.max)}`} />
        <EstimateMetric label="Taxa plataforma" value={`${estimate.platformFeePercent}% | ${formatCurrency(estimate.platformFeeAmount)}`} />
        <EstimateMetric label="Profissional recebe" value={`${formatCurrency(estimate.professionalNetMin)} - ${formatCurrency(estimate.professionalNetMax)}`} />
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-muted">Base: {estimate.factors.join(", ")}.</p>
    </div>
  );
}

function EstimateMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface p-3">
      <p className="text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-danger">{message}</p>;
}

function flattenZodErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path[0]?.toString();

    if (key && !acc[key]) {
      acc[key] = issue.message;
    }

    return acc;
  }, {});
}
