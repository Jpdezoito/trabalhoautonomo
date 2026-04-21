import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerDashboardOverview } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerDashboardPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Painel profissional"
      description="Gerencie seu perfil publico, agenda, servicos, portfolio, orcamentos, avaliacoes e notificacoes."
      nav={[...workerNavigation]}
    >
      <WorkerDashboardOverview worker={worker} />
    </DashboardShell>
  );
}
