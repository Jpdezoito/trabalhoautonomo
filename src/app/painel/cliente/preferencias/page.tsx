import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientPreferencesPanel } from "@/features/clients/dashboard";

export default function ClientPreferencesPage() {
  return (
    <DashboardShell
      title="Preferencias"
      description="Gerencie categorias favoritas, servicos de interesse, filtros salvos e regioes preferidas."
      nav={[...clientNavigation]}
    >
      <ClientPreferencesPanel />
    </DashboardShell>
  );
}
