"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useEnterToNextField } from "@/features/quotes/useEnterToNextField";
import { ArrowLeft, ArrowRight, Camera, Check, Heart, MapPin, Plus, Save, Send, Trash2, UserRound } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldHint, Input, Label, Select, Textarea } from "@/components/ui/form";
import { SectionHeader } from "@/components/ui/section-header";
import { FacialEnrollmentStep } from "@/features/identity/components/facial-enrollment-step";
import { identityFeatureFlags } from "@/features/identity/constants";
import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import { calculateClientOnboardingProgress, defaultClientOnboardingDraft } from "@/features/clients/onboarding/progress";
import { clientStepSchemas } from "@/features/clients/onboarding/schema";
import type { ClientOnboardingDraft, ClientOnboardingStep, ClientOnboardingStepId } from "@/features/clients/onboarding/types";

const storageKey = "autonomopro.client-onboarding-draft";

const baseSteps: ClientOnboardingStep[] = [
  {
    id: "profile",
    title: "Perfil",
    description: "Nome, foto opcional e contexto rápido.",
  },
  {
    id: "location",
    title: "Localização",
    description: "Cidade e bairro preferidos.",
  },
  {
    id: "interests",
    title: "Interesses",
    description: "Categorias e serviços que você costuma procurar.",
  },
  {
    id: "contact",
    title: "Contato",
    description: "Dados para retorno dos profissionais.",
  },
];

type DraftKey = keyof ClientOnboardingDraft;

