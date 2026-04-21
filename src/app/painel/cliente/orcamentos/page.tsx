import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientQuotesPanel } from "@/features/clients/dashboard";

export default function ClientQuotesPage() {
  return (
    <DashboardShell
      title="Historico de orcamentos"
      description="Veja pedidos enviados, status de resposta, profissionais contatados e oportunidades de avaliacao."
      nav={[...clientNavigation]}
    >
      <ClientQuotesPanel />
    </DashboardShell>
  );
}
