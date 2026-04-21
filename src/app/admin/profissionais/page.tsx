import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminWorkersTable } from "@/features/admin";

export default function AdminWorkersPage() {
  return (
    <DashboardShell
      title="Profissionais"
      description="Revise perfis, documentos, portfolio, disponibilidade, status de verificacao e pendencias administrativas."
      nav={[...adminNavigation]}
    >
      <AdminWorkersTable />
    </DashboardShell>
  );
}