function ClientOnboardingFlow() {
  // refs para navegação por Enter
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fieldRefs = [fullNameRef, emailRef, whatsappRef, phoneRef, buttonRef];
  const handleEnterNav = useEnterToNextField(fieldRefs);

  const [initialState] = useState(getInitialDraftState);
  const [draft, setDraft] = useState<ClientOnboardingDraft>(initialState.draft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // draftStatus inicial fixo para evitar mismatch
  const [draftStatus, setDraftStatus] = useState("Rascunho não salvo");
  const steps = useMemo<ClientOnboardingStep[]>(
    () =>
      identityFeatureFlags.clientEnrollmentEnabled
        ? [
            ...baseSteps,
            {
              id: "verification",
              title: "Verificação",
              description: "Verificação facial opcional para segurança da conta.",
            },
            {
              id: "review",
              title: "Revisão",
              description: "Confira antes de finalizar.",
            },
          ]
        : [
            ...baseSteps,
            {
              id: "review",
              title: "Revisão",
              description: "Confira antes de finalizar.",
            },
          ],
    [],
  );
  const activeStep = steps[activeStepIndex];
  const progress = calculateClientOnboardingProgress(draft);

  useEffect(() => {
    // Atualiza status do rascunho só no client
    if (typeof window !== "undefined") {
      const timeout = window.setTimeout(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
        setDraftStatus("Rascunho salvo automaticamente");
      }, 450);
      return () => window.clearTimeout(timeout);
    }
  }, [draft]);

  const stepSummary = useMemo(
    () => ({
      profile: draft.fullName.length >= 2,
      location: Boolean(draft.city && draft.neighborhood),
      interests: draft.favoriteCategories.length > 0 && draft.serviceInterests.length > 0,
      contact: Boolean(draft.whatsapp && draft.phone && draft.email),
      verification:
        !identityFeatureFlags.clientEnrollmentEnabled ||
        Boolean(draft.facialEnrollment.status === "" || (draft.facialEnrollment.consentAccepted && draft.facialEnrollment.captureSource && draft.facialEnrollment.previewUrl)),
      review: progress >= 80,
    }),
    [draft, progress],
  );

  function updateDraft<Key extends DraftKey>(key: Key, value: ClientOnboardingDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validateStep(stepId: ClientOnboardingStepId) {
    const result = clientStepSchemas[stepId].safeParse(draft);

    if (result.success) {
      setErrors({});
      return true;
    }

    setErrors(flattenZodErrors(result.error));
    return false;
  }

  function goNext() {
    if (!validateStep(activeStep.id)) {
      return;
    }

    setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setActiveStepIndex((current) => Math.max(current - 1, 0));
  }

  function saveDraftNow() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setDraftStatus("Rascunho salvo agora");
    }
  }

  function finishOnboarding() {
    if (!validateStep("review")) {
      return;
    }

    setDraftStatus("Perfil de cliente concluído");
  }

  function handleImagePreview(file?: File) {
    if (!file) {
      return;
    }

    updateDraft("profilePhotoPreview", URL.createObjectURL(file));
  }

  function toggleCategory(slug: string) {
    const nextCategories = draft.favoriteCategories.includes(slug)
      ? draft.favoriteCategories.filter((category) => category !== slug)
      : [...draft.favoriteCategories, slug];

    updateDraft("favoriteCategories", nextCategories);
  }

  function addInterest(value: string) {
    const cleanValue = value.trim();

    if (!cleanValue || draft.serviceInterests.includes(cleanValue)) {
      return;
    }

    updateDraft("serviceInterests", [...draft.serviceInterests, cleanValue]);
  }

  function removeInterest(value: string) {
    updateDraft(
      "serviceInterests",
      draft.serviceInterests.filter((item) => item !== value),
    );
  }

  // O return deve estar dentro da função, sem chave extra antes
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-muted">Progresso do perfil</p>
                <p className="mt-1 text-3xl font-black text-foreground">{progress}%</p>
              </div>
              <Badge variant={progress >= 80 ? "success" : "warning"}>{progress >= 80 ? "Quase pronto" : "Em andamento"}</Badge>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-[8px] bg-surface-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">{draftStatus}</p>
            <div className="mt-6 grid gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setActiveStepIndex(index);
                  }}
                  className={cn(
                    "rounded-[8px] border p-3 text-left transition",
                    index === activeStepIndex
                      ? "border-primary bg-primary-soft text-primary-strong"
                      : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-black">{step.title}</span>
                    {stepSummary[step.id] ? <Check size={16} /> : <span className="text-xs font-black">0{index + 1}</span>}
                  </span>
                  <span className="mt-1 block text-xs font-semibold opacity-80">{step.description}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      <section>
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader>
            <SectionHeader
              className="mb-0"
              eyebrow="Cadastro de cliente"
              title={activeStep.title}
              description={activeStep.description}
              action={
                <Button type="button" variant="outline" onClick={saveDraftNow}>
                  <Save className="mr-2" size={18} />
                  Salvar rascunho
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            {activeStep.id === "profile" ? <ProfileStep draft={draft} errors={errors} onChange={updateDraft} onImagePreview={handleImagePreview} fullNameRef={fullNameRef} handleEnterNav={handleEnterNav} /> : null}
            {activeStep.id === "location" ? <LocationStep draft={draft} errors={errors} onChange={updateDraft} /> : null}
            {activeStep.id === "interests" ? (
              <InterestsStep draft={draft} errors={errors} onToggleCategory={toggleCategory} onAddInterest={addInterest} onRemoveInterest={removeInterest} />
            ) : null}
            {activeStep.id === "contact" ? <ContactStep draft={draft} errors={errors} onChange={updateDraft} emailRef={emailRef} whatsappRef={whatsappRef} phoneRef={phoneRef} handleEnterNav={handleEnterNav} /> : null}
            {activeStep.id === "verification" ? (
              <FacialEnrollmentStep
                audience="cliente"
                enabled={identityFeatureFlags.clientEnrollmentEnabled}
                value={draft.facialEnrollment}
                onChange={(value) => updateDraft("facialEnrollment", value)}
              />
            ) : null}
            {activeStep.id === "review" ? <ReviewStep draft={draft} progress={progress} errors={errors} /> : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={goBack} disabled={activeStepIndex === 0}>
                <ArrowLeft className="mr-2" size={18} />
                Voltar
              </Button>
              {activeStep.id === "review" ? (
                <Button ref={buttonRef} type="button" onClick={finishOnboarding} onKeyDown={e => {
                  if (e.key === "Enter" && !draft.fullName) {
                    e.preventDefault();
                  }
                }}>
                  <Send className="mr-2" size={18} />
                  Finalizar cadastro
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Continuar
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { ClientOnboardingFlow };

function ProfileStep({
  draft,
  errors,
  onChange,
  onImagePreview,
  fullNameRef,
  handleEnterNav,
}: {
  draft: ClientOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: ClientOnboardingDraft[Key]) => void;
  onImagePreview: (file?: File) => void;
  fullNameRef: React.RefObject<HTMLInputElement | null>;
  handleEnterNav: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <UploadPreview previewUrl={draft.profilePhotoPreview} onChange={onImagePreview} />
      <div className="grid gap-4">
        <Field>
          <Label>Nome completo</Label>
          <Input ref={fullNameRef} value={draft.fullName} onChange={(event) => onChange("fullName", event.target.value)} placeholder="Seu nome completo" onKeyDown={handleEnterNav} />
          <InlineError message={errors.fullName} />
        </Field>
        <Field>
          <Label>Observacao opcional</Label>
          <Textarea
            value={draft.profileNote}
            onChange={(event) => onChange("profileNote", event.target.value)}
            placeholder="Ex.: Costumo procurar profissionais para manutenção do apartamento e pequenos reparos."
          />
          <FieldHint>{draft.profileNote.length}/240 caracteres</FieldHint>
          <InlineError message={errors.profileNote} />
        </Field>
      </div>
    </div>
  );
}

function LocationStep({
  draft,
  errors,
  onChange,
}: {
  draft: ClientOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: ClientOnboardingDraft[Key]) => void;
}) {
  return (
    <FieldGroup>
      <Field>
        <Label>Cidade preferida</Label>
        <Select value={draft.city} onChange={(event) => onChange("city", event.target.value)}>
          <option value="">Selecione a cidade</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
        <InlineError message={errors.city} />
      </Field>
      <Field>
        <Label>Bairro principal</Label>
        <Select value={draft.neighborhood} onChange={(event) => onChange("neighborhood", event.target.value)}>
          <option value="">Selecione o bairro</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </Select>
        <InlineError message={errors.neighborhood} />
      </Field>
    </FieldGroup>
  );
}

function InterestsStep({
  draft,
  errors,
  onToggleCategory,
  onAddInterest,
  onRemoveInterest,
}: {
  draft: ClientOnboardingDraft;
  errors: Record<string, string>;
  onToggleCategory: (slug: string) => void;
  onAddInterest: (value: string) => void;
  onRemoveInterest: (value: string) => void;
}) {
  return (
    <div className="grid gap-6">
      <Field>
        <Label>Categorias favoritas</Label>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {publicCategories.map((category) => {
            const selected = draft.favoriteCategories.includes(category.slug);
            const Icon = category.icon;

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => onToggleCategory(category.slug)}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] border p-3 text-left transition",
                  selected ? "border-primary bg-primary-soft text-primary-strong" : "border-border bg-surface hover:bg-surface-muted",
                )}
              >
                <Icon size={18} />
                <span className="text-sm font-black">{category.name}</span>
              </button>
            );
          })}
        </div>
        <InlineError message={errors.favoriteCategories} />
      </Field>
      <InterestEditor values={draft.serviceInterests} error={errors.serviceInterests} onAdd={onAddInterest} onRemove={onRemoveInterest} />
    </div>
  );
}

