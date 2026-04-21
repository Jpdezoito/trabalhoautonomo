import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerSettingsPanel } from "@/features/settings";

export default function WorkerSettingsPage() {
  return (
    <DashboardShell
      title="Configuracoes"
      description="Ajuste dados da conta, contato, seguranca, privacidade e preferencias de notificacao."
      nav={[...workerNavigation]}
    >
      <WorkerSettingsPanel />
    </DashboardShell>
  );
}
