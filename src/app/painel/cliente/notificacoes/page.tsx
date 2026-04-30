import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientNotificationsPanel } from "@/features/clients/dashboard";

export default function ClientNotificationsPage() {
  return (
    <DashboardShell
      title="Notificações"
      description="Acompanhe respostas de orçamento, lembretes de avaliação, favoritos e atualizações da plataforma."
      nav={[...clientNavigation]}
    >
      <ClientNotificationsPanel />
    </DashboardShell>
  );
}
