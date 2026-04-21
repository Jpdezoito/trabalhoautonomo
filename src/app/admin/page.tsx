import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminOverview } from "@/features/admin";

export default function AdminPage() {
  return (
    <DashboardShell
      title="Administracao"
      description="Controle operacional da plataforma, moderacao, verificacoes, usuarios, categorias, orcamentos e configuracoes."
      nav={[...adminNavigation]}
    >
      <AdminOverview />
    </DashboardShell>
  );
}
