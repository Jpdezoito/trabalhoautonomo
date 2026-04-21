import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { PortfolioManager } from "@/features/portfolio";
import type { ManagedPortfolioItem } from "@/features/portfolio";
import { workers } from "@/lib/marketplace-data";

export default function WorkerPortfolioPage() {
  const worker = workers[0];
  const initialItems: ManagedPortfolioItem[] = worker.portfolio.map((item, index) => ({
    id: `${worker.slug}-${index}`,
    title: item.title,
    description: item.description,
    imageUrl: item.image,
    city: item.city,
    sortOrder: index,
    isFeatured: index === 0,
  }));

  return (
    <DashboardShell
      title="Portfolio profissional"
      description="Gerencie imagens, titulos, descricoes, ordem e destaque dos trabalhos exibidos no seu perfil publico."
      nav={[...workerNavigation]}
    >
      <PortfolioManager initialItems={initialItems} />
    </DashboardShell>
  );
}
