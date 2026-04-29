import { ArrowRight, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { routes } from "@/config/routes";
import { CategoryCard, getCategoriesWithContent } from "@/features/categories";

export default function CategoriesPage() {
  const categories = getCategoriesWithContent();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[#202522] py-14 text-white sm:py-18">
          <div className="container-page">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Categorias</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Encontre o tipo certo de profissional para cada serviço.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#eee7d9]">
              Explore categorias organizadas por especialidade, entenda os serviços mais comuns e encontre profissionais perto de você.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={routes.search} variant="secondary">
                <Search className="mr-2" size={18} />
                Buscar profissionais
              </LinkButton>
              <LinkButton href={routes.registerWorker} variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/14">
                Cadastrar serviço
                <ArrowRight className="ml-2" size={18} />
              </LinkButton>
            </div>
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              eyebrow="Explore"
              title="Categorias de serviços"
              description="Cada categoria tem profissionais relacionados, exemplos de serviços e entradas rápidas para busca filtrada."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
