import Link from "next/link";
import { Activity, ArrowRight, BriefcaseBusiness, ClipboardCheck, Flag, ShieldAlert, UserRound, Users } from "lucide-react";
import { QuoteTable } from "@/components/dashboard/quote-table";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/config/routes";
import { adminActivity, moderationCases, verificationQueue } from "@/features/admin/admin-data";

export function AdminOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                <UserRound size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-foreground">Preview do Cliente</h2>
                <p className="mt-1 text-sm leading-6 text-muted">Visualize o painel do cliente em modo somente leitura.</p>
              </div>
            </div>
            <LinkButton href="/admin/preview/cliente/USR-1001" variant="outline" size="md" className="w-full whitespace-nowrap sm:w-auto">
              Acessar
            </LinkButton>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                <BriefcaseBusiness size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-foreground">Preview do Profissional</h2>
                <p className="mt-1 text-sm leading-6 text-muted">Abra o painel profissional sem entrar na conta dele.</p>
              </div>
            </div>
            <LinkButton href="/admin/preview/profissional/carlos-mendes-eletricista" variant="outline" size="md" className="w-full whitespace-nowrap sm:w-auto">
              Acessar
            </LinkButton>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuários" value="2.846" detail="Clientes e profissionais ativos." icon={<Users size={22} />} />
        <StatCard label="Verificacoes" value={String(verificationQueue.length)} detail="Perfis aguardando análise." icon={<ClipboardCheck size={22} />} />
        <StatCard label="Moderação" value={String(moderationCases.length)} detail="Casos abertos para revisão." icon={<ShieldAlert size={22} />} />
        <StatCard label="Atividade" value="Alta" detail="Fluxo administrativo da ultima semana." icon={<Activity size={22} />} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Panorama operacional</CardTitle>
              <div className="flex flex-wrap gap-2">
                <LinkButton href={routes.adminModeration} variant="outline" size="sm">
                  Ir para moderação
                </LinkButton>
                <LinkButton href={routes.adminVerification} variant="outline" size="sm">
                  Revisar verificacoes
                </LinkButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {adminActivity.map((item) => (
                <div key={item.label} className="rounded-[8px] border border-border bg-surface p-4">
                  <p className="text-sm font-bold text-muted">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-foreground">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Fila critica</CardTitle>
              <LinkButton href={routes.adminModeration} variant="ghost" size="sm">
                Ver fila completa
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {moderationCases.map((item) => (
                <div key={item.id} className="rounded-[8px] border border-border bg-surface p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-foreground">{item.target}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.reason}</p>
                    </div>
                    <Badge variant={item.status === "open" ? "warning" : item.status === "in_review" ? "info" : "danger"}>{item.id}</Badge>
                  </div>
                  <LinkButton href={`${routes.adminModeration}#${item.id}`} variant="outline" size="sm" className="mt-3">
                    Analisar caso
                  </LinkButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Alertas administrativos</CardTitle>
              <LinkButton href={routes.adminUsers} variant="ghost" size="sm">
                Ver usuários
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <AlertLine icon={<Flag size={17} />} title="Avaliação sinalizada" text="Revise a fila de moderação para manter o marketplace confiavel." href={routes.adminReviews} />
              <AlertLine icon={<ClipboardCheck size={17} />} title="Verificacoes pendentes" text="Existem perfis aguardando aprovação documental." href={routes.adminVerification} />
              <AlertLine icon={<Users size={17} />} title="Contas novas" text="Novos usuários entraram na plataforma nesta semana." href={routes.adminUsers} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function AlertLine({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <Link href={href} className="rounded-[8px] border border-border bg-surface p-3 transition hover:border-primary hover:bg-primary-soft/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-primary">{icon}</span>
          <div>
            <p className="font-black text-foreground">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
          </div>
        </div>
        <ArrowRight className="mt-0.5 text-muted" size={16} />
      </div>
    </Link>
  );
}
