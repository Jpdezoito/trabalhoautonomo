import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerReviewsPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerReviewsPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Avaliações"
      description="Acompanhe notas, comentarios recentes e pontos que influenciam a confiança no perfil."
      nav={[...workerNavigation]}
    >
      <WorkerReviewsPanel worker={worker} />
    </DashboardShell>
  );
}
