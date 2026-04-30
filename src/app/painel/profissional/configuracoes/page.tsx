import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerSettingsPanel } from "@/features/settings";

export default function WorkerSettingsPage() {
  return (
    <DashboardShell
      title="Configurações"
      description="Ajuste dados da conta, contato, segurança, privacidade e preferências de notificacao."
      nav={[...workerNavigation]}
    >
      <WorkerSettingsPanel />
    </DashboardShell>
  );
}
