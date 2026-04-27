import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";
import { ContactActions } from "@/components/marketplace/contact-actions";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { QuoteRequestPanel } from "@/components/marketplace/quote-request-panel";
import { ReviewForm } from "@/components/marketplace/review-form";
import { ReviewSummary } from "@/components/marketplace/review-summary";
import { PlanBadge, TrustBadge } from "@/components/marketplace/trust-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRating } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function WorkerProfile({ worker }: { worker: Worker }) {
  const uniqueAreas = Array.from(new Set([worker.neighborhood, ...worker.areas]));
  const trustVerified = worker.trustVerification?.status === "verificado" || worker.verified;
  const trustInReview = worker.trustVerification?.status === "em_analise" || worker.trustVerification?.status === "pendente";

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-[#202522] text-white">
        <Image src={worker.coverImage} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#202522] via-[#202522]/88 to-[#202522]/45" />
        <div className="relative container-page py-10 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                {worker.verified ? (
                  <span className="[&>span]:bg-white/12 [&>span]:text-[#dff3e8] [&>span]:ring-white/20">
                    <TrustBadge worker={worker} />
                  </span>
                ) : trustInReview ? (
                  <Badge variant="warning" className="bg-white/12 text-accent ring-white/20">
                    Verificacao de identidade em analise
                  </Badge>
                ) : (
                  <Badge variant="neutral" className="bg-white/12 text-white ring-white/20">
                    Nao verificado
                  </Badge>
                )}
                {worker.trustVerification?.badgeEnabled ? (
                  <Badge variant="info" className="bg-white/12 text-white ring-white/20">
                    Confianca e protecao
                  </Badge>
                ) : null}
                <PlanBadge plan={worker.plan} />
                <Badge variant="neutral" className="bg-white/12 text-white ring-white/20">
                  {worker.available ? "Disponivel agora" : "Agenda pausada"}
                </Badge>
              </div>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end">
                <Image
                  src={worker.image}
                  alt={worker.name}
                  width={132}
                  height={132}
                  className="size-28 rounded-[8px] border-4 border-white object-cover shadow-[var(--shadow-lg)] sm:size-32"
                />
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">{worker.role}</p>
                  <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{worker.name}</h1>
                  <p className="mt-3 max-w-3xl text-lg leading-8 text-[#eee7d9]">{worker.headline}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-[#d8d0c2]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={17} />
                      {worker.neighborhood}, {worker.city}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={17} />
                      {worker.responseTime}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Star className="fill-accent text-accent" size={17} />
                      {formatRating(worker.rating)} de 5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-white/18 bg-white/95 shadow-[var(--shadow-lg)]">
              <CardContent>
                <p className="text-sm font-bold text-muted">Acoes rapidas</p>
                <div className="mt-4 grid gap-3">
                  <ContactActions worker={worker} />
                  <FavoriteButton workerSlug={worker.slug} workerName={worker.name} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="container-page grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Card>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Info icon={<Star size={19} />} label="Avaliacao" value={`${formatRating(worker.rating)} de 5`} detail={`${worker.reviewsCount} avaliacoes`} />
                <Info icon={<BriefcaseBusiness size={19} />} label="Servicos" value={`${worker.jobsDone}`} detail="concluidos pela plataforma" />
                <Info icon={<CalendarCheck size={19} />} label="Experiencia" value={`${worker.yearsExperience} anos`} detail="de atuacao profissional" />
                <Info
                  icon={<ShieldCheck size={19} />}
                  label="Status da verificacao"
                  value={trustVerified ? "Verificado" : trustInReview ? "Em analise" : "Nao verificado"}
                  detail={worker.trustVerification?.badgeEnabled ? "confianca e protecao ativas" : "verificacao de identidade"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre o profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-8 text-muted">{worker.bio}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] bg-surface-muted p-4">
                  <WalletCards className="text-primary" size={22} />
                  <p className="mt-3 text-sm font-bold text-muted">Preco inicial</p>
                  <p className="mt-1 font-black text-foreground">{worker.startingPrice}</p>
                </div>
                <div className="rounded-[8px] bg-surface-muted p-4">
                  <Clock className="text-primary" size={22} />
                  <p className="mt-3 text-sm font-bold text-muted">Disponibilidade</p>
                  <p className="mt-1 font-black text-foreground">{worker.available ? worker.responseTime : "Agenda indisponivel no momento"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicos oferecidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {worker.services.map((service) => (
                  <div key={service} className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={19} />
                    <div>
                      <p className="font-black text-foreground">{service}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">Atendimento com analise de escopo e orcamento personalizado.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {worker.categories.map((category) => (
                  <Badge key={category} variant="neutral">
                    {formatCategoryLabel(category)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas atendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {uniqueAreas.map((area) => (
                  <Badge key={area} variant="primary">
                    <MapPin size={14} />
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {worker.trustSignals?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Confianca e protecao</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {worker.trustSignals.map((signal) => (
                    <div key={signal.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-border bg-surface p-3">
                      <span className="text-sm font-bold text-foreground">{signal.label}</span>
                      <Badge variant={signal.status === "verificado" ? "success" : signal.status === "pendente" ? "warning" : "neutral"}>
                        {signal.status === "verificado" ? "Verificado" : signal.status === "pendente" ? "Em analise" : "Nao informado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {worker.profileStrength?.experienceSummary || worker.profileStrength?.educationLevel || worker.profileStrength?.qualifications?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Experiencia e qualificacoes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  {worker.profileStrength?.experienceSummary ? (
                    <div className="rounded-[8px] bg-surface-muted p-4">
                      <p className="text-sm font-bold text-muted">Experiencia comprovada</p>
                      <p className="mt-2 text-sm leading-7 text-foreground">{worker.profileStrength.experienceSummary}</p>
                    </div>
                  ) : null}
                  {worker.profileStrength?.educationLevel || worker.profileStrength?.collegeName || worker.profileStrength?.courseSummary ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {worker.profileStrength.educationLevel ? <Info icon={<BadgeCheck size={19} />} label="Formacao" value={worker.profileStrength.educationLevel} detail={worker.profileStrength.collegeName || "Informacao opcional"} /> : null}
                      {worker.profileStrength.courseSummary ? <Info icon={<FileText size={19} />} label="Cursos" value={worker.profileStrength.courseSummary} detail="Informado pelo profissional" /> : null}
                    </div>
                  ) : null}
                  {worker.profileStrength?.qualifications?.length ? (
                    <div className="grid gap-3">
                      {worker.profileStrength.qualifications.map((item) => (
                        <div key={`${item.type}-${item.title}`} className="flex items-start justify-between gap-4 rounded-[8px] border border-border bg-surface p-4">
                          <div>
                            <p className="font-black text-foreground">{item.title}</p>
                            <p className="mt-1 text-sm text-muted">{item.institution || "Instituicao nao informada"}</p>
                            {item.year ? <p className="mt-1 text-xs font-bold uppercase tracking-normal text-primary">{item.year}</p> : null}
                          </div>
                          <Badge variant={item.verified ? "success" : "neutral"}>{item.verified ? "Validado" : "Informado"}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Portfolio verificado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {worker.portfolio.map((item) => (
                  <article key={item.title} className="overflow-hidden rounded-[8px] border border-border bg-surface">
                    <div className="relative h-60">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                      {worker.portfolio[0]?.title === item.title ? (
                        <Badge variant="warning" className="absolute left-3 top-3">
                          Destaque
                        </Badge>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.verified ? <Badge variant="success">Portfolio verificado</Badge> : null}
                        {item.workerVisible ? <Badge variant="info">Profissional na imagem</Badge> : null}
                        {item.evidenceLabel ? <Badge variant="neutral">{item.evidenceLabel}</Badge> : null}
                      </div>
                      <h3 className="font-black text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">{item.city}</p>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>

          <ReviewSummary worker={worker} />
          <ReviewForm worker={worker} />
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-24 lg:h-fit">
          <QuoteRequestPanel worker={worker} />
          <Card>
            <CardHeader>
              <CardTitle>Contato profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <ContactLine label="WhatsApp" value={worker.whatsapp} />
                {worker.contactSettings?.showPhone && worker.phone ? <ContactLine label="Telefone" value={worker.phone} /> : null}
                <ContactLine label="Base" value={`${worker.neighborhood}, ${worker.city}`} />
                <ContactLine label="Tempo de resposta" value={worker.responseTime} />
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

function Info({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[8px] bg-surface-muted p-4">
      <div className="text-primary">{icon}</div>
      <p className="mt-3 text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted">{detail}</p>
    </div>
  );
}

function ContactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[8px] bg-surface-muted p-3">
      <span className="font-bold text-muted">{label}</span>
      <span className="text-right font-black text-foreground">{value}</span>
    </div>
  );
}

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
