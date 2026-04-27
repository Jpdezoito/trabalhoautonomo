import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { WorkerDashboardOverview } from "@/features/workers/dashboard";
import { getAppSession } from "@/lib/app-session";
import { workers } from "@/lib/marketplace-data";

type AdminWorkerPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminWorkerPreviewPage({ params }: AdminWorkerPreviewPageProps) {
  const session = await getAppSession();

  if (session?.user.role !== "ADMIN" && session?.user.role !== "SUPER_ADMIN") {
    redirect("/entrar");
  }

  const { id } = await params;
  const worker = workers.find((item) => item.slug === id);

  if (!worker) {
    notFound();
  }

  return (
    <DashboardShell
      title={`Preview profissional: ${worker.name}`}
      description="Visualizacao administrativa somente leitura do painel profissional."
      nav={[...adminNavigation]}
    >
      <WorkerDashboardOverview worker={worker} readOnly />
    </DashboardShell>
  );
}
