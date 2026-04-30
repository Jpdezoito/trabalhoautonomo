import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminOverview } from "@/features/admin";

export default function AdminPage() {
  return (
    <DashboardShell
      title="Administração"
      description="Controle operacional da plataforma, moderação, verificacoes, usuários, categorias, orçamentos e configurações."
      nav={[...adminNavigation]}
    >
      <AdminOverview />
    </DashboardShell>
  );
}
