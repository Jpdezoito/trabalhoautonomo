import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquareText,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/config/routes";
import { getFacialStatusLabel } from "@/features/identity/utils";
import { AvailabilityToggle } from "@/features/workers/dashboard/availability-toggle";
import { quotes } from "@/lib/marketplace-data";
import { formatRating } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function WorkerDashboardOverview({ worker, readOnly = false }: { worker: Worker; readOnly?: boolean }) {
  const profileScore = getProfileScore(worker);
  const openQuotes = quotes.filter((quote) => quote.worker === worker.name || quote.worker !== "").slice(0, 3);

  return (
    <div className="grid gap-6">
      {readOnly ? (
        <Card variant="muted">
          <CardContent>
            <Badge variant="info">Modo preview admin</Badge>
            <p className="mt-2 text-sm leading-6 text-muted">Visualizacao somente leitura do painel profissional.</p>
          </CardContent>
        </Card>
      ) : (
        <AvailabilityToggle initialAvailable={worker.available} />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads do mes" value="28" detail="Pedidos recebidos no periodo." icon={<MessageSquareText size={22} />} />
        <StatCard label="Servicos concluidos" value={`${worker.jobsDone}`} detail="Historico visivel no perfil." icon={<BriefcaseBusiness size={22} />} />
        <StatCard label="Avaliacao media" value={formatRating(worker.rating)} detail={`${worker.reviewsCount} avaliacoes publicas.`} icon={<Star size={22} />} />
        <StatCard label="Perfil" value={`${profileScore}%`} detail="Completude estimada do cadastro." icon={<BadgeCheck size={22} />} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Saude do perfil</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Perfis completos tendem a receber pedidos mais qualificados e melhores respostas dos clientes.
                </p>
              </div>
              {readOnly ? null : (
                <LinkButton href={routes.workerProfileSettings} variant="outline">
                  Editar perfil
                </LinkButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 md:grid-cols-[1fr_180px] md:items-center">
              <div>
                <div className="h-3 overflow-hidden rounded-[8px] bg-surface-muted">
                  <div className="h-full bg-primary" style={{ width: `${profileScore}%` }} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ChecklistItem completed label="Descricao profissional completa" />
                  <ChecklistItem completed={worker.portfolio.length > 0} label="Portfolio com fotos reais" />
                  <ChecklistItem completed={worker.verified} label="Perfil verificado" />
                  <ChecklistItem completed={worker.services.length >= 3} label="Servicos principais definidos" />
                </div>
              </div>
              <div className="rounded-[8px] bg-primary-soft p-5 text-primary-strong">
                <p className="text-5xl font-black tracking-tight">{profileScore}%</p>
                <p className="mt-2 text-sm font-bold">Perfil competitivo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <StatusLine icon={<Clock size={18} />} label="Resposta" value={worker.responseTime} />
              <StatusLine icon={<CalendarClock size={18} />} label="Agenda" value={worker.available ? "Aberta para pedidos" : "Pausada"} />
              <StatusLine icon={<WalletCards size={18} />} label="Preco inicial" value={worker.startingPrice} />
              <StatusLine icon={<ShieldCheck size={18} />} label="Verificacao facial" value={getFacialStatusLabel(worker.identityVerification?.status)} />
              <StatusLine icon={<Eye size={18} />} label="Perfil publico" value="Publicado" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Pedidos recentes</CardTitle>
              <LinkButton href={routes.workerQuotes} variant="outline">
                Ver inbox
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {openQuotes.map((quote) => (
                <div key={quote.id} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-primary">{quote.id}</p>
                    <h3 className="mt-1 font-black text-foreground">{quote.service}</h3>
                    <p className="mt-1 text-sm text-muted">{quote.client} - {quote.location}</p>
                  </div>
                  <Badge variant={quote.status === "Aberto" ? "warning" : quote.status === "Aprovado" ? "success" : "info"}>{quote.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificacoes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <NotificationLine title="Novo pedido recebido" text="Responda em ate 24h para manter boa taxa de retorno." />
              <NotificationLine title="Portfolio atualizado" text={`${worker.portfolio.length} trabalhos estao visiveis no perfil.`} />
              <NotificationLine
                title="Verificacao de identidade"
                text={
                  worker.identityVerification?.status === "aprovado"
                    ? "Sua verificacao facial foi aprovada e ja pode apoiar a recuperacao segura de senha."
                    : "Envie sua verificacao facial para reforcar a confianca do perfil e a seguranca da conta."
                }
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <ShortcutCard icon={<Camera size={22} />} title="Portfolio" text="Ordene imagens, marque destaque e adicione novos trabalhos." href={routes.workerPortfolio} />
        <ShortcutCard icon={<BriefcaseBusiness size={22} />} title="Servicos" text="Mantenha especialidades, preco inicial e areas atendidas atualizadas." href={routes.workerServices} />
        <ShortcutCard icon={<Star size={22} />} title="Avaliacoes" text="Acompanhe feedbacks recentes e pontos de melhoria." href={routes.workerReviews} />
      </section>
    </div>
  );
}

function ChecklistItem({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] bg-surface-muted p-3">
      <CheckCircle2 className={completed ? "text-success" : "text-muted"} size={18} />
      <span className="text-sm font-bold text-muted-strong">{label}</span>
    </div>
  );
}

function StatusLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[8px] bg-surface-muted p-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
        <p className="mt-1 text-sm font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}

function NotificationLine({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[8px] border border-border bg-surface p-3">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 text-primary" size={17} />
        <div>
          <p className="font-black text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <Card>
      <CardContent>
        <span className="flex size-11 items-center justify-center rounded-[8px] bg-primary-soft text-primary">{icon}</span>
        <h3 className="mt-4 text-xl font-black text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
        <LinkButton href={href} variant="outline" className="mt-4 w-full">
          Abrir
        </LinkButton>
      </CardContent>
    </Card>
  );
}

function getProfileScore(worker: Worker) {
  const checks = [
    worker.bio.length > 120,
    worker.services.length >= 3,
    worker.areas.length >= 3,
    worker.portfolio.length >= 2,
    Boolean(worker.startingPrice),
    Boolean(worker.whatsapp),
    worker.verified,
  ];
  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}
