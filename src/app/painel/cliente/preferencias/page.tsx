import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientPreferencesPanel } from "@/features/clients/dashboard";

export default function ClientPreferencesPage() {
  return (
    <DashboardShell
      title="Preferências"
      description="Gerencie categorias favoritas, serviços de interesse, filtros salvos e regiões preferidas."
      nav={[...clientNavigation]}
    >
      <ClientPreferencesPanel />
    </DashboardShell>
  );
}
