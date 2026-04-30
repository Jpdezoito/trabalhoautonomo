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
        <div className="rounded-[8px] border border-border bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf7_100%)] shadow-[var(--shadow-sm)] lg:max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
          <div className="shrink-0 border-b border-border px-5 py-4 sm:px-6 bg-background z-10">
            <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              Filtros
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 pr-3 scrollbar-thin scrollbar-thumb-[#e2e8f0] scrollbar-track-transparent">
            <FilterPanel filters={filters} />
          </div>
        </div>
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
              Tente remover alguns filtros, buscar por outra categoria ou ampliar a região de atendimento.
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
