import { getServerSession } from "next-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { clientNavigation } from "@/config/navigation";
import { ClientFavoritesPanel } from "@/features/clients/dashboard";
import { authOptions } from "@/lib/auth";
import { getFavoriteWorkersByClientUserId } from "@/lib/marketplace-server";

export default async function ClientFavoritesPage() {
  const session = await getServerSession(authOptions);
  const favoriteWorkers = session?.user?.id ? await getFavoriteWorkersByClientUserId(session.user.id) : [];

  return (
    <DashboardShell
      title="Favoritos"
      description="Acesse rapidamente os profissionais salvos para comparar, pedir orcamento ou chamar novamente."
      nav={[...clientNavigation]}
    >
      <ClientFavoritesPanel initialWorkers={favoriteWorkers} />
    </DashboardShell>
  );
}
