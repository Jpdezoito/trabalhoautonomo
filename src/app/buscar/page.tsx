import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchResultsView } from "@/features/search/search-results-view";
import { filterWorkers, searchFiltersSchema } from "@/features/search";
import { workers } from "@/lib/marketplace-data";
import type { SearchFilters } from "@/features/search/types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    servico?: string;
    categoria?: string;
    cidade?: string;
    bairro?: string;
    nota?: string;
    preco?: string;
    verificado?: string;
    disponivel?: string;
    portfolio?: string;
    ordenar?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseSearchParams(params);
  const results = filterWorkers(workers, filters);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-8 sm:py-10">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Busca</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Encontre profissionais por serviço, local e perfil.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            Filtre por categoria, cidade, bairro, nota, preço inicial, disponibilidade e verificação para comparar opções com mais clareza.
          </p>
        </div>
        <SearchResultsView filters={filters} results={results} />
      </main>
      <SiteFooter />
    </div>
  );
}

function parseSearchParams(params: Awaited<SearchPageProps["searchParams"]>): SearchFilters {
  const price = parsePriceRange(params.preco);
  const parsed = searchFiltersSchema.safeParse({
    keyword: params.q,
    service: params.servico,
    category: params.categoria,
    city: params.cidade,
    neighborhood: params.bairro,
    minimumRating: params.nota || undefined,
    minPrice: price.min,
    maxPrice: price.max,
    verifiedOnly: params.verificado === "true" ? "true" : undefined,
    availableOnly: params.disponivel === "true" ? "true" : undefined,
    withPortfolio: params.portfolio === "true" ? "true" : undefined,
    sortBy: params.ordenar || "relevance",
  });

  if (!parsed.success) {
    return {
      sortBy: "relevance",
    };
  }

  return removeEmptyFilters(parsed.data);
}

function parsePriceRange(value?: string) {
  if (!value) {
    return {};
  }

  const [min, max] = value.split("-");

  return {
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
  };
}

function removeEmptyFilters(filters: SearchFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined && !Number.isNaN(value)),
  ) as SearchFilters;
}
