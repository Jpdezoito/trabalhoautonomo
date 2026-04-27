import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { adminUsers } from "@/features/admin/admin-data";
import { ClientDashboardOverview } from "@/features/clients/dashboard";
import { getAppSession } from "@/lib/app-session";

type AdminClientPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminClientPreviewPage({ params }: AdminClientPreviewPageProps) {
  const session = await getAppSession();

  if (session?.user.role !== "ADMIN" && session?.user.role !== "SUPER_ADMIN") {
    redirect("/entrar");
  }

  const { id } = await params;
  const client = adminUsers.find((item) => item.id === id && item.role === "Cliente");

  if (!client) {
    notFound();
  }

  return (
    <DashboardShell
      title={`Preview cliente: ${client.name}`}
      description="Visualizacao administrativa somente leitura do painel do cliente."
      nav={[...adminNavigation]}
    >
      <ClientDashboardOverview readOnly />
    </DashboardShell>
  );
}
