import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { cities, neighborhoods, publicCategories } from "@/lib/marketplace-data";

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/buscar" className="grid min-w-0 gap-3 rounded-[8px] border border-border bg-surface p-4 shadow-[var(--shadow-lg)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <label className="grid min-w-0 gap-2 text-sm font-bold text-muted-strong">
        Tipo de servico
        <Select name="servico" className="h-12">
          <option value="">Todos os servicos</option>
          {publicCategories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-bold text-muted-strong">
        Cidade
        <Select name="cidade" className="h-12">
          <option value="">Todas as cidades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-bold text-muted-strong">
        Bairro
        <Select name="bairro" className="h-12">
          <option value="">Todos os bairros</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </Select>
      </label>
      <Button className={compact ? "self-end" : "self-end h-12"} type="submit">
        <Search className="mr-2" size={18} />
        Buscar
      </Button>
    </form>
  );
}
