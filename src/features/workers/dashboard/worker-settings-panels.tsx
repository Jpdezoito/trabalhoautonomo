import { Bell, CalendarClock, Eye, MapPin, ShieldCheck, Star, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/form";
import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";
import { formatRating } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function WorkerProfileSettingsPanel({ worker }: { worker: Worker }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Dados publicos</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <FieldGroup>
              <Field>
                <Label>Nome publico</Label>
                <Input defaultValue={worker.name} />
              </Field>
              <Field>
                <Label>Titulo profissional</Label>
                <Input defaultValue={worker.role} />
              </Field>
            </FieldGroup>
            <Field>
              <Label>Chamada curta</Label>
              <Input defaultValue={worker.headline} />
            </Field>
            <Field>
              <Label>Descricao completa</Label>
              <Textarea defaultValue={worker.bio} className="min-h-40" />
            </Field>
            <FieldGroup>
              <Field>
                <Label>Cidade base</Label>
                <Select defaultValue={worker.city}>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Bairro base</Label>
                <Select defaultValue={worker.neighborhood}>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood}>{neighborhood}</option>
                  ))}
                </Select>
              </Field>
            </FieldGroup>
            <Button type="button">Salvar alteracoes</Button>
          </form>
        </CardContent>
      </Card>
      <ProfileAside worker={worker} />
    </div>
  );
}

export function WorkerServicesPanel({ worker }: { worker: Worker }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Servicos e precos</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <FieldGroup>
              <Field>
                <Label>Categoria principal</Label>
                <Select defaultValue={worker.categories[0]}>
                  {publicCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Preco inicial</Label>
                <Input defaultValue={worker.startingPrice} />
              </Field>
            </FieldGroup>
            <Field>
              <Label>Servicos oferecidos</Label>
              <Textarea defaultValue={worker.services.join("\n")} className="min-h-36" />
            </Field>
            <Field>
              <Label>Areas atendidas</Label>
              <Textarea defaultValue={worker.areas.join("\n")} />
            </Field>
            <Button type="button">Atualizar servicos</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Especialidades atuais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {worker.services.map((service) => (
              <Badge key={service} variant="primary">{service}</Badge>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <MetricLine icon={<WalletCards size={18} />} label="Preco inicial" value={worker.startingPrice} />
            <MetricLine icon={<MapPin size={18} />} label="Cobertura" value={`${worker.areas.length} bairros cadastrados`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WorkerAvailabilityPanel({ worker }: { worker: Worker }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Agenda e atendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <FieldGroup>
              <Field>
                <Label>Status da agenda</Label>
                <Select defaultValue={worker.available ? "open" : "paused"}>
                  <option value="open">Aberta para novos pedidos</option>
                  <option value="paused">Pausada temporariamente</option>
                </Select>
              </Field>
              <Field>
                <Label>Tempo medio de resposta</Label>
                <Input defaultValue={worker.responseTime} />
              </Field>
            </FieldGroup>
            <Field>
              <Label>Disponibilidade semanal</Label>
              <Textarea defaultValue="Segunda a sexta, das 8h as 18h. Sabados sob agendamento." />
            </Field>
            <Field>
              <Label>Observacoes para clientes</Label>
              <Textarea defaultValue="Informe fotos, medidas e urgencia para facilitar o orcamento." />
            </Field>
            <Button type="button">Salvar disponibilidade</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumo da agenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <MetricLine icon={<CalendarClock size={18} />} label="Status" value={worker.available ? "Recebendo pedidos" : "Agenda pausada"} />
            <MetricLine icon={<Bell size={18} />} label="Alertas" value="Notificar novos orcamentos" />
            <MetricLine icon={<Eye size={18} />} label="Visibilidade" value="Perfil publico ativo" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WorkerReviewsPanel({ worker }: { worker: Worker }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card>
        <CardContent>
          <p className="text-sm font-bold text-muted">Nota media</p>
          <p className="mt-2 text-5xl font-black text-foreground">{formatRating(worker.rating)}</p>
          <p className="mt-2 text-sm text-muted">{worker.reviewsCount} avaliacoes publicas</p>
          <div className="mt-5 rounded-[8px] bg-warning-soft p-4 text-warning">
            <Star className="fill-current" size={22} />
            <p className="mt-2 text-sm font-bold">Responder rapido e manter portfolio atualizado ajuda a melhorar a confianca.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Avaliacoes recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {worker.reviews.map((review) => (
              <article key={`${review.author}-${review.title}`} className="rounded-[8px] border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-foreground">{review.title}</h3>
                    <p className="mt-1 text-sm text-muted">{review.author} - {review.date}</p>
                  </div>
                  <Badge variant="warning"><Star className="fill-current" size={14} /> {review.rating}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{review.comment}</p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WorkerNotificationsPanel({ worker }: { worker: Worker }) {
  const notifications = [
    ["Novo orcamento", "Um cliente pediu retorno para servico na sua regiao."],
    ["Perfil publico", `${worker.name}, seu perfil recebeu novas visualizacoes esta semana.`],
    ["Portfolio", "Fotos com descricao clara aumentam a chance de contato."],
    [
      "Verificacao de identidade",
      worker.verified ? "Sua conta verificada esta ativa na plataforma." : "Envie nova verificacao para analise de identidade.",
    ],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Central de notificacoes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {notifications.map(([title, text]) => (
            <div key={title} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
              <Badge variant="info">Nao lida</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkerAccountSettingsPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Field>
              <Label>E-mail de acesso</Label>
              <Input defaultValue="profissional@email.com" type="email" />
            </Field>
            <Field>
              <Label>Telefone principal</Label>
              <Input defaultValue="(11) 99999-1001" />
            </Field>
            <Button type="button">Salvar conta</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Seguranca e privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
          <MetricLine icon={<ShieldCheck size={18} />} label="Senha" value="Atualizada recentemente" />
          <MetricLine icon={<Eye size={18} />} label="Perfil" value="Visivel na busca publica" />
          <MetricLine icon={<Bell size={18} />} label="Notificacoes" value="E-mail e plataforma ativos" />
          <MetricLine icon={<ShieldCheck size={18} />} label="Status da verificacao" value="Verificacao de identidade disponivel" />
        </div>
      </CardContent>
      </Card>
    </div>
  );
}

function ProfileAside({ worker }: { worker: Worker }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo publico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <MetricLine icon={<Eye size={18} />} label="Status" value="Publicado" />
          <MetricLine icon={<Star size={18} />} label="Avaliacao" value={`${formatRating(worker.rating)} de 5`} />
          <MetricLine
            icon={<ShieldCheck size={18} />}
            label="Status da verificacao"
            value={worker.verified ? "Aprovado" : "Em analise"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[8px] bg-surface-muted p-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
        <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
      </div>
    </div>
  );
}