function ContactStep({
  draft,
  errors,
  onChange,
  emailRef,
  whatsappRef,
  phoneRef,
  handleEnterNav,
}: {
  draft: ClientOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: ClientOnboardingDraft[Key]) => void;
  emailRef: React.RefObject<HTMLInputElement | null>;
  whatsappRef: React.RefObject<HTMLInputElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
  handleEnterNav: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="grid gap-5">
      <FieldGroup>
        <Field>
          <Label>WhatsApp</Label>
          <Input ref={whatsappRef} value={draft.whatsapp} onChange={(event) => onChange("whatsapp", event.target.value)} placeholder="(11) 99999-9999" onKeyDown={handleEnterNav} />
          <InlineError message={errors.whatsapp} />
        </Field>
        <Field>
          <Label>Telefone alternativo</Label>
          <Input ref={phoneRef} value={draft.phone} onChange={(event) => onChange("phone", event.target.value)} placeholder="(11) 3333-3333" onKeyDown={handleEnterNav} />
          <InlineError message={errors.phone} />
        </Field>
      </FieldGroup>
      <Field>
        <Label>E-mail</Label>
        <Input ref={emailRef} type="email" value={draft.email} onChange={(event) => onChange("email", event.target.value)} placeholder="voce@email.com" onKeyDown={handleEnterNav} />
        <InlineError message={errors.email} />
      </Field>
    </div>
  );
}

