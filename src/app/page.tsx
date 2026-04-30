import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CategoryGrid } from "@/components/marketplace/category-grid";
import { SearchPanel } from "@/components/marketplace/search-panel";
import { WorkerCard } from "@/components/marketplace/worker-card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/config/routes";
import { workers } from "@/lib/marketplace-data";

const heroStats = [
  { value: "1.200+", label: "profissionais ativos" },
  { value: "8.400+", label: "orçamentos enviados" },
  { value: "4,8/5", label: "média de avaliação" },
];

const howItWorks = [
  {
    title: "Busque por serviço e bairro",
    text: "Filtre por categoria, cidade e região para encontrar profissionais perto de você.",
    icon: Search,
  },
  {
    title: "Compare perfis completos",
    text: "Veja portfólio, avaliações, disponibilidade, especialidades e verificação.",
    icon: BadgeCheck,
  },
  {
    title: "Solicite orçamento",
    text: "Envie os detalhes do serviço e fale pelo canal mais conveniente, incluindo WhatsApp.",
    icon: MessageCircle,
  },
  {
    title: "Avalie a experiência",
    text: "Depois do atendimento, publique uma avaliação para fortalecer a comunidade.",
    icon: Star,
  },
];

const trustItems = [
  "Perfis com status de aprovação e verificação",
  "Avaliações moderadas antes da públicação",
  "Histórico de orçamentos e contatos organizado",
  "Categorias, serviços e regiões estruturados",
  "Administração com logs, moderação e configurações",
];

const testimonials = [
  {
    author: "Mariana Almeida",
    role: "Cliente em São Paulo",
    text: "Encontrei um eletricista no meu bairro, comparei avaliações e recebi o orçamento no mesmo dia.",
    rating: 5,
  },
  {
    author: "Paulo Cesar",
    role: "Cliente em Pinheiros",
    text: "O portfólio ajudou muito na escolha. A reforma foi planejada com prazo, custo e contato claro.",
    rating: 5,
  },
  {
    author: "Carlos Mendes",
    role: "Profissional verificado",
    text: "Meu perfil passou mais confiança e os pedidos chegam com informações melhores para responder rápido.",
    rating: 5,
  },
];

