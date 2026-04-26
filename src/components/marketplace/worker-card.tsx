import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { PlanBadge, TrustBadge } from "@/components/marketplace/trust-badge";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRating } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image src={worker.coverImage} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="p-5 pt-0">
        <div className="relative flex min-w-0 items-start gap-4">
          <Image src={worker.image} alt={worker.name} width={76} height={76} className="-mt-9 size-[76px] shrink-0 rounded-[8px] border-4 border-white object-cover shadow-[var(--shadow-md)]" />
          <div className="min-w-0 flex-1 pt-4">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-black text-foreground">{worker.name}</h3>
              <TrustBadge worker={worker} compact />
            </div>
            <p className="text-sm font-semibold text-muted">{worker.role}</p>
          </div>
          <FavoriteButton workerSlug={worker.slug} workerName={worker.name} compact className="mt-4" />
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">{worker.headline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <TrustBadge worker={worker} />
          <PlanBadge plan={worker.plan} />
          {worker.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="primary">
              {service}
            </Badge>
          ))}
        </div>
        <div className="mt-5 grid gap-2 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Star className="fill-accent text-accent" size={16} />
            {formatRating(worker.rating)} ({worker.reviewsCount} avaliacoes)
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} />
            {worker.neighborhood}, {worker.city}
          </span>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <LinkButton href={`/profissionais/${worker.slug}`} className="flex-1">
            Ver perfil
          </LinkButton>
          <LinkButton href={`/profissionais/${worker.slug}#orcamento`} variant="outline" className="flex-1">
            Pedir orcamento
          </LinkButton>
        </div>
      </div>
    </Card>
  );
}