function ReviewStep({ draft, progress, errors }: { draft: ClientOnboardingDraft; progress: number; errors: Record<string, string> }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-[8px] border border-border bg-surface-muted p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-muted">Completude do perfil</p>
            <p className="mt-1 text-3xl font-black text-foreground">{progress}%</p>
          </div>
          <Badge variant={progress >= 80 ? "success" : "warning"}>{progress >= 80 ? "Pronto" : "Complete mais dados"}</Badge>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryItem icon={<UserRound size={18} />} label="Nome" value={draft.fullName || "Não informado"} />
        <SummaryItem icon={<MapPin size={18} />} label="Localização" value={`${draft.neighborhood || "Bairro não informado"}, ${draft.city || "cidade não informada"}`} />
        <SummaryItem icon={<Heart size={18} />} label="Categorias favoritas" value={`${draft.favoriteCategories.length} selecionada(s)`} />
        <SummaryItem icon={<Check size={18} />} label="Verificação facial" value={draft.facialEnrollment.status ? draft.facialEnrollment.status.replace("_", " ") : "Opcional"} />
        <SummaryItem icon={<Check size={18} />} label="Interesses salvos" value={draft.serviceInterests.join(", ") || "Nenhum interesse informado"} />
      </div>
      {Object.values(errors).length ? (
        <div className="rounded-[8px] border border-danger/30 bg-danger-soft p-4 text-sm font-semibold text-danger">
          Revise os campos obrigatórios antes de finalizar.
        </div>
      ) : null}
    </div>
  );
}

function UploadPreview({ previewUrl, onChange }: { previewUrl?: string; onChange: (file?: File) => void }) {
  return (
    <label className="group relative grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-surface-muted p-4 text-center">
      {previewUrl ? <Image src={previewUrl} alt="" fill sizes="220px" className="object-cover" /> : null}
      <input type="file" accept="image/*" className="sr-only" onChange={(event) => onChange(event.target.files?.[0])} />
      <span className={cn("relative z-10 rounded-[8px] bg-surface/90 p-4 shadow-[var(--shadow-sm)]", previewUrl && "backdrop-blur")}>
        <span className="mx-auto flex size-10 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
          <Camera size={22} />
        </span>
        <span className="mt-3 block font-black text-foreground">Foto opcional</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-muted">Ajuda profissionais a identificar seu pedido.</span>
      </span>
    </label>
  );
}

function InterestEditor({
  values,
  error,
  onAdd,
  onRemove,
}: {
  values: string[];
  error?: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  function submitValue() {
    onAdd(value);
    setValue("");
  }

  return (
    <Field>
      <Label>Serviços de interesse</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ex.: pintura, reparo elétrico, montagem de móveis"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitValue();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={submitValue}>
          <Plus className="mr-2" size={18} />
          Adicionar
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <Badge key={item} variant="primary" className="gap-2">
            {item}
            <button type="button" onClick={() => onRemove(item)} aria-label={`Remover ${item}`}>
              <Trash2 size={13} />
            </button>
          </Badge>
        ))}
      </div>
      <InlineError message={error} />
    </Field>
  );
}

function SummaryItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-border bg-surface p-4">
      <div className="text-primary">{icon}</div>
      <p className="mt-3 text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
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

function getInitialDraftState() {
  if (typeof window === "undefined") {
    return {
      draft: defaultClientOnboardingDraft,
      status: "Rascunho não salvo",
    };
  }

  const storedDraft = window.localStorage.getItem(storageKey);

  if (!storedDraft) {
    return {
      draft: defaultClientOnboardingDraft,
      status: "Rascunho não salvo",
    };
  }

  try {
    return {
      draft: { ...defaultClientOnboardingDraft, ...JSON.parse(storedDraft) },
      status: "Rascunho recuperado",
    };
  } catch {
    return {
      draft: defaultClientOnboardingDraft,
      status: "Não foi possível recuperar o rascunho",
    };
  }
}
