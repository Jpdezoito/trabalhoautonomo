import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerAvailabilityPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerAvailabilityPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Disponibilidade"
      description="Controle agenda, tempo medio de resposta e observações exibidas para clientes antes do contato."
      nav={[...workerNavigation]}
    >
      <WorkerAvailabilityPanel worker={worker} />
    </DashboardShell>
  );
}
