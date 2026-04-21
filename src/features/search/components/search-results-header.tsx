import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { searchFilterOptions } from "@/features/search/search-config";
import type { SearchFilters } from "@/features/search/types";

type SearchResultsHeaderProps = {
  filters: SearchFilters;
  total: number;
};

export function SearchResultsHeader({ filters, total }: SearchResultsHeaderProps) {
  return (
    <Card className="mb-5 p-4 sm:p-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{total} profissional{total === 1 ? "" : "is"} encontrado{total === 1 ? "" : "s"}</Badge>
            {filters.verifiedOnly ? <Badge variant="success">Verificados</Badge> : null}
            {filters.availableOnly ? <Badge variant="info">Disponiveis</Badge> : null}
            {filters.minimumRating ? <Badge variant="warning">Nota {filters.minimumRating}+ </Badge> : null}
          </div>
          <p className="mt-2 text-sm text-muted">
            Resultados com base nos filtros selecionados. Refine a busca para encontrar o profissional ideal.
          </p>
        </div>
        <form action="/buscar" className="grid min-w-0 gap-2 sm:grid-cols-[minmax(220px,280px)_auto] sm:items-end xl:min-w-[390px]">
          {Object.entries(buildHiddenParams(filters)).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <label className="grid min-w-0 gap-2 text-sm font-bold text-muted-strong">
            <span className="inline-flex items-center gap-2">
              <ArrowUpDown className="text-muted" size={16} />
              Ordenar por
            </span>
            <Select name="ordenar" defaultValue={filters.sortBy ?? "relevance"} className="h-11 w-full">
              {searchFilterOptions.sorting.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
          <button className="h-11 rounded-[8px] bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-strong" type="submit">
            Ordenar
          </button>
        </form>
      </div>
    </Card>
  );
}

function buildHiddenParams(filters: SearchFilters) {
  return {
    q: filters.keyword ?? "",
    categoria: filters.category ?? filters.service ?? "",
    cidade: filters.city ?? "",
    bairro: filters.neighborhood ?? "",
    nota: filters.minimumRating?.toString() ?? "",
    preco: `${filters.minPrice?.toString() ?? ""}-${filters.maxPrice?.toString() ?? ""}`,
    verificado: filters.verifiedOnly ? "true" : "",
    disponivel: filters.availableOnly ? "true" : "",
    portfolio: filters.withPortfolio ? "true" : "",
  };
}
