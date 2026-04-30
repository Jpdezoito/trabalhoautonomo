import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientQuotesPanel } from "@/features/clients/dashboard";

export default function ClientQuotesPage() {
  return (
    <DashboardShell
      title="Histórico de orçamentos"
      description="Veja pedidos enviados, status de resposta, profissionais contatados e oportunidades de avaliação."
      nav={[...clientNavigation]}
    >
      <ClientQuotesPanel />
    </DashboardShell>
  );
}