const professionalPlans = [
  {
    name: "Free",
    price: "R$ 0",
    description: "Para entrar na plataforma, criar perfil e receber pedidos organicos.",
    features: ["Perfil público", "Portfólio básico", "Orçamentos pela plataforma", "Selo de verificação quando aprovado"],
    cta: "Comecar gratis",
    href: routes.registerWorker,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 29/mes",
    description: "Para profissionais que querem mais visibilidade e mais controle comercial.",
    features: ["Prioridade sobre perfis Free", "Mais destaque nos cards", "Leads de WhatsApp rastreados", "Badge Plano Pro"],
    cta: "Virar Pro",
    href: routes.registerWorker,
    highlighted: true,
  },
  {
    name: "Destaque",
    price: "R$ 59/mes",
    description: "Para aparecer no topo do bairro/cidade e acelerar captacao local.",
    features: ["Topo por relevância local", "Badge Destaque no bairro", "Mais exposição em /buscar", "Ideal para dominar uma região"],
    cta: "Quero destaque",
    href: routes.registerWorker,
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[#202522] text-white">
          <Image
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2200&q=85"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-32"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#202522] via-[#202522]/88 to-[#202522]/42" />
          <div className="relative container-page grid gap-10 pb-14 pt-24 sm:pb-16 sm:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center lg:pb-20 lg:pt-28">
            <div className="max-w-4xl">
              <Badge variant="warning" className="bg-white/12 text-accent ring-white/20 backdrop-blur">
                Marketplace premium para serviços locais
              </Badge>
              <h1 className="mt-6 text-balance text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl">
                Encontre profissionais confiaveis para resolver serviços com rapidez.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#eee7d9]">
                Busque autônomos por serviço, cidade e bairro. Compare perfis, veja portfólios, solicite orçamentos e fale direto com profissionais avaliados.
              </p>
              <div className="mt-8 max-w-5xl">
                <SearchPanel />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[8px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_100%)] p-4 backdrop-blur">
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold text-[#d8d0c2]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:justify-items-end lg:pl-8">
              <Card variant="elevated" className="w-full max-w-[560px] overflow-hidden border-white/20 bg-white/96 shadow-[var(--shadow-lg)]">
                <div className="relative h-44 sm:h-52">
                  <Image src={workers[1].coverImage} alt="" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
                </div>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex min-w-0 items-center gap-4">
                    <Image src={workers[1].image} alt={workers[1].name} width={78} height={78} className="size-[78px] shrink-0 rounded-[8px] border border-border object-cover shadow-[var(--shadow-md)]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black leading-tight text-foreground">{workers[1].name}</h2>
                        <BadgeCheck className="shrink-0 text-primary" size={18} />
                      </div>
                      <p className="text-sm font-semibold leading-5 text-muted">{workers[1].role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{workers[1].headline}</p>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <Metric value="4,8" label="nota" />
                    <Metric value="148" label="serviços" />
                    <Metric value="Hoje" label="resposta" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container-page py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Profissionais ativos" value="1.200+" detail="Base organizada por categoria, bairro e disponibilidade." icon={<Users size={22} />} />
            <StatCard label="Perfis moderados" value="98%" detail="Fluxo de verificação, documentos e revisão administrativa." icon={<ShieldCheck size={22} />} />
            <StatCard label="Orçamentos gerados" value="8.400+" detail="Pedidos rastreados entre cliente e profissional." icon={<ClipboardCheck size={22} />} />
          </div>
        </section>

        <section className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Categorias"
              title="Serviços mais procurados"
              description="Escolha a especialidade certa para cada tipo de reparo, reforma, instalacao ou atendimento técnico."
              action={
                <LinkButton href={routes.search} variant="outline">
                  Ver todos <ArrowRight className="ml-2" size={18} />
                </LinkButton>
              }
            />
            <CategoryGrid />
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              eyebrow="Destaques"
              title="Profissionais prontos para atender"
              description="Perfis com portfólio, avaliações, serviços cadastrados e opções diretas de contato."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {workers.map((worker) => (
                <WorkerCard key={worker.slug} worker={worker} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Como funciona"
              title="Do problema resolvido ao serviço avaliado"
              description="Um fluxo simples para contratar com mais informacao, controle e segurança."
              align="center"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Card key={step.title} className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex size-11 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                        <Icon size={22} />
                      </span>
                      <span className="text-sm font-black text-muted">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-black text-foreground">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{step.text}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-y bg-[#202522] text-white">
          <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="warning" className="bg-white/10 text-accent ring-white/20">
                Confiança operacional
              </Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Uma plataforma preparada para crescer com moderação e qualidade.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#d8d0c2]">
                A experiência pública e conectada a uma estrutura de administração com verificação de perfis, revisão de avaliações, status de orçamentos, notificações e configurações.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={routes.search} variant="secondary">
                  Encontrar profissional
                </LinkButton>
                <LinkButton href={routes.registerWorker} variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/14">
                  Cadastrar serviço
                </LinkButton>
              </div>
            </div>
            <div className="grid gap-3">
              {trustItems.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[8px] border border-white/12 bg-white/8 p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={20} />
                  <p className="font-semibold leading-6 text-[#f2eadc]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              eyebrow="Depoimentos"
              title="Quem usa entende a diferenca"
              description="Clientes e profissionais ganham clareza antes, durante e depois do atendimento."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.author} className="p-6">
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={index} size={17} className="fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 leading-7 text-muted">&quot;{testimonial.text}&quot;</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-black text-foreground">{testimonial.author}</p>
                    <p className="text-sm font-semibold text-muted">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Planos para profissionais"
              title="Comece gratis e cresca por bairro"
              description="O plano do profissional define visibilidade no marketplace. Perfis Destaque aparecem antes em buscas locais relevantes."
              align="center"
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {professionalPlans.map((plan) => (
                <Card key={plan.name} variant={plan.highlighted ? "elevated" : "default"} className={plan.highlighted ? "border-primary shadow-[var(--shadow-lg)]" : undefined}>
                  <CardContent className="grid h-full gap-6">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-2xl font-black text-foreground">{plan.name}</h3>
                        {plan.highlighted ? <Badge variant="success">Mais indicado</Badge> : null}
                      </div>
                      <p className="mt-4 text-4xl font-black tracking-tight text-foreground">{plan.price}</p>
                      <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
                    </div>
                    <div className="grid gap-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                          <p className="text-sm font-semibold leading-6 text-muted-strong">{feature}</p>
                        </div>
                      ))}
                    </div>
                    <LinkButton href={plan.href} variant={plan.highlighted ? "primary" : "outline"} className="mt-auto w-full">
                      {plan.cta}
                    </LinkButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-page">
            <div className="grid overflow-hidden rounded-[8px] border border-border bg-surface shadow-[var(--shadow-lg)] lg:grid-cols-2">
              <div className="p-6 sm:p-8 lg:p-10">
                <Sparkles className="text-primary" size={28} />
                <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground">
                  Precisa resolver um serviço?
                </h2>
                <p className="mt-3 leading-7 text-muted">
                  Encontre profissionais por especialidade e região, veja provas de trabalho e solicite orçamentos com detalhes.
                </p>
                <LinkButton href={routes.search} className="mt-6">
                  Buscar profissionais <ArrowRight className="ml-2" size={18} />
                </LinkButton>
              </div>
              <div className="border-t border-border bg-primary-soft p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <HeartHandshake className="text-primary" size={30} />
                <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground">
                  Trabalha com serviços locais?
                </h2>
                <p className="mt-3 leading-7 text-muted">
                  Crie um perfil profissional com portfólio, áreas atendidas, verificação e canal direto para receber pedidos melhores.
                </p>
                <LinkButton href={routes.registerWorker} variant="secondary" className="mt-6">
                  Cadastrar como profissional <ArrowRight className="ml-2" size={18} />
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[8px] bg-surface-muted p-3">
      <p className="font-black text-foreground">{value}</p>
      <p className="text-xs font-bold text-muted">{label}</p>
    </div>
  );
}
