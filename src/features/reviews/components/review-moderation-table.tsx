"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Flag, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatRating } from "@/lib/utils";
import type { Review, ReviewStatus } from "@/types/marketplace";

type ModerationReview = Review & {
  id: string;
  workerName: string;
};

const statusLabel: Record<ReviewStatus, string> = {
  pending: "Pendente",
  published: "Publicada",
  hidden: "Oculta",
  rejected: "Rejeitada",
  flagged: "Sinalizada",
};

export function ReviewModerationTable({ reviews }: { reviews: ModerationReview[] }) {
  const [items, setItems] = useState(reviews);
  const stats = useMemo(
    () => ({
      pending: items.filter((review) => review.status === "pending").length,
      published: items.filter((review) => review.status === "published").length,
      hidden: items.filter((review) => review.status === "hidden").length,
    }),
    [items],
  );

  function updateStatus(id: string, status: ReviewStatus) {
    setItems((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <ModerationStat label="Pendentes" value={stats.pending} tone="warning" />
        <ModerationStat label="Publicadas" value={stats.published} tone="success" />
        <ModerationStat label="Ocultas" value={stats.hidden} tone="danger" />
      </div>

      <div className="grid gap-4">
        {items.map((review) => (
          <Card key={review.id} className="p-5">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={review.status === "published" ? "success" : review.status === "hidden" ? "danger" : "warning"}>
                    {statusLabel[review.status ?? "published"]}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-sm font-black text-warning">
                    <Star className="fill-current" size={15} />
                    {formatRating(review.rating)}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-black text-foreground">{review.title}</h2>
                <p className="mt-1 text-sm font-semibold text-muted">
                  {review.author || "Cliente sem nome"} avaliou {review.workerName} em {review.date}
                </p>
                <div className="mt-2 grid gap-1 text-xs font-semibold text-muted">
                  <span>E-mail: {review.email || "Não informado"}</span>
                  <span>Exibir nome publicamente: {review.showName ? "Sim" : "Não"}</span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{review.comment}</p>
              </div>

              <div className="flex flex-wrap gap-2 xl:justify-end">
                <Button type="button" variant="outline" onClick={() => updateStatus(review.id, "published")}>
                  <ShieldCheck className="mr-2" size={17} />
                  Publicar
                </Button>
                <Button type="button" variant="outline" onClick={() => updateStatus(review.id, "hidden")}>
                  <EyeOff className="mr-2" size={17} />
                  Ocultar
                </Button>
                <Button type="button" variant="outline" onClick={() => updateStatus(review.id, "flagged")}>
                  <Flag className="mr-2" size={17} />
                  Revisar
                </Button>
                <Button type="button" variant="subtle" onClick={() => updateStatus(review.id, "published")}>
                  <Eye className="mr-2" size={17} />
                  Liberar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ModerationStat({ label, value, tone }: { label: string; value: number; tone: "warning" | "success" | "danger" }) {
  return (
    <div
      className={cn(
        "rounded-[8px] border p-4",
        tone === "warning" && "border-warning/30 bg-warning-soft text-warning",
        tone === "success" && "border-success/30 bg-success-soft text-success",
        tone === "danger" && "border-danger/30 bg-danger-soft text-danger",
      )}
    >
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
