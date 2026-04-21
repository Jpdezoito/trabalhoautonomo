import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, Input, Label, Select } from "@/components/ui/form";
import { searchFilterOptions } from "@/features/search/search-config";
import type { SearchFilters } from "@/features/search/types";

type FilterPanelProps = {
  filters: SearchFilters;
};

export function FilterPanel({ filters }: FilterPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal size={19} />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action="/buscar" className="grid gap-5">
          <Field>
            <Label>Buscar por palavra-chave</Label>
            <Input name="q" defaultValue={filters.keyword} placeholder="Ex.: eletricista, vazamento, pintura" />
          </Field>

          <Field>
            <Label>Categoria</Label>
            <Select name="categoria" defaultValue={filters.category ?? filters.service ?? ""}>
              <option value="">Todas as categorias</option>
              {searchFilterOptions.categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <FieldGroup className="sm:grid-cols-1">
            <Field>
              <Label>Cidade</Label>
              <Select name="cidade" defaultValue={filters.city ?? ""}>
                <option value="">Todas as cidades</option>
                {searchFilterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Bairro</Label>
              <Select name="bairro" defaultValue={filters.neighborhood ?? ""}>
                <option value="">Todos os bairros</option>
                {searchFilterOptions.neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>

          <Field>
            <Label>Avaliacao minima</Label>
            <Select name="nota" defaultValue={filters.minimumRating?.toString() ?? ""}>
              {searchFilterOptions.ratings.map((rating) => (
                <option key={rating.label} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Faixa de preco inicial</Label>
            <Select name="preco" defaultValue={getPriceDefaultValue(filters)}>
              {searchFilterOptions.prices.map((price) => (
                <option key={price.label} value={`${price.min}-${price.max}`}>
                  {price.label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-3 rounded-[8px] bg-surface-muted p-4">
            <label className="flex items-center gap-3 text-sm font-bold text-muted-strong">
              <input name="verificado" value="true" type="checkbox" defaultChecked={filters.verifiedOnly} />
              Somente profissionais verificados
            </label>
            <label className="flex items-center gap-3 text-sm font-bold text-muted-strong">
              <input name="disponivel" value="true" type="checkbox" defaultChecked={filters.availableOnly} />
              Disponiveis para novos pedidos
            </label>
            <label className="flex items-center gap-3 text-sm font-bold text-muted-strong">
              <input name="portfolio" value="true" type="checkbox" defaultChecked={filters.withPortfolio} />
              Com portfolio publicado
            </label>
          </div>

          <input type="hidden" name="ordenar" value={filters.sortBy ?? "relevance"} />

          <Button type="submit" className="w-full">
            <Search className="mr-2" size={18} />
            Aplicar filtros
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function getPriceDefaultValue(filters: SearchFilters) {
  const min = filters.minPrice?.toString() ?? "";
  const max = filters.maxPrice?.toString() ?? "";

  return `${min}-${max}`;
}
