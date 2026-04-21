import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterPanel } from "@/features/search/components/filter-panel";
import { SearchResultCard } from "@/features/search/components/search-result-card";
import { SearchResultsHeader } from "@/features/search/components/search-results-header";
import type { SearchFilters, SearchResultWorker } from "@/features/search/types";

type SearchResultsViewProps = {
  filters: SearchFilters;
  results: SearchResultWorker[];
};

export function SearchResultsView({ filters, results }: SearchResultsViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <FilterPanel filters={filters} />
      </aside>
      <section className="min-w-0">
        <SearchResultsHeader filters={filters} total={results.length} />
        {results.length ? (
          <div className="grid gap-5">
            {results.map((result) => (
              <SearchResultCard key={result.worker.slug} result={result} />
            ))}
          </div>
        ) : (
          <Card className="grid place-items-center p-10 text-center">
            <SearchX className="text-muted" size={38} />
            <h2 className="mt-4 text-2xl font-black text-foreground">Nenhum profissional encontrado</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              Tente remover alguns filtros, buscar por outra categoria ou ampliar a regiao de atendimento.
            </p>
            <LinkButton href="/buscar" variant="outline" className="mt-6">
              Limpar filtros
            </LinkButton>
          </Card>
        )}
      </section>
    </div>
  );
}
