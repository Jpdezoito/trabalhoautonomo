"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldHint, Label, Textarea } from "@/components/ui/form";

type TrustReviewItem = {
  id: string;
  name: string;
  role: string;
  type: string;
  status: string;
  submittedAt: string;
  provider?: string | null;
  reviewNotes?: string | null;
};

export function AdminTrustReviewTable({ items }: { items: TrustReviewItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confiança e protecao</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {items.map((item) => (
            <AdminTrustReviewRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AdminTrustReviewRow({ item }: { item: TrustReviewItem }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.reviewNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitReview() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/trust/requests/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reviewNotes: notes,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível revisar a solicitação.");
      }

      setMessage("Revisão salva.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao salvar revisão.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-[8px] border border-border bg-surface p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="font-black text-foreground">{item.name}</p>
          <p className="mt-1 text-sm text-muted">
            {item.role} - modulo {formatType(item.type)}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-normal text-primary">Enviado em {item.submittedAt}</p>
          {item.provider ? <p className="mt-1 text-sm text-muted">Provedor: {item.provider}</p> : null}
        </div>
        <Badge variant={getVariant(status)}>{formatStatus(status)}</Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-[220px_1fr]">
        <Field>
          <Label>Status</Label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-[8px] border border-border bg-surface px-3 text-sm">
            <option value="PENDING">Pendente</option>
            <option value="IN_REVIEW">Em análise</option>
            <option value="VERIFIED">Verificado</option>
            <option value="REJECTED">Rejeitado</option>
            <option value="NEEDS_REVIEW">Revisão necessaria</option>
          </select>
        </Field>
        <Field>
          <Label>Notas de revisão</Label>
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Detalhe o motivo, pedido de ajuste ou aprovação." />
          <FieldHint>Essas notas são internas e não aparecem no perfil público.</FieldHint>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={submitReview} disabled={busy}>
          {busy ? <LoaderCircle className="mr-2 animate-spin" size={16} /> : null}
          Salvar revisão
        </Button>
        {message ? <span className="text-sm font-semibold text-success">{message}</span> : null}
        {error ? <span className="text-sm font-semibold text-danger">{error}</span> : null}
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  if (status === "VERIFIED") return "Conta verificada";
  if (status === "REJECTED") return "Rejeitado";
  if (status === "IN_REVIEW") return "Em análise";
  if (status === "NEEDS_REVIEW") return "Revisão necessaria";

  return "Pendente";
}

function getVariant(status: string) {
  if (status === "VERIFIED") return "success";
  if (status === "REJECTED") return "danger";
  if (status === "IN_REVIEW") return "info";

  return "warning";
}

function formatType(type: string) {
  return type.toLowerCase().replaceAll("_", " ");
}
