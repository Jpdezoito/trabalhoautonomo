import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerServicesPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerServicesPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Servicos"
      description="Gerencie categorias, especialidades, preco inicial e areas atendidas pelo seu perfil."
      nav={[...workerNavigation]}
    >
      <WorkerServicesPanel worker={worker} />
    </DashboardShell>
  );
}
