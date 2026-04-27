import { Bell, Heart, MapPin, MessageSquareText, Search, Star, UserRound } from "lucide-react";
import { QuoteTable } from "@/components/dashboard/quote-table";
import { WorkerCard } from "@/components/marketplace/worker-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/config/routes";
import { categories, quotes, workers } from "@/lib/marketplace-data";

export function ClientDashboardOverview({ readOnly = false }: { readOnly?: boolean }) {
  const favoriteWorkers = workers.slice(0, 2);
  const pendingReviews = workers.slice(0, 3);

  return (
    <div className="grid gap-6">
      {readOnly ? (
        <Card variant="muted">
          <CardContent>
            <Badge variant="info">Modo preview admin</Badge>
            <p className="mt-2 text-sm leading-6 text-muted">Visualizacao somente leitura do painel do cliente.</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orcamentos ativos" value="3" detail="Pedidos aguardando resposta ou decisao." icon={<MessageSquareText size={22} />} />
        <StatCard label="Favoritos" value="6" detail="Profissionais salvos para contato rapido." icon={<Heart size={22} />} />
        <StatCard label="Avaliacoes" value="4" detail="Feedbacks publicados apos servicos." icon={<Star size={22} />} />
        <StatCard label="Preferencias" value="8" detail="Categorias e regioes salvas." icon={<MapPin size={22} />} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Resumo dos orcamentos</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted">Acompanhe pedidos recentes, status e proximos retornos esperados.</p>
              </div>
              <LinkButton href={routes.clientQuotes} variant="outline">
                Ver historico
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent>
            <QuoteTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atalhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Shortcut href={routes.search} icon={<Search size={18} />} title="Encontrar profissional" text="Busque por categoria, cidade, bairro e disponibilidade." />
              <Shortcut href={routes.clientFavorites} icon={<Heart size={18} />} title="Favoritos" text="Compare profissionais salvos antes de pedir orcamento." />
              <Shortcut href={routes.clientProfile} icon={<UserRound size={18} />} title="Perfil e contato" text="Mantenha WhatsApp, e-mail e local preferido atualizados." />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Favoritos recomendados</CardTitle>
              <LinkButton href={routes.clientFavorites} variant="outline">
                Ver todos
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 xl:grid-cols-2">
              {favoriteWorkers.map((worker) => (
                <WorkerCard key={worker.slug} worker={worker} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificacoes recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Notice title="Orcamento respondido" text={`${quotes[1]?.worker ?? "Profissional"} enviou retorno para seu pedido.`} />
              <Notice title="Avalie um atendimento" text="Sua avaliacao ajuda outros clientes a escolherem com mais seguranca." />
              <Notice title="Favorito disponivel" text="Um profissional salvo esta com agenda aberta esta semana." />
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="avaliacoes">
        <Card>
          <CardHeader>
            <CardTitle>Avaliacoes pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingReviews.map((worker) => (
                <div key={worker.slug} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-foreground">{worker.name}</p>
                    <p className="mt-1 text-sm text-muted">Conte como foi o atendimento para ajudar outros clientes.</p>
                  </div>
                  <LinkButton href={`${routes.workerProfile(worker.slug)}#avaliar`} variant="outline">
                    <Star className="mr-2" size={17} />
                    Avaliar
                  </LinkButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Preferencias salvas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <Badge key={category.slug} variant="primary">{category.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Shortcut({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <LinkButton href={href} variant="ghost" className="h-auto justify-start p-0 text-left">
      <span className="grid w-full grid-cols-[40px_1fr] gap-3 rounded-[8px] border border-border bg-surface p-3">
        <span className="flex size-10 items-center justify-center rounded-[8px] bg-primary-soft text-primary">{icon}</span>
        <span>
          <span className="block font-black text-foreground">{title}</span>
          <span className="mt-1 block text-sm font-normal leading-6 text-muted">{text}</span>
        </span>
      </span>
    </LinkButton>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
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
