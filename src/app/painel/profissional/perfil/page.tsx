import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerProfileSettingsPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerProfileSettingsPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Perfil publico"
      description="Atualize os dados que aparecem para clientes na busca e na pagina publica do profissional."
      nav={[...workerNavigation]}
    >
      <WorkerProfileSettingsPanel worker={worker} />
    </DashboardShell>
  );
}
