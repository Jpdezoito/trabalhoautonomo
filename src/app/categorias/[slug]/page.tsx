import { notFound } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { routes } from "@/config/routes";
import { CategoryHero, CategoryWorkers, ServiceExplorer, getCategoriesWithContent, getCategoryWithContent } from "@/features/categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCategoriesWithContent().map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryWithContent(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <CategoryHero category={category} />

        <section className="container-page py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {category.content.highlights.map((highlight) => (
              <Card key={highlight}>
                <CardContent>
                  <p className="text-sm font-bold text-muted">Destaque</p>
                  <p className="mt-2 text-xl font-black text-foreground">{highlight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Servicos"
              title={`O que contratar em ${category.content.title}`}
              description="Veja exemplos de demandas comuns e quando faz sentido chamar um profissional desta categoria."
            />
            <ServiceExplorer category={category} />
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              eyebrow="Profissionais"
              title={`Profissionais de ${category.content.title}`}
              description="Compare perfis, avaliacoes, portfolio, preco inicial e disponibilidade antes de pedir orcamento."
              action={
                <LinkButton href={`${routes.search}?categoria=${category.slug}`} variant="outline">
                  <Filter className="mr-2" size={18} />
                  Filtrar resultados
                </LinkButton>
              }
            />
            <CategoryWorkers category={category} />
          </div>
        </section>

        <section className="pb-16">
          <div className="container-page">
            <div className="rounded-[8px] border border-border bg-[#202522] p-6 text-white shadow-[var(--shadow-lg)] sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Quer comparar mais opcoes?</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-[#eee7d9]">
                    Use a busca com filtros por cidade, bairro, avaliacao, disponibilidade e verificacao para encontrar o melhor profissional.
                  </p>
                </div>
                <LinkButton href={`${routes.search}?categoria=${category.slug}`} variant="secondary">
                  <Search className="mr-2" size={18} />
                  Buscar nesta categoria
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
