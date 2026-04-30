import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicReviewAuthor, getPublishedReviews, getReviewDistribution } from "@/features/reviews";
import { formatRating } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function ReviewSummary({ worker }: { worker: Worker }) {
  const publishedReviews = getPublishedReviews(worker.reviews);
  const distribution = getReviewDistribution(worker.reviews);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Avaliações</CardTitle>
          <Badge variant="warning">
            <Star className="fill-current" size={14} />
            {formatRating(worker.rating)} média
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="rounded-[8px] border border-border bg-surface-muted p-5">
            <p className="text-sm font-bold text-muted">Nota média</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight text-foreground">{formatRating(worker.rating)}</span>
              <span className="pb-1 text-sm font-bold text-muted">/ 5</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-muted">{worker.reviewsCount} avaliações registradas</p>
            <p className="mt-2 text-xs leading-5 text-muted">Somente avaliações aprovadas pela moderação entram no resumo público.</p>
          </div>

          <div className="grid gap-2">
            {distribution.map((item) => (
              <div key={item.rating} className="grid grid-cols-[42px_1fr_42px] items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm font-black text-foreground">
                  {item.rating}
                  <Star className="fill-accent text-accent" size={14} />
                </span>
                <span className="h-3 overflow-hidden rounded-[8px] bg-surface-muted">
                  <span className="block h-full bg-accent" style={{ width: `${item.percentage}%` }} />
                </span>
                <span className="text-right text-xs font-bold text-muted">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {publishedReviews.map((review) => (
            <article key={`${review.title}-${review.date}`} className="rounded-[8px] border border-border bg-surface p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-black text-foreground">{review.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-muted">
                    {getPublicReviewAuthor(review)} - {review.date}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-[8px] bg-warning-soft px-3 py-1 text-sm font-black text-warning">
                  <Star className="fill-current" size={15} />
                  {review.rating}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">{review.comment}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
