"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldHint, Input, Label } from "@/components/ui/form";

export function TrustVerificationCard({
  audience,
  allowBackgroundCheck = false,
}: {
  audience: "cliente" | "profissional";
  allowBackgroundCheck?: boolean;
}) {
  const [documentType, setDocumentType] = useState("");
  const [documentReference, setDocumentReference] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [activityReference, setActivityReference] = useState("");
  const [consentIdentity, setConsentIdentity] = useState(false);
  const [requestBackgroundCheck, setRequestBackgroundCheck] = useState(false);
  const [consentBackground, setConsentBackground] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitRequest() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/trust/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType,
          documentReference,
          addressReference,
          activityReference,
          consentIdentity,
          requestBackgroundCheck,
          consentBackground,
        }),
      });

      const payload = (await response.json()) as { error?: string; overview?: { status: string } };

      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível enviar a verificação.");
      }

      setMessage("Solicitação enviada para verificação de identidade. A análise administrativa já pode ser iniciada.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao iniciar a verificação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Verificação de identidade</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reforce a confiança e protecao da plataforma com verificação documental, status facial e revisão administrativa do perfil {audience}.
            </p>
          </div>
          <Badge variant="info">
            <ShieldCheck size={14} />
            Segurança da plataforma
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Field>
            <Label>Tipo de documento</Label>
            <Input value={documentType} onChange={(event) => setDocumentType(event.target.value)} placeholder="Ex.: CPF, CNH, documento da empresa" />
          </Field>
          <Field>
            <Label>Referencia do documento</Label>
            <Input value={documentReference} onChange={(event) => setDocumentReference(event.target.value)} placeholder="Ex.: final do documento ou protocolo interno" />
            <FieldHint>Não expomos essa referencia publicamente. Use apenas o mínimo necessario para rastreio interno.</FieldHint>
          </Field>
          {audience === "profissional" ? (
            <>
              <Field>
                <Label>Referencia do comprovante de endereço</Label>
                <Input value={addressReference} onChange={(event) => setAddressReference(event.target.value)} placeholder="Ex.: protocolo do comprovante enviado" />
              </Field>
              <Field>
                <Label>Referencia da prova de atividade</Label>
                <Input value={activityReference} onChange={(event) => setActivityReference(event.target.value)} placeholder="Ex.: lote inicial de imagens ou portfólio real" />
                <FieldHint>Essa etapa ajuda a validar que o profissional realmente atua na área informada.</FieldHint>
              </Field>
            </>
          ) : null}

          <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
            <input type="checkbox" checked={consentIdentity} onChange={(event) => setConsentIdentity(event.target.checked)} className="mt-1" />
            <span>
              <span className="block font-black text-foreground">Consentimento para verificação de identidade</span>
              <span className="mt-1 block leading-6 text-muted">
                Autorizo a plataforma a processar dados de verificação de identidade, verificação facial e revisão administrativa para confiança e protecao.
              </span>
            </span>
          </label>

          {allowBackgroundCheck ? (
            <>
              <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
                <input type="checkbox" checked={requestBackgroundCheck} onChange={(event) => setRequestBackgroundCheck(event.target.checked)} className="mt-1" />
                <span>
                  <span className="block font-black text-foreground">Solicitar verificação externa opcional</span>
                  <span className="mt-1 block leading-6 text-muted">
                    Aplicável apenas quando permitido legalmente e com integracao autorizada de terceiro.
                  </span>
                </span>
              </label>
              {requestBackgroundCheck ? (
                <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
                  <input type="checkbox" checked={consentBackground} onChange={(event) => setConsentBackground(event.target.checked)} className="mt-1" />
                  <span>
                    <span className="block font-black text-foreground">Consentimento para provedor externo autorizado</span>
                    <span className="mt-1 block leading-6 text-muted">
                      Autorizo a verificação externa opcional apenas por provedor autorizado e dentro das regras legais aplicaveis.
                    </span>
                  </span>
                </label>
              ) : null}
            </>
          ) : null}

          <Button type="button" onClick={submitRequest} disabled={busy}>
            {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : <ShieldCheck className="mr-2" size={18} />}
            Enviar verificação
          </Button>

          {message ? <div className="rounded-[8px] border border-success/30 bg-success-soft p-4 text-sm font-semibold text-success">{message}</div> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </div>
      </CardContent>
    </Card>
  );
}
