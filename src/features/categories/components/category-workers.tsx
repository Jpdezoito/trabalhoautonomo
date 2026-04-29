import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { WorkerCard } from "@/components/marketplace/worker-card";
import { routes } from "@/config/routes";
import type { CategoryWithContent } from "@/features/categories/types";

export function CategoryWorkers({ category }: { category: CategoryWithContent }) {
  if (!category.workers.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-border-strong bg-surface p-8 text-center">
        <SearchX className="mx-auto text-muted" size={34} />
        <h2 className="mt-4 text-2xl font-black text-foreground">Nenhum profissional cadastrado nesta categoria ainda</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          Você pode buscar categorias relacionadas ou ampliar os filtros por cidade e bairro.
        </p>
        <LinkButton href={routes.search} variant="outline" className="mt-6">
          Buscar todos os profissionais
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {category.workers.map((worker) => (
        <WorkerCard key={worker.slug} worker={worker} />
      ))}
    </div>
  );
}
