import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientProfilePanel } from "@/features/clients/dashboard";

export default function ClientProfilePage() {
  return (
    <DashboardShell
      title="Perfil do cliente"
      description="Atualize seus dados de contato, local preferido e observacoes para facilitar o retorno dos profissionais."
      nav={[...clientNavigation]}
    >
      <ClientProfilePanel />
    </DashboardShell>
  );
}
