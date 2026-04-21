import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminModerationTable } from "@/features/admin";

export default function AdminModerationPage() {
  return (
    <DashboardShell
      title="Moderacao"
      description="Analise avaliacoes, perfis, portfolio e conteudos sinalizados para manter a plataforma confiavel."
      nav={[...adminNavigation]}
    >
      <AdminModerationTable />
    </DashboardShell>
  );
}
