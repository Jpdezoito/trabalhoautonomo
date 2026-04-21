import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminPlatformSettingsPanel } from "@/features/settings";

export default function AdminSettingsPage() {
  return (
    <DashboardShell title="Configuracoes" description="Ajuste regras de publicacao, verificacao, contato, moderacao e operacao do marketplace." nav={[...adminNavigation]}>
      <AdminPlatformSettingsPanel />
    </DashboardShell>
  );
}
