"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, LoaderCircle, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldHint, Input, Label } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type RecoveryMethod = "EMAIL_FACE" | "PHONE_FACE";
type RecoveryStep = "method" | "start" | "contact" | "face" | "password" | "success";

export function PasswordRecoveryFlow() {
  const [method, setMethod] = useState<RecoveryMethod>("EMAIL_FACE");
  const [step, setStep] = useState<RecoveryStep>("method");
  const [identifier, setIdentifier] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [maskedDestination, setMaskedDestination] = useState("");
  const [developmentCode, setDevelopmentCode] = useState<string | undefined>();
  const [contactCode, setContactCode] = useState("");
  const [faceImage, setFaceImage] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const methodLabel = useMemo(
    () => (method === "EMAIL_FACE" ? "E-mail + reconhecimento facial" : "Telefone + reconhecimento facial"),
    [method],
  );

  async function callApi<T>(url: string, body: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as T & { error?: string };

    if (!response.ok) {
      throw new Error(payload.error || "Falha na operação.");
    }

    return payload;
  }

  async function startFlow() {
    setBusy(true);
    setError("");

    try {
      const payload = await callApi<{
        sessionToken: string;
        maskedDestination: string;
        message: string;
        developmentCode?: string;
      }>("/api/auth/recovery/start", {
        method,
        identifier,
      });

      setSessionToken(payload.sessionToken);
      setMaskedDestination(payload.maskedDestination);
      setDevelopmentCode(payload.developmentCode);
      setMessage(payload.message);
      setStep("contact");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível iniciar a recuperação.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyContact() {
    setBusy(true);
    setError("");

    try {
      const payload = await callApi<{ message: string }>("/api/auth/recovery/verify-contact", {
        sessionToken,
        code: contactCode,
      });
      setMessage(payload.message);
      setStep("face");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível validar o código.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyFace() {
    setBusy(true);
    setError("");

    try {
      const payload = await callApi<{ message: string }>("/api/auth/recovery/verify-face", {
        sessionToken,
        imageDataUrl: faceImage,
      });
      setMessage(payload.message);
      setStep("password");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível validar a verificação facial.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    setBusy(true);
    setError("");

    try {
      const payload = await callApi<{ message: string }>("/api/auth/recovery/reset-password", {
        sessionToken,
        password,
        confirmPassword,
      });
      setMessage(payload.message);
      setStep("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível redefinir a senha.");
    } finally {
      setBusy(false);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setError("");
    } catch {
      setError("Não foi possível acessar a webcam. Use o envio de imagem como alternativa.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  function captureCamera() {
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
    setFaceImage(canvas.toDataURL("image/jpeg", 0.92));
    setMessage("Captura facial pronta para validação.");
  }

  function handleFaceUpload(file?: File) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFaceImage(typeof reader.result === "string" ? reader.result : "");
      setMessage("Imagem enviada. Agora valide a verificação facial.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-surface">
        <CardTitle>Esqueci minha senha</CardTitle>
        <p className="mt-2 text-sm leading-6 text-muted">
          Este fluxo exige dois fatores: validação de e-mail ou telefone e depois verificação facial, quando a conta possui recuperação facial habilitada.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          {step !== "method" ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setStep("method");
              }}
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-primary"
            >
              <ArrowLeft size={16} />
              Trocar metodo
            </button>
          ) : null}

          {step === "method" ? (
            <div className="grid gap-4">
              <MethodCard selected={method === "EMAIL_FACE"} title="E-mail + reconhecimento facial" description="Primeiro validamos seu e-mail. Depois exigimos verificação facial ao vivo." icon={<Mail size={20} />} onClick={() => setMethod("EMAIL_FACE")} />
              <MethodCard selected={method === "PHONE_FACE"} title="Telefone + reconhecimento facial" description="Primeiro validamos um código OTP. Depois exigimos verificação facial ao vivo." icon={<Phone size={20} />} onClick={() => setMethod("PHONE_FACE")} />
              <Button type="button" onClick={() => setStep("start")}>Continuar</Button>
            </div>
          ) : null}

          {step === "start" ? (
            <div className="grid gap-4">
              <div className="rounded-[8px] border border-border bg-surface-muted p-4">
                <p className="font-black text-foreground">{methodLabel}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Informe {method === "EMAIL_FACE" ? "o e-mail" : "o telefone"} associado a sua conta para iniciar a recuperação multifator.
                </p>
              </div>
              <Field>
                <Label>{method === "EMAIL_FACE" ? "E-mail" : "Telefone"}</Label>
                <Input
                  type={method === "EMAIL_FACE" ? "email" : "tel"}
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={method === "EMAIL_FACE" ? "voce@email.com" : "(11) 99999-9999"}
                />
              </Field>
              <Button type="button" onClick={startFlow} disabled={busy}>
                {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
                Enviar código
              </Button>
            </div>
          ) : null}

          {step === "contact" ? (
            <div className="grid gap-4">
              <div className="rounded-[8px] border border-border bg-surface-muted p-4">
                <p className="font-black text-foreground">Validação do contato</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Digite o código enviado para <strong>{maskedDestination}</strong>. So depois disso a verificação facial será liberada.
                </p>
                {developmentCode ? <p className="mt-2 text-xs font-bold text-primary">Código de desenvolvimento: {developmentCode}</p> : null}
              </div>
              <Field>
                <Label>Código recebido</Label>
                <Input value={contactCode} onChange={(event) => setContactCode(event.target.value)} placeholder="Digite o código de 6 digitos" />
              </Field>
              <Button type="button" onClick={verifyContact} disabled={busy}>
                {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
                Validar código
              </Button>
            </div>
          ) : null}

          {step === "face" ? (
            <div className="grid gap-4">
              <div className="rounded-[8px] border border-border bg-surface-muted p-4">
                <p className="font-black text-foreground">Reconhecimento facial</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Agora valide a verificação facial ao vivo. Sem esse segundo fator, a redefinicao de senha não será liberada.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant={cameraActive ? "secondary" : "outline"} onClick={cameraActive ? stopCamera : startCamera}>
                  <Camera className="mr-2" size={18} />
                  {cameraActive ? "Encerrar webcam" : "Usar webcam"}
                </Button>
                <label className="inline-flex">
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleFaceUpload(event.target.files?.[0])} />
                  <span className="inline-flex cursor-pointer items-center rounded-[8px] border border-border px-4 py-2 text-sm font-bold text-foreground hover:bg-surface-muted">
                    Enviar imagem
                  </span>
                </label>
                {cameraActive ? (
                  <Button type="button" variant="outline" onClick={captureCamera}>
                    Capturar agora
                  </Button>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-[#101816]">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full object-cover" />
                ) : faceImage ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={faceImage} alt="Captura facial" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] place-items-center p-6 text-center">
                    <div>
                      <ShieldCheck className="mx-auto text-muted" size={28} />
                      <p className="mt-3 font-black text-foreground">Aguardando captura facial</p>
                      <p className="mt-2 text-sm leading-6 text-muted">Use a webcam ou envie uma imagem atual para continuar.</p>
                    </div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <FieldHint>Somente contas com recuperação facial previamente aprovada podem concluir está etapa.</FieldHint>
              <Button type="button" onClick={verifyFace} disabled={busy || !faceImage}>
                {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
                Validar verificação facial
              </Button>
            </div>
          ) : null}

          {step === "password" ? (
            <div className="grid gap-4">
              <div className="rounded-[8px] border border-success/30 bg-success-soft p-4 text-success">
                <CheckCircle2 className="mr-2 inline" size={16} />
                Os dois fatores foram validados. Defina sua nova senha.
              </div>
              <Field>
                <Label>Nova senha</Label>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" />
              </Field>
              <Field>
                <Label>Confirmar nova senha</Label>
                <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repita a nova senha" />
              </Field>
              <Button type="button" onClick={resetPassword} disabled={busy}>
                {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
                Redefinir senha
              </Button>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="grid gap-4">
              <div className="rounded-[8px] border border-success/30 bg-success-soft p-5 text-success">
                <CheckCircle2 className="mr-2 inline" size={18} />
                {message || "Senha redefinida com sucesso."}
              </div>
              <Link
                href="/entrar"
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-primary px-5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-primary-strong"
              >
                Voltar para entrar
              </Link>
            </div>
          ) : null}

          {message && step !== "success" ? <p className="text-sm font-semibold text-primary">{message}</p> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function MethodCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[8px] border p-4 text-left transition",
        selected ? "border-primary bg-primary-soft text-primary-strong" : "border-border bg-surface hover:bg-surface-muted",
      )}
    >
      <span className="flex items-center gap-3 font-black">
        {icon}
        {title}
      </span>
      <span className="mt-2 block text-sm leading-6 opacity-90">{description}</span>
    </button>
  );
}
