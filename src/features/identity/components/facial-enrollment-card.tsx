"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CameraOff, CheckCircle2, LoaderCircle, RefreshCcw, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldHint } from "@/components/ui/form";
import type { FacialEnrollmentDraft, IdentityAudience } from "@/features/identity/types";
import { createDefaultFacialEnrollmentDraft, getFacialStatusLabel, getFacialStatusTone, getIdentityAudienceLabel } from "@/features/identity/utils";

type FacialEnrollmentCardProps = {
  audience: IdentityAudience;
  enabled?: boolean;
  mode?: "draft" | "api";
  title?: string;
  description?: string;
  initialValue?: Partial<FacialEnrollmentDraft>;
  onDraftChange?: (value: FacialEnrollmentDraft) => void;
};

export function FacialEnrollmentCard({
  audience,
  enabled = true,
  mode = "api",
  title = "Verificação facial",
  description = "Use uma captura clara do rosto para reforcar a verificação de identidade e habilitar recuperação segura de senha no futuro.",
  initialValue,
  onDraftChange,
}: FacialEnrollmentCardProps) {
  const mergedInitialValue = useMemo<FacialEnrollmentDraft>(
    () => ({ ...createDefaultFacialEnrollmentDraft(), ...initialValue }),
    [initialValue],
  );
  const isDraftMode = mode === "draft";
  const [internalValue, setInternalValue] = useState<FacialEnrollmentDraft>(mergedInitialValue);
  const [cameraActive, setCameraActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const draftChangeRef = useRef(onDraftChange);
  const cameraAvailable = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
  const value = isDraftMode ? mergedInitialValue : internalValue;

  useEffect(() => {
    draftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const badgeVariant = useMemo(() => getFacialStatusTone(value.status), [value.status]);

  async function startCamera() {
    if (!cameraAvailable || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);
      setError(null);
    } catch {
      setError("Não foi possível acessar a webcam. Use o envio seguro de imagem como alternativa.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  function updateValue(patch: Partial<FacialEnrollmentDraft>) {
    if (isDraftMode) {
      draftChangeRef.current?.({ ...value, ...patch });
      return;
    }

    setInternalValue((current) => ({ ...current, ...patch }));
  }

  function captureFromCamera() {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const previewUrl = canvas.toDataURL("image/jpeg", 0.92);

    updateValue({
      previewUrl,
      captureSource: "webcam",
      status: "pendente",
    });
    setMessage("Captura facial pronta para envio.");
    setError(null);
  }

  function handleUpload(file?: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateValue({
        previewUrl: typeof reader.result === "string" ? reader.result : undefined,
        captureSource: "upload",
        status: "pendente",
      });
      setMessage("Imagem enviada com sucesso. Revise antes de registrar.");
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function submitEnrollment() {
    if (!enabled) {
      return;
    }

    if (!value.consentAccepted) {
      setError("Aceite o consentimento antes de registrar a verificação facial.");
      return;
    }

    if (!value.previewUrl || !value.captureSource) {
      setError("Capture pela webcam ou envie uma imagem para continuar.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      if (mode === "api") {
        const response = await fetch("/api/identity/facial-enrollment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageDataUrl: value.previewUrl,
            captureSource: value.captureSource,
            consentAccepted: value.consentAccepted,
          }),
        });

        const payload = (await response.json()) as { summary?: FacialEnrollmentDraft; error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Não foi possível enviar a verificação facial.");
        }

        updateValue({
          ...value,
          ...(payload.summary ?? {}),
          status: "em_analise",
        });
      } else {
        updateValue({
          status: "em_analise",
          submittedAt: new Date().toLocaleDateString("pt-BR"),
        });
      }

      setMessage("Verificação facial enviada para análise.");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Falha ao registrar a verificação facial.");
    } finally {
      setBusy(false);
    }
  }

  function retryEnrollment() {
    updateValue({
      status: "pendente",
      retryCount: (value.retryCount ?? 0) + 1,
      reviewNotes: undefined,
    });
    setMessage("Novo envio liberado. Capture novamente e confirme o consentimento.");
    setError(null);
  }

  if (!enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted">A verificação facial não está habilitada para está conta neste momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </div>
          <Badge variant={badgeVariant}>
            <ShieldCheck size={14} />
            {getFacialStatusLabel(value.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          <div className="rounded-[8px] border border-border bg-surface-muted p-4">
            <p className="font-black text-foreground">Segurança da conta</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              A verificação facial do {getIdentityAudienceLabel(audience)} reforca a verificação de identidade e, quando aprovada,
              pode ser usada como requisito para recuperação segura de senha.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
            <input
              type="checkbox"
              checked={value.consentAccepted}
              onChange={(event) => updateValue({ consentAccepted: event.target.checked })}
              className="mt-1"
            />
            <span>
              <span className="block font-black text-foreground">Consentimento para captura facial</span>
              <span className="mt-1 block leading-6 text-muted">
                Autorizo a coleta da captura facial para verificação de identidade e para futura elegibilidade de recuperação de senha,
                conforme a politica de privacidade da plataforma.
              </span>
            </span>
          </label>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[8px] border border-border bg-surface p-4">
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant={cameraActive ? "secondary" : "outline"} onClick={cameraActive ? stopCamera : startCamera} disabled={!cameraAvailable}>
                  {cameraActive ? <CameraOff className="mr-2" size={18} /> : <Camera className="mr-2" size={18} />}
                  {cameraActive ? "Encerrar webcam" : "Usar webcam"}
                </Button>
                <label className="inline-flex">
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUpload(event.target.files?.[0])} />
                  <span className="inline-flex cursor-pointer items-center rounded-[8px] border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:bg-surface-muted">
                    <Upload className="mr-2" size={18} />
                    Envio seguro
                  </span>
                </label>
                {cameraActive ? (
                  <Button type="button" variant="outline" onClick={captureFromCamera}>
                    Capturar agora
                  </Button>
                ) : null}
              </div>
              <FieldHint className="mt-3">
                Use ambiente iluminado, rosto centralizado e sem obstruções. A imagem não fica exposta publicamente.
              </FieldHint>
              <div className="mt-4 overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-[#0f1714]">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full object-cover" />
                ) : value.previewUrl ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={value.previewUrl} alt="Captura facial" fill sizes="(min-width: 1280px) 30vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] place-items-center p-6 text-center">
                    <div>
                      <Camera className="mx-auto text-muted" size={28} />
                      <p className="mt-3 font-black text-foreground">Captura facial não registrada</p>
                      <p className="mt-2 text-sm leading-6 text-muted">Escolha webcam ou envio seguro para continuar.</p>
                    </div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="grid gap-3">
              <StatusLine label="Status da verificação" value={getFacialStatusLabel(value.status)} />
              <StatusLine label="Origem da captura" value={value.captureSource === "webcam" ? "Verificação facial por webcam" : value.captureSource === "upload" ? "Upload seguro" : "Não registrada"} />
              <StatusLine label="Recuperação facial" value={value.recoveryEnabled ? "Habilitada" : "Aguardando aprovação"} />
              <StatusLine label="Tentativas" value={String(value.retryCount ?? 0)} />
              {value.submittedAt ? <StatusLine label="Enviado em" value={value.submittedAt} /> : null}
              {value.reviewNotes ? <StatusLine label="Observações da análise" value={value.reviewNotes} /> : null}
            </div>
          </div>

          {message ? (
            <div className="rounded-[8px] border border-success/30 bg-success-soft p-4 text-sm font-semibold text-success">
              <CheckCircle2 className="mr-2 inline" size={16} />
              {message}
            </div>
          ) : null}
          {error ? <div className="rounded-[8px] border border-danger/30 bg-danger-soft p-4 text-sm font-semibold text-danger">{error}</div> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="button" onClick={submitEnrollment} disabled={busy}>
              {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : <ShieldCheck className="mr-2" size={18} />}
              {value.status === "rejeitado" ? "Enviar nova verificação" : "Registrar verificação facial"}
            </Button>
            {value.status === "rejeitado" ? (
              <Button type="button" variant="outline" onClick={retryEnrollment}>
                <RefreshCcw className="mr-2" size={18} />
                Tentar novamente
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-1 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}
