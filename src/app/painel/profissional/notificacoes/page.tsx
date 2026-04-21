import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerNotificationsPanel } from "@/features/workers/dashboard";
import { workers } from "@/lib/marketplace-data";

export default function WorkerNotificationsPage() {
  const worker = workers[0];

  return (
    <DashboardShell
      title="Notificacoes"
      description="Veja alertas operacionais sobre pedidos, perfil, portfolio, verificacao e oportunidades."
      nav={[...workerNavigation]}
    >
      <WorkerNotificationsPanel worker={worker} />
    </DashboardShell>
  );
}
