import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerServicesPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerServicesPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Serviços"
      description="Gerencie categorias, especialidades, preço inicial e áreas atendidas pelo seu perfil."
      nav={[...workerNavigation]}
    >
      <WorkerServicesPanel worker={worker} />
    </DashboardShell>
  );
}
