import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { AdminVerificationTable } from "@/features/admin";
import { AdminTrustReviewTable } from "@/features/trust";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const trustRequests = await prisma.trustVerificationRequest
    .findMany({
      where: { deletedAt: null },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
      include: {
        user: true,
        workerProfile: true,
        clientProfile: true,
      },
    })
    .catch(() => []);

  return (
    <DashboardShell
      title="Verificacao de identidade"
      description="Gerencie capturas faciais, consentimento, revisoes manuais e o status da verificacao de identidade dos profissionais."
      nav={[...adminNavigation]}
    >
      <div className="grid gap-6">
        <AdminVerificationTable />
        <AdminTrustReviewTable
          items={trustRequests.map((item) => ({
            id: item.id,
            name: item.workerProfile?.publicName ?? item.user.name,
            role: item.workerProfile ? "Profissional" : "Cliente",
            type: item.type,
            status: item.status,
            submittedAt: item.submittedAt.toLocaleDateString("pt-BR"),
            provider: item.provider,
            reviewNotes: item.reviewNotes,
          }))}
        />
      </div>
    </DashboardShell>
  );
}
