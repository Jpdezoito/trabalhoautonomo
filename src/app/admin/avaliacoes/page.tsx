import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { ReviewModerationTable } from "@/features/reviews/components/review-moderation-table";
import { workers } from "@/lib/marketplace-data";
import type { ReviewStatus } from "@/types/marketplace";

export default function AdminReviewsPage() {
  const reviews = workers.flatMap((worker, workerIndex) =>
    worker.reviews.map((review, reviewIndex) => ({
      ...review,
      id: `${worker.slug}-${reviewIndex}`,
      email: getMockReviewEmail(workerIndex, reviewIndex),
      workerSlug: worker.slug,
      workerName: worker.name,
      status: getMockStatus(workerIndex, reviewIndex),
    })),
  );

  return (
    <DashboardShell
      title="Moderação de avaliações"
      description="Revise feedbacks enviados por clientes, publique conteúdos adequados e oculte avaliações que precisam de análise."
      nav={[...adminNavigation]}
    >
      <ReviewModerationTable reviews={reviews} />
    </DashboardShell>
  );
}

function getMockReviewEmail(workerIndex: number, reviewIndex: number) {
  const emails = [
    ["mariana@email.com", "ricardo@email.com"],
    ["paulo@email.com", "renata@email.com"],
    ["andreia@email.com"],
    ["luciana@email.com"],
    ["empresa-alfa@email.com"],
    ["camila@email.com"],
  ];

  return emails[workerIndex]?.[reviewIndex];
}

function getMockStatus(workerIndex: number, reviewIndex: number): ReviewStatus {
  if (workerIndex === 1 && reviewIndex === 1) return "pending";
  if (workerIndex === 2 && reviewIndex === 0) return "flagged";

  return "published";
}
