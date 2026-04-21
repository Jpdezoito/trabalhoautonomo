import { Bell, Heart, Mail, MapPin, Phone, Search, Star, UserRound } from "lucide-react";
import { QuoteTable } from "@/components/dashboard/quote-table";
import { WorkerCard } from "@/components/marketplace/worker-card";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/form";
import { routes } from "@/config/routes";
import { categories, cities, neighborhoods, workers } from "@/lib/marketplace-data";
import type { Worker } from "@/types/marketplace";

export function ClientFavoritesPanel({ initialWorkers }: { initialWorkers?: Worker[] }) {
  const favoriteWorkers = initialWorkers?.length ? initialWorkers : workers.slice(0, 4);

  return favoriteWorkers.length ? (
    <div className="grid gap-6 xl:grid-cols-2">
      {favoriteWorkers.map((worker) => (
        <WorkerCard key={worker.slug} worker={worker} />
      ))}
    </div>
  ) : (
    <EmptyState />
  );
}

export function ClientQuotesPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Historico de orcamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteTable />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status dos pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <MetricLine icon={<Search size={18} />} label="Abertos" value="1 pedido aguardando resposta" />
            <MetricLine icon={<Mail size={18} />} label="Respondidos" value="1 pedido com retorno" />
            <MetricLine icon={<Star size={18} />} label="Concluidos" value="1 pronto para avaliacao" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClientProfilePanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Perfil e contato</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <FieldGroup>
              <Field>
                <Label>Nome completo</Label>
                <Input defaultValue="Mariana Almeida" />
              </Field>
              <Field>
                <Label>E-mail</Label>
                <Input defaultValue="mariana@email.com" type="email" />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <Label>WhatsApp</Label>
                <Input defaultValue="(11) 99999-2020" />
              </Field>
              <Field>
                <Label>Telefone alternativo</Label>
                <Input defaultValue="(11) 3333-2020" />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <Label>Cidade preferida</Label>
                <Select defaultValue="Sao Paulo">
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Bairro principal</Label>
                <Select defaultValue="Tatuape">
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood}>{neighborhood}</option>
                  ))}
                </Select>
              </Field>
            </FieldGroup>
            <Field>
              <Label>Observacoes para pedidos</Label>
              <Textarea defaultValue="Prefiro contato pelo WhatsApp e orcamentos com estimativa de prazo." />
            </Field>
            <Button type="button">Salvar perfil</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <MetricLine icon={<UserRound size={18} />} label="Tipo de conta" value="Cliente" />
            <MetricLine icon={<Phone size={18} />} label="Contato" value="WhatsApp verificado" />
            <MetricLine icon={<MapPin size={18} />} label="Local preferido" value="Tatuape, Sao Paulo" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClientPreferencesPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de busca</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Field>
              <Label>Categorias favoritas</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.slice(0, 10).map((category, index) => (
                  <label key={category.slug} className="flex items-center gap-3 rounded-[8px] border border-border bg-surface p-3 text-sm font-bold text-muted-strong">
                    <input type="checkbox" defaultChecked={index < 5} />
                    {category.name}
                  </label>
                ))}
              </div>
            </Field>
            <Field>
              <Label>Servicos de interesse</Label>
              <Textarea defaultValue="Reparos eletricos&#10;Montagem de moveis&#10;Frete pequeno&#10;Limpeza pos-obra" />
            </Field>
            <Button type="button">Salvar preferencias</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Filtros salvos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Tatuape</Badge>
            <Badge variant="primary">Verificados</Badge>
            <Badge variant="primary">4,5+ estrelas</Badge>
            <Badge variant="primary">Disponiveis</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClientNotificationsPanel() {
  const notifications = [
    ["Orcamento respondido", "Carlos Mendes respondeu seu pedido de troca de quadro eletrico."],
    ["Profissional salvo", "Fernanda Rocha foi adicionada aos seus favoritos."],
    ["Avaliacao pendente", "Publique sua avaliacao para um atendimento concluido."],
    ["Nova categoria", "Frete e entregas rapidas agora aparecem nas suas buscas salvas."],
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
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 text-primary" size={18} />
                <div>
                  <p className="font-black text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                </div>
              </div>
              <Badge variant="info">Nao lida</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent>
        <div className="mx-auto max-w-xl py-10 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
            <Heart size={26} />
          </span>
          <h2 className="mt-5 text-2xl font-black text-foreground">Nenhum favorito salvo</h2>
          <p className="mt-3 leading-7 text-muted">
            Salve profissionais durante a busca para montar sua lista de comparacao e voltar aos perfis com mais facilidade.
          </p>
          <LinkButton href={routes.search} className="mt-5">
            <Search className="mr-2" size={18} />
            Encontrar profissionais
          </LinkButton>
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
