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
      workerSlug: worker.slug,
      workerName: worker.name,
      status: getMockStatus(workerIndex, reviewIndex),
    })),
  );

  return (
    <DashboardShell
      title="Moderacao de avaliacoes"
      description="Revise feedbacks enviados por clientes, publique conteudos adequados e oculte avaliacoes que precisam de analise."
      nav={[...adminNavigation]}
    >
      <ReviewModerationTable reviews={reviews} />
    </DashboardShell>
  );
}

function getMockStatus(workerIndex: number, reviewIndex: number): ReviewStatus {
  if (workerIndex === 1 && reviewIndex === 1) return "pending";
  if (workerIndex === 2 && reviewIndex === 0) return "flagged";

  return "published";
}
