import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientDashboardOverview } from "@/features/clients/dashboard";

export default function ClientDashboardPage() {
  return (
    <DashboardShell
      title="Painel do cliente"
      description="Acompanhe pedidos de orcamento, profissionais favoritos, preferencias, notificacoes e avaliacoes publicadas."
      nav={[...clientNavigation]}
    >
      <ClientDashboardOverview />
    </DashboardShell>
  );
}
