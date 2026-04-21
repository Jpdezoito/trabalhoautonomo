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
        throw new Error(payload.error || "Nao foi possivel enviar a verificacao.");
      }

      setMessage("Solicitacao enviada para verificacao de identidade. A analise administrativa ja pode ser iniciada.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao iniciar a verificacao.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Verificacao de identidade</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reforce a confianca e protecao da plataforma com verificacao documental, status facial e revisao administrativa do perfil {audience}.
            </p>
          </div>
          <Badge variant="info">
            <ShieldCheck size={14} />
            Seguranca da plataforma
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
            <FieldHint>Nao expomos essa referencia publicamente. Use apenas o minimo necessario para rastreio interno.</FieldHint>
          </Field>
          {audience === "profissional" ? (
            <>
              <Field>
                <Label>Referencia do comprovante de endereco</Label>
                <Input value={addressReference} onChange={(event) => setAddressReference(event.target.value)} placeholder="Ex.: protocolo do comprovante enviado" />
              </Field>
              <Field>
                <Label>Referencia da prova de atividade</Label>
                <Input value={activityReference} onChange={(event) => setActivityReference(event.target.value)} placeholder="Ex.: lote inicial de imagens ou portfolio real" />
                <FieldHint>Essa etapa ajuda a validar que o profissional realmente atua na area informada.</FieldHint>
              </Field>
            </>
          ) : null}

          <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
            <input type="checkbox" checked={consentIdentity} onChange={(event) => setConsentIdentity(event.target.checked)} className="mt-1" />
            <span>
              <span className="block font-black text-foreground">Consentimento para verificacao de identidade</span>
              <span className="mt-1 block leading-6 text-muted">
                Autorizo a plataforma a processar dados de verificacao de identidade, verificacao facial e revisao administrativa para confianca e protecao.
              </span>
            </span>
          </label>

          {allowBackgroundCheck ? (
            <>
              <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
                <input type="checkbox" checked={requestBackgroundCheck} onChange={(event) => setRequestBackgroundCheck(event.target.checked)} className="mt-1" />
                <span>
                  <span className="block font-black text-foreground">Solicitar verificacao externa opcional</span>
                  <span className="mt-1 block leading-6 text-muted">
                    Aplicavel apenas quando permitido legalmente e com integracao autorizada de terceiro.
                  </span>
                </span>
              </label>
              {requestBackgroundCheck ? (
                <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
                  <input type="checkbox" checked={consentBackground} onChange={(event) => setConsentBackground(event.target.checked)} className="mt-1" />
                  <span>
                    <span className="block font-black text-foreground">Consentimento para provedor externo autorizado</span>
                    <span className="mt-1 block leading-6 text-muted">
                      Autorizo a verificacao externa opcional apenas por provedor autorizado e dentro das regras legais aplicaveis.
                    </span>
                  </span>
                </label>
              ) : null}
            </>
          ) : null}

          <Button type="button" onClick={submitRequest} disabled={busy}>
            {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : <ShieldCheck className="mr-2" size={18} />}
            Enviar verificacao
          </Button>

          {message ? <div className="rounded-[8px] border border-success/30 bg-success-soft p-4 text-sm font-semibold text-success">{message}</div> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </div>
      </CardContent>
    </Card>
  );
}
