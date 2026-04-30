import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerDashboardOverview } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerDashboardPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Painel profissional"
      description="Gerencie seu perfil público, agenda, serviços, portfólio, orçamentos, avaliações e notificações."
      nav={[...workerNavigation]}
    >
      <WorkerDashboardOverview worker={worker} />
    </DashboardShell>
  );
}
