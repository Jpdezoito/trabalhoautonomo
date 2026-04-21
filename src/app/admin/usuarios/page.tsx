import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminUsersTable } from "@/features/admin";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="Usuarios"
      description="Visualize clientes, profissionais e administradores com status de conta e nivel de acesso."
      nav={[...adminNavigation]}
    >
      <AdminUsersTable />
    </DashboardShell>
  );
}
