import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientSettingsPanel } from "@/features/settings";

export default function ClientSettingsPage() {
  return (
    <DashboardShell
      title="Configurações"
      description="Gerencie conta, senha, contato, notificações e privacidade do seu perfil de cliente."
      nav={[...clientNavigation]}
    >
      <ClientSettingsPanel />
    </DashboardShell>
  );
}
