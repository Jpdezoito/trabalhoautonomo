import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminCategoriesGrid } from "@/features/admin";

export default function AdminCategoriesPage() {
  return (
    <DashboardShell
      title="Categorias"
      description="Gerencie grupos, categorias, subcategorias, descricoes, status e exibicao no marketplace."
      nav={[...adminNavigation]}
    >
      <AdminCategoriesGrid />
    </DashboardShell>
  );
}
