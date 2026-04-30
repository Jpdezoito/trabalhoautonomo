"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useEnterToNextField } from "@/features/quotes/useEnterToNextField";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileBadge2,
  FileText,
  ImagePlus,
  MapPin,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldHint, Input, Label, Select, Textarea } from "@/components/ui/form";
import { SectionHeader } from "@/components/ui/section-header";
import { FacialEnrollmentStep } from "@/features/identity/components/facial-enrollment-step";
import { getCategoryVerificationRule } from "@/features/workers/onboarding/category-verification-rules";
import { calculateWorkerOnboardingProgress, defaultWorkerOnboardingDraft } from "@/features/workers/onboarding/progress";
import { stepSchemas } from "@/features/workers/onboarding/schema";
import type {
  OnboardingStep,
  OnboardingStepId,
  PortfolioDraftItem,
  WorkerOnboardingDraft,
  WorkerQualificationDraft,
} from "@/features/workers/onboarding/types";
import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";

const storageKey = "autonomopro.worker-onboarding-draft";

const steps: OnboardingStep[] = [
  { id: "account", title: "Conta", description: "Dados da conta, nome público e contato." },
  { id: "services", title: "Atuação", description: "Categorias, serviços e área de trabalho." },
  { id: "verification", title: "Identidade", description: "Documento, endereço, captura facial e consentimentos." },
  { id: "activity", title: "Prova de atividade", description: "Portfólio real e evidências de trabalho." },
  { id: "qualifications", title: "Qualificações", description: "Experiência, formação e certificados opcionais." },
  { id: "review", title: "Revisão", description: "Confira os requisitos e envie para análise." },
];

type DraftKey = keyof WorkerOnboardingDraft;

