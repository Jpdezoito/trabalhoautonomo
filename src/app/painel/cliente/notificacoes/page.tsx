import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientNotificationsPanel } from "@/features/clients/dashboard";

export default function ClientNotificationsPage() {
  return (
    <DashboardShell
      title="Notificacoes"
      description="Acompanhe respostas de orcamento, lembretes de avaliacao, favoritos e atualizacoes da plataforma."
      nav={[...clientNavigation]}
    >
      <ClientNotificationsPanel />
    </DashboardShell>
  );
}
