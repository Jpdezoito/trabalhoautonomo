import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminClientsTable } from "@/features/admin";

export default function AdminClientsPage() {
  return (
    <DashboardShell
      title="Clientes"
      description="Visualize clientes cadastrados e abra o preview administrativo do painel."
      nav={[...adminNavigation]}
    >
      <AdminClientsTable />
    </DashboardShell>
  );
}