export function WorkerOnboardingFlow() {
  // Refs para navegação por Enter na etapa 'account'
  const fullNameRef = useRef<HTMLInputElement>(null);
  const publicNameRef = useRef<HTMLInputElement>(null);
  const professionTitleRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const accountFieldRefs = [fullNameRef, publicNameRef, professionTitleRef, emailRef, whatsappRef, phoneRef, continueButtonRef];
  const handleEnterNav = useEnterToNextField(accountFieldRefs);
  const [initialState] = useState(getInitialDraftState);
  const [draft, setDraft] = useState<WorkerOnboardingDraft>(initialState.draft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftStatus, setDraftStatus] = useState(initialState.status);
  const activeStep = steps[activeStepIndex];
  const progress = calculateWorkerOnboardingProgress(draft);
  const categoryRule = useMemo(() => getCategoryVerificationRule(draft.categorySlug), [draft.categorySlug]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setDraftStatus("Rascunho salvo automaticamente");
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [draft]);

  const stepSummary = useMemo(
    () => ({
      account: Boolean(draft.fullName && draft.publicName && draft.professionTitle && draft.whatsapp && draft.phone && draft.email),
      services: Boolean(
        draft.categorySlug &&
          draft.services.length &&
          draft.startingPrice &&
          draft.description.length >= 40 &&
          draft.city &&
          draft.neighborhood &&
          draft.serviceAreas.length &&
          draft.workAreaSummary.length >= 10,
      ),
      verification: Boolean(
        draft.identityDocumentReference &&
          draft.identityDocumentPreview &&
          draft.addressProofPreview &&
          draft.termsAccepted &&
          draft.verificationConsentAccepted &&
          draft.facialEnrollment.consentAccepted &&
          draft.facialEnrollment.captureSource &&
          draft.facialEnrollment.previewUrl,
      ),
      activity: draft.portfolio.length >= categoryRule.minimumPortfolioImages,
      qualifications: Boolean(draft.experienceYears || draft.experienceSummary || draft.qualifications.length || draft.educationLevel || draft.courseSummary),
      review: progress >= 80,
    }),
    [categoryRule.minimumPortfolioImages, draft, progress],
  );

  function updateDraft<Key extends DraftKey>(key: Key, value: WorkerOnboardingDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validateStep(stepId: OnboardingStepId) {
    const schema = stepSchemas[stepId];
    const result = schema.safeParse(draft);

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
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setDraftStatus("Rascunho salvo agora");
  }

  function submitForReview() {
    if (!validateStep("review")) {
      return;
    }

    setDraftStatus("Perfil enviado para análise");
  }

  function handleImagePreview(key: "profilePhotoPreview" | "coverImagePreview" | "identityDocumentPreview" | "addressProofPreview", file?: File) {
    if (!file) {
      return;
    }

    updateDraft(key, URL.createObjectURL(file));
  }

  function addListItem(key: "services" | "serviceAreas" | "additionalCategorySlugs", value: string) {
    const cleanValue = value.trim();

    if (!cleanValue) {
      return;
    }

    const currentValues = draft[key];

    if (currentValues.includes(cleanValue)) {
      return;
    }

    updateDraft(key, [...currentValues, cleanValue]);
  }

  function removeListItem(key: "services" | "serviceAreas" | "additionalCategorySlugs", value: string) {
    updateDraft(
      key,
      draft[key].filter((item) => item !== value),
    );
  }

  function addPortfolioItem(item: PortfolioDraftItem) {
    updateDraft("portfolio", [...draft.portfolio, item]);
  }

  function removePortfolioItem(id: string) {
    updateDraft(
      "portfolio",
      draft.portfolio.filter((item) => item.id !== id),
    );
  }

  function addQualification(item: WorkerQualificationDraft) {
    updateDraft("qualifications", [...draft.qualifications, item]);
  }

  function removeQualification(id: string) {
    updateDraft(
      "qualifications",
      draft.qualifications.filter((item) => item.id !== id),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
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
          <CardHeader className="bg-surface">
            <SectionHeader
              className="mb-0"
              eyebrow="Cadastro profissional"
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
            {activeStep.id === "account" ? (
              <AccountStep
                draft={draft}
                errors={errors}
                onChange={updateDraft}
                onImagePreview={handleImagePreview}
                fullNameRef={fullNameRef}
                publicNameRef={publicNameRef}
                professionTitleRef={professionTitleRef}
                emailRef={emailRef}
                whatsappRef={whatsappRef}
                phoneRef={phoneRef}
                continueButtonRef={continueButtonRef}
                handleEnterNav={handleEnterNav}
              />
            ) : null}
            {activeStep.id === "services" ? (
              <ServicesStep draft={draft} errors={errors} onChange={updateDraft} onAddItem={addListItem} onRemoveItem={removeListItem} />
            ) : null}
            {activeStep.id === "verification" ? (
              <VerificationStep draft={draft} errors={errors} onChange={updateDraft} onImagePreview={handleImagePreview} />
            ) : null}
            {activeStep.id === "activity" ? (
              <ActivityStep
                draft={draft}
                errors={errors}
                rule={categoryRule}
                onAddItem={addPortfolioItem}
                onRemoveItem={removePortfolioItem}
              />
            ) : null}
            {activeStep.id === "qualifications" ? (
              <QualificationsStep draft={draft} errors={errors} onChange={updateDraft} onAddQualification={addQualification} onRemoveQualification={removeQualification} />
            ) : null}
            {activeStep.id === "review" ? <ReviewStep draft={draft} progress={progress} categoryRule={categoryRule} errors={errors} /> : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={goBack} disabled={activeStepIndex === 0}>
                <ArrowLeft className="mr-2" size={18} />
                Voltar
              </Button>
              {activeStep.id === "review" ? (
                <Button type="button" onClick={submitForReview}>
                  <Send className="mr-2" size={18} />
                  Enviar para análise
                </Button>
              ) : (
                <Button type="button" onClick={goNext} ref={activeStep.id === "account" ? continueButtonRef : undefined}>
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

function AccountStep({
  draft,
  errors,
  onChange,
  onImagePreview,
  fullNameRef,
  publicNameRef,
  professionTitleRef,
  emailRef,
  whatsappRef,
  phoneRef,
  continueButtonRef,
  handleEnterNav,
}: {
  draft: WorkerOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: WorkerOnboardingDraft[Key]) => void;
  onImagePreview: (key: "profilePhotoPreview" | "coverImagePreview" | "identityDocumentPreview" | "addressProofPreview", file?: File) => void;
  fullNameRef: React.RefObject<HTMLInputElement | null>;
  publicNameRef: React.RefObject<HTMLInputElement | null>;
  professionTitleRef: React.RefObject<HTMLInputElement | null>;
  emailRef: React.RefObject<HTMLInputElement | null>;
  whatsappRef: React.RefObject<HTMLInputElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
  continueButtonRef: React.RefObject<HTMLButtonElement | null>;
  handleEnterNav: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <UploadPreview
          label="Foto de perfil"
          helper="Use uma foto clara do rosto ou uniforme."
          previewUrl={draft.profilePhotoPreview}
          icon={<Camera size={22} />}
          onChange={(file) => onImagePreview("profilePhotoPreview", file)}
        />
        <UploadPreview
          label="Imagem de capa"
          helper="Mostre uma obra, ferramenta, oficina ou ambiente real de trabalho."
          previewUrl={draft.coverImagePreview}
          icon={<ImagePlus size={22} />}
          wide
          onChange={(file) => onImagePreview("coverImagePreview", file)}
        />
      </div>
      <FieldGroup>
        <Field>
          <Label>Nome completo</Label>
          <Input
            ref={fullNameRef}
            value={draft.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="Seu nome completo"
          />
          <InlineError message={errors.fullName} />
        </Field>
        <Field>
          <Label>Nome público</Label>
          <Input
            ref={publicNameRef}
            value={draft.publicName}
            onChange={(event) => onChange("publicName", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="Ex.: Carlos Mendes"
          />
          <InlineError message={errors.publicName} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <Label>Titulo profissional</Label>
          <Input
            ref={professionTitleRef}
            value={draft.professionTitle}
            onChange={(event) => onChange("professionTitle", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="Ex.: Eletricista residencial e predial"
          />
          <InlineError message={errors.professionTitle} />
        </Field>
        <Field>
          <Label>E-mail</Label>
          <Input
            ref={emailRef}
            type="email"
            value={draft.email}
            onChange={(event) => onChange("email", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="contato@seudominio.com.br"
          />
          <InlineError message={errors.email} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <Label>WhatsApp</Label>
          <Input
            ref={whatsappRef}
            value={draft.whatsapp}
            onChange={(event) => onChange("whatsapp", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="(11) 99999-9999"
          />
          <InlineError message={errors.whatsapp} />
        </Field>
        <Field>
          <Label>Telefone</Label>
          <Input
            ref={phoneRef}
            value={draft.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            onKeyDown={handleEnterNav}
            placeholder="(11) 3333-3333"
          />
          <InlineError message={errors.phone} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function ServicesStep({
  draft,
  errors,
  onChange,
  onAddItem,
  onRemoveItem,
}: {
  draft: WorkerOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: WorkerOnboardingDraft[Key]) => void;
  onAddItem: (key: "services" | "serviceAreas" | "additionalCategorySlugs", value: string) => void;
  onRemoveItem: (key: "services" | "serviceAreas" | "additionalCategorySlugs", value: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <FieldGroup>
        <Field>
          <Label>Categoria principal</Label>
          <Select value={draft.categorySlug} onChange={(event) => onChange("categorySlug", event.target.value)}>
            <option value="">Selecione uma categoria</option>
            {publicCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
          <InlineError message={errors.categorySlug} />
        </Field>
        <Field>
          <Label>Preço inicial</Label>
          <Input value={draft.startingPrice} onChange={(event) => onChange("startingPrice", event.target.value)} placeholder="Ex.: Atendimento a partir de R$ 90" />
          <InlineError message={errors.startingPrice} />
        </Field>
      </FieldGroup>
      <TagEditor
        label="Categorias adicionais"
        placeholder="Ex.: marido-de-aluguel"
        values={draft.additionalCategorySlugs}
        onAdd={(value) => onAddItem("additionalCategorySlugs", value)}
        onRemove={(value) => onRemoveItem("additionalCategorySlugs", value)}
      />
      <TagEditor
        label="Lista de serviços"
        placeholder="Ex.: Instalacao de tomadas"
        values={draft.services}
        error={errors.services}
        onAdd={(value) => onAddItem("services", value)}
        onRemove={(value) => onRemoveItem("services", value)}
      />
      <FieldGroup>
        <Field>
          <Label>Cidade base</Label>
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
          <Label>Bairro base</Label>
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
      <TagEditor
        label="Área de atendimento"
        placeholder="Ex.: Mooca"
        values={draft.serviceAreas}
        error={errors.serviceAreas}
        suggestions={neighborhoods}
        onAdd={(value) => onAddItem("serviceAreas", value)}
        onRemove={(value) => onRemoveItem("serviceAreas", value)}
      />
      <Field>
        <Label>Como você atende essa região</Label>
        <Input value={draft.workAreaSummary} onChange={(event) => onChange("workAreaSummary", event.target.value)} placeholder="Ex.: Atendo em campo, por bairro e com deslocamento proprio." />
        <InlineError message={errors.workAreaSummary} />
      </Field>
      <Field>
        <Label>Descrição profissional</Label>
        <Textarea
          value={draft.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Conte sua experiência, tipos de serviço, diferenciais, garantia, ferramentas e forma de atendimento."
        />
        <FieldHint>{draft.description.length}/40 caracteres minimos</FieldHint>
        <InlineError message={errors.description} />
      </Field>
      <Field>
        <Label>Disponibilidade</Label>
        <Textarea value={draft.availability} onChange={(event) => onChange("availability", event.target.value)} placeholder="Ex.: Segunda a sexta, das 8h as 18h. Sabados mediante agendamento." />
        <InlineError message={errors.availability} />
      </Field>
      <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface-muted p-4 text-sm font-bold text-muted-strong">
        <input type="checkbox" checked={draft.emergencyAvailable} onChange={(event) => onChange("emergencyAvailable", event.target.checked)} className="mt-1" />
        Atendo emergencias quando houver disponibilidade
      </label>
    </div>
  );
}

function VerificationStep({
  draft,
  errors,
  onChange,
  onImagePreview,
}: {
  draft: WorkerOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: WorkerOnboardingDraft[Key]) => void;
  onImagePreview: (key: "profilePhotoPreview" | "coverImagePreview" | "identityDocumentPreview" | "addressProofPreview", file?: File) => void;
}) {
  return (
    <div className="grid gap-6">
      <Card variant="muted">
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <TrustRequirement label="Nome, telefone e e-mail" ready={Boolean(draft.fullName && draft.phone && draft.email)} />
            <TrustRequirement label="Cidade e bairro" ready={Boolean(draft.city && draft.neighborhood)} />
            <TrustRequirement label="Consentimentos" ready={draft.termsAccepted && draft.verificationConsentAccepted} />
          </div>
        </CardContent>
      </Card>

      <Field>
        <Label>Referencia do documento de identidade</Label>
        <Input value={draft.identityDocumentReference} onChange={(event) => onChange("identityDocumentReference", event.target.value)} placeholder="Ex.: CPF, CNH, RG ou protocolo interno" />
        <FieldHint>Esse dado é privado e serve apenas para rastreio interno da verificação.</FieldHint>
        <InlineError message={errors.identityDocumentReference} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <UploadPreview
          label="Documento de identidade"
          helper="Imagem privada para revisão administrativa."
          previewUrl={draft.identityDocumentPreview}
          icon={<FileText size={22} />}
          onChange={(file) => onImagePreview("identityDocumentPreview", file)}
        />
        <UploadPreview
          label="Comprovante de endereço"
          helper="Conta recente ou comprovante valido no mesmo municipio."
          previewUrl={draft.addressProofPreview}
          icon={<MapPin size={22} />}
          onChange={(file) => onImagePreview("addressProofPreview", file)}
        />
      </div>
      <InlineError message={errors.identityDocumentPreview || errors.addressProofPreview} />

      <div className="grid gap-3">
        <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
          <input type="checkbox" checked={draft.termsAccepted} onChange={(event) => onChange("termsAccepted", event.target.checked)} className="mt-1" />
          <span>
            <span className="block font-black text-foreground">Aceite dos termos</span>
            <span className="mt-1 block leading-6 text-muted">Confirmo que li os termos da plataforma e entendo as regras de segurança, públicação e moderação.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm">
          <input type="checkbox" checked={draft.verificationConsentAccepted} onChange={(event) => onChange("verificationConsentAccepted", event.target.checked)} className="mt-1" />
          <span>
            <span className="block font-black text-foreground">Consentimento para verificação</span>
            <span className="mt-1 block leading-6 text-muted">Autorizo a plataforma a analisar documento, endereço, captura facial e provas de atividade para confiança e protecao.</span>
          </span>
        </label>
      </div>
      <InlineError message={errors.termsAccepted || errors.verificationConsentAccepted} />

      <FacialEnrollmentStep audience="profissional" value={draft.facialEnrollment} onChange={(value) => onChange("facialEnrollment", value)} />
      <InlineError message={errors.facialEnrollment} />
    </div>
  );
}

function ActivityStep({
  draft,
  errors,
  rule,
  onAddItem,
  onRemoveItem,
}: {
  draft: WorkerOnboardingDraft;
  errors: Record<string, string>;
  rule: ReturnType<typeof getCategoryVerificationRule>;
  onAddItem: (item: PortfolioDraftItem) => void;
  onRemoveItem: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [evidenceType, setEvidenceType] = useState<PortfolioDraftItem["evidenceType"]>("portfolio_proof");
  const [workerVisible, setWorkerVisible] = useState(false);

  function addItem() {
    if (!title.trim()) {
      return;
    }

    onAddItem({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      previewUrl,
      evidenceType,
      workerVisible,
    });

    setTitle("");
    setDescription("");
    setPreviewUrl(undefined);
    setEvidenceType("portfolio_proof");
    setWorkerVisible(false);
  }

  return (
    <div className="grid gap-6">
      <Card variant="muted">
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-black text-foreground">{rule.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Para publicar o perfil, envie no mínimo {rule.minimumPortfolioImages} imagens reais de trabalhos executados. As regras mudam conforme a categoria.
              </p>
            </div>
            <Badge variant="info">Portfólio mínimo: {rule.minimumPortfolioImages} imagens</Badge>
          </div>
          <div className="mt-4 grid gap-2">
            {rule.evidenceGuidance.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-[8px] bg-surface px-3 py-2 text-sm text-muted-strong">
                <CheckCircle2 className="mt-0.5 text-primary" size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="muted" className="p-4">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <UploadPreview label="Imagem real do trabalho" helper="Adicione foto privada para análise e portfólio." previewUrl={previewUrl} icon={<ImagePlus size={22} />} onChange={(file) => file && setPreviewUrl(URL.createObjectURL(file))} />
          <div className="grid gap-4">
            <Field>
              <Label>Titulo da evidencia</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Troca completa de quadro elétrico" />
            </Field>
            <Field>
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Explique o que foi executado, local, contexto do serviço e resultado." />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Tipo de prova</Label>
                <Select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value as PortfolioDraftItem["evidenceType"])}>
                  <option value="portfolio_proof">Resultado final</option>
                  <option value="activity_proof">Atividade real</option>
                  <option value="worker_on_site">Profissional no local</option>
                  <option value="workshop_evidence">Oficina ou bancada</option>
                  <option value="vehicle_evidence">Veiculo ou equipamento</option>
                </Select>
              </Field>
              <label className="flex items-center gap-3 rounded-[8px] border border-border bg-surface px-4 py-3 text-sm font-bold text-muted-strong">
                <input type="checkbox" checked={workerVisible} onChange={(event) => setWorkerVisible(event.target.checked)} />
                Profissional aparece na imagem
              </label>
            </FieldGroup>
            <Button type="button" variant="subtle" onClick={addItem}>
              <Plus className="mr-2" size={18} />
              Adicionar prova de atividade
            </Button>
          </div>
        </div>
      </Card>

      <InlineError message={errors.portfolio} />

      {draft.portfolio.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {draft.portfolio.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.previewUrl ? (
                <div className="relative h-44">
                  <Image src={item.previewUrl} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              ) : null}
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">{getEvidenceLabel(item.evidenceType)}</Badge>
                      {item.workerVisible ? <Badge variant="success">Profissional na imagem</Badge> : null}
                    </div>
                    <h3 className="mt-3 font-black text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description || "Sem descrição informada."}</p>
                  </div>
                  <button type="button" onClick={() => onRemoveItem(item.id)} className="rounded-[8px] border border-border p-2 text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-border-strong bg-surface p-6 text-center">
          <ImagePlus className="mx-auto text-muted" size={30} />
          <p className="mt-3 font-black text-foreground">Nenhuma prova de atividade adicionada</p>
          <p className="mt-2 text-sm text-muted">Perfis publicados precisam de no mínimo 3 imagens reais do trabalho.</p>
        </div>
      )}
    </div>
  );
}

function QualificationsStep({
  draft,
  errors,
  onChange,
  onAddQualification,
  onRemoveQualification,
}: {
  draft: WorkerOnboardingDraft;
  errors: Record<string, string>;
  onChange: <Key extends DraftKey>(key: Key, value: WorkerOnboardingDraft[Key]) => void;
  onAddQualification: (item: WorkerQualificationDraft) => void;
  onRemoveQualification: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState<WorkerQualificationDraft["type"]>("course");
  const [year, setYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  function addQualification() {
    if (!title.trim()) {
      return;
    }

    onAddQualification({
      id: crypto.randomUUID(),
      type,
      title: title.trim(),
      institution: institution.trim(),
      year: year.trim(),
      registrationNumber: registrationNumber.trim(),
      previewUrl,
    });

    setTitle("");
    setInstitution("");
    setType("course");
    setYear("");
    setRegistrationNumber("");
    setPreviewUrl(undefined);
  }

  return (
    <div className="grid gap-6">
      <Card variant="muted">
        <CardContent>
          <p className="font-black text-foreground">Qualificações opcionais</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Formação, cursos e certificados fortalecem o perfil, mas não são obrigatórios para todas as categorias. Use apenas o que realmente se aplica ao seu trabalho.
          </p>
        </CardContent>
      </Card>

      <FieldGroup>
        <Field>
          <Label>Anos de experiência</Label>
          <Input value={draft.experienceYears} onChange={(event) => onChange("experienceYears", event.target.value)} placeholder="Ex.: 8" />
        </Field>
        <Field>
          <Label>Escolaridade</Label>
          <Input value={draft.educationLevel} onChange={(event) => onChange("educationLevel", event.target.value)} placeholder="Ex.: Ensino medio completo" />
        </Field>
      </FieldGroup>
      <Field>
        <Label>Experiência comprovada</Label>
        <Textarea value={draft.experienceSummary} onChange={(event) => onChange("experienceSummary", event.target.value)} placeholder="Ex.: Atuo ha 8 anos com manutenção predial, atendimento residencial e pequenos comerciais." />
      </Field>
      <FieldGroup>
        <Field>
          <Label>Cursos</Label>
          <Input value={draft.courseSummary} onChange={(event) => onChange("courseSummary", event.target.value)} placeholder="Ex.: NR10, instalacao de ar-condicionado, corte feminino" />
        </Field>
        <Field>
          <Label>Faculdade ou instituição</Label>
          <Input value={draft.collegeName} onChange={(event) => onChange("collegeName", event.target.value)} placeholder="Opcional" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <Label>Registro ou licenca</Label>
          <Input value={draft.licenseRegistrationNumber} onChange={(event) => onChange("licenseRegistrationNumber", event.target.value)} placeholder="Opcional, quando aplicável" />
        </Field>
        <Field>
          <Label>MEI</Label>
          <Input value={draft.meiNumber} onChange={(event) => onChange("meiNumber", event.target.value)} placeholder="Opcional" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <Label>Empresa</Label>
          <Input value={draft.companyName} onChange={(event) => onChange("companyName", event.target.value)} placeholder="Opcional" />
        </Field>
        <Field>
          <Label>Documento da empresa</Label>
          <Input value={draft.companyDocument} onChange={(event) => onChange("companyDocument", event.target.value)} placeholder="CNPJ ou referencia interna" />
        </Field>
      </FieldGroup>

      <Card variant="muted" className="p-4">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <UploadPreview label="Imagem do certificado" helper="Opcional, para revisão administrativa." previewUrl={previewUrl} icon={<FileBadge2 size={22} />} onChange={(file) => file && setPreviewUrl(URL.createObjectURL(file))} />
          <div className="grid gap-4">
            <FieldGroup>
              <Field>
                <Label>Tipo</Label>
                <Select value={type} onChange={(event) => setType(event.target.value as WorkerQualificationDraft["type"])}>
                  <option value="education">Formação</option>
                  <option value="course">Curso</option>
                  <option value="certification">Certificacao</option>
                  <option value="license">Licenca</option>
                </Select>
              </Field>
              <Field>
                <Label>Ano</Label>
                <Input value={year} onChange={(event) => setYear(event.target.value)} placeholder="Ex.: 2024" />
              </Field>
            </FieldGroup>
            <Field>
              <Label>Titulo</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: NR10 básico" />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Instituição</Label>
                <Input value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Ex.: SENAI" />
              </Field>
              <Field>
                <Label>Registro</Label>
                <Input value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} placeholder="Opcional" />
              </Field>
            </FieldGroup>
            <Button type="button" variant="subtle" onClick={addQualification}>
              <Plus className="mr-2" size={18} />
              Adicionar qualificacao
            </Button>
          </div>
        </div>
      </Card>

      {draft.qualifications.length ? (
        <div className="grid gap-3">
          {draft.qualifications.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 rounded-[8px] border border-border bg-surface p-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{getQualificationLabel(item.type)}</Badge>
                  {item.year ? <Badge variant="neutral">{item.year}</Badge> : null}
                </div>
                <p className="mt-3 font-black text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.institution || "Instituição não informada"}</p>
                {item.registrationNumber ? <p className="mt-1 text-xs font-bold uppercase tracking-normal text-primary">Registro: {item.registrationNumber}</p> : null}
              </div>
              <button type="button" onClick={() => onRemoveQualification(item.id)} className="rounded-[8px] border border-border p-2 text-danger">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <InlineError message={errors.qualifications} />
    </div>
  );
}

function ReviewStep({
  draft,
  progress,
  categoryRule,
  errors,
}: {
  draft: WorkerOnboardingDraft;
  progress: number;
  categoryRule: ReturnType<typeof getCategoryVerificationRule>;
  errors: Record<string, string>;
}) {
  const trustSignals = [
    { label: "Identidade verificada", ready: Boolean(draft.identityDocumentPreview) },
    { label: "Telefone verificado", ready: Boolean(draft.phone) },
    { label: "Endereço verificado", ready: Boolean(draft.addressProofPreview) },
    { label: "Verificação facial concluida", ready: draft.facialEnrollment.status === "em_analise" || draft.facialEnrollment.status === "aprovado" },
    { label: "Portfólio verificado", ready: draft.portfolio.length >= categoryRule.minimumPortfolioImages },
    { label: "Experiência comprovada", ready: Boolean(draft.experienceYears || draft.experienceSummary) },
    { label: "Certificados enviados", ready: draft.qualifications.length > 0 },
    { label: "Formação informada", ready: Boolean(draft.educationLevel || draft.collegeName) },
  ];

  return (
    <div className="grid gap-5">
      <div className="rounded-[8px] border border-border bg-surface-muted p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-muted">Completude do perfil</p>
            <p className="mt-1 text-3xl font-black text-foreground">{progress}%</p>
          </div>
          <Badge variant={progress >= 80 ? "success" : "warning"}>{progress >= 80 ? "Pronto para análise" : "Complete mais dados"}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryItem icon={<BadgeCheck size={18} />} label="Conta" value={`${draft.fullName || "Não informado"} - ${draft.publicName || "Não informado"}`} />
        <SummaryItem icon={<MapPin size={18} />} label="Base de atendimento" value={`${draft.neighborhood || "Bairro não informado"}, ${draft.city || "cidade não informada"}`} />
        <SummaryItem icon={<Clock size={18} />} label="Disponibilidade" value={draft.availability || "Não informada"} />
        <SummaryItem icon={<ShieldCheck size={18} />} label="Verificação de identidade" value={draft.facialEnrollment.status ? draft.facialEnrollment.status.replace("_", " ") : "Não iniciada"} />
        <SummaryItem icon={<ImagePlus size={18} />} label="Provas de atividade" value={`${draft.portfolio.length} imagem(ns) enviadas`} />
        <SummaryItem icon={<FileBadge2 size={18} />} label="Qualificações opcionais" value={`${draft.qualifications.length} item(ns) informados`} />
      </div>

      <Card>
        <CardHeader>
          <SectionHeader className="mb-0" title="Sinais públicos de confiança" description="Os badges públicos dependem de revisão e aprovação. Documentos privados nunca são expostos no perfil." />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {trustSignals.map((item) => (
              <TrustRequirement key={item.label} label={item.label} ready={item.ready} />
            ))}
          </div>
        </CardContent>
      </Card>

      {Object.values(errors).length ? (
        <div className="rounded-[8px] border border-danger/30 bg-danger-soft p-4 text-sm font-semibold text-danger">
          Revise os campos obrigatórios antes de enviar para análise.
        </div>
      ) : null}
    </div>
  );
}

function UploadPreview({
  label,
  helper,
  previewUrl,
  icon,
  wide = false,
  onChange,
}: {
  label: string;
  helper: string;
  previewUrl?: string;
  icon: ReactNode;
  wide?: boolean;
  onChange: (file?: File) => void;
}) {
  return (
    <label className={cn("group relative grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-surface-muted p-4 text-center", wide && "min-h-52")}>
      {previewUrl ? <Image src={previewUrl} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : null}
      <input type="file" accept="image/*" className="sr-only" onChange={(event) => onChange(event.target.files?.[0])} />
      <span className={cn("relative z-10 rounded-[8px] bg-surface/90 p-4 shadow-[var(--shadow-sm)]", previewUrl && "backdrop-blur")}>
        <span className="mx-auto flex size-10 items-center justify-center rounded-[8px] bg-primary-soft text-primary">{icon}</span>
        <span className="mt-3 block font-black text-foreground">{label}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-muted">{helper}</span>
      </span>
    </label>
  );
}

function TagEditor({
  label,
  placeholder,
  values,
  error,
  suggestions,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  values: string[];
  error?: string;
  suggestions?: string[];
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
      <Label>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
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
      {suggestions ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => onAdd(suggestion)} className="rounded-[8px] bg-primary-soft px-3 py-1 text-xs font-bold text-primary-strong">
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
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

function TrustRequirement({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] border border-border bg-surface p-3">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <Badge variant={ready ? "success" : "warning"}>{ready ? "Pronto para revisão" : "Pendente"}</Badge>
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

function getQualificationLabel(type: WorkerQualificationDraft["type"]) {
  if (type === "education") return "Formação";
  if (type === "certification") return "Certificacao";
  if (type === "license") return "Licenca";

  return "Curso";
}

function getEvidenceLabel(type: PortfolioDraftItem["evidenceType"]) {
  if (type === "activity_proof") return "Atividade real";
  if (type === "worker_on_site") return "Profissional no local";
  if (type === "workshop_evidence") return "Oficina ou bancada";
  if (type === "vehicle_evidence") return "Veiculo ou equipamento";

  return "Resultado final";
}

function getInitialDraftState() {
  if (typeof window === "undefined") {
    return {
      draft: defaultWorkerOnboardingDraft,
      status: "Rascunho não salvo",
    };
  }

  const storedDraft = window.localStorage.getItem(storageKey);

  if (!storedDraft) {
    return {
      draft: defaultWorkerOnboardingDraft,
      status: "Rascunho não salvo",
    };
  }

  try {
    return {
      draft: { ...defaultWorkerOnboardingDraft, ...JSON.parse(storedDraft) },
      status: "Rascunho recuperado",
    };
  } catch {
    return {
      draft: defaultWorkerOnboardingDraft,
      status: "Não foi possível recuperar o rascunho",
    };
  }
}
