import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminPlatformSettingsPanel } from "@/features/settings";

export default function AdminSettingsPage() {
  return (
    <DashboardShell title="Configurações" description="Ajuste regras de públicação, verificação, contato, moderação e operação do marketplace." nav={[...adminNavigation]}>
      <AdminPlatformSettingsPanel />
    </DashboardShell>
  );
}
