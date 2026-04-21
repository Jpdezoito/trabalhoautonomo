import Image from "next/image";
import { BadgeCheck, MapPin, MessageCircle, Star, WalletCards } from "lucide-react";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { formatRating, getWhatsappUrl } from "@/lib/utils";
import type { SearchResultWorker } from "@/features/search/types";

type SearchResultCardProps = {
  result: SearchResultWorker;
};

export function SearchResultCard({ result }: SearchResultCardProps) {
  const { worker, priceAmount } = result;
  const message = `Ola, ${worker.name}. Encontrei seu perfil na AutonomoPro e gostaria de falar sobre um servico.`;

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative min-h-56 md:min-h-full">
          <Image src={worker.coverImage} alt="" fill sizes="(min-width: 768px) 220px, 100vw" className="object-cover" />
        </div>
        <div className="grid gap-5 p-5">
          <div className="flex min-w-0 gap-4">
            <Image src={worker.image} alt={worker.name} width={78} height={78} className="size-[78px] shrink-0 rounded-[8px] border border-border object-cover shadow-[var(--shadow-sm)]" />
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-xl font-black text-foreground">{worker.name}</h2>
                {worker.verified ? <BadgeCheck className="shrink-0 text-primary" size={18} /> : null}
              </div>
              <p className="mt-1 text-sm font-bold text-muted">{worker.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {worker.verified ? <Badge variant="success">Verificado</Badge> : null}
                {worker.available ? <Badge variant="info">Disponivel</Badge> : null}
              </div>
            </div>
            <FavoriteButton workerSlug={worker.slug} workerName={worker.name} compact />
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-muted">{worker.headline}</p>

          <div className="grid gap-3 text-sm text-muted sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {worker.neighborhood}, {worker.city}
            </span>
            <span className="flex items-center gap-2">
              <Star className="fill-accent text-accent" size={16} />
              {formatRating(worker.rating)} ({worker.reviewsCount})
            </span>
            <span className="flex items-center gap-2">
              <WalletCards size={16} />
              a partir de R$ {priceAmount.toLocaleString("pt-BR")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {worker.services.slice(0, 4).map((service) => (
              <Badge key={service} variant="primary">
                {service}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={routes.workerProfile(worker.slug)} className="flex-1">
              Ver perfil
            </LinkButton>
            <LinkButton href={`${routes.workerProfile(worker.slug)}#orcamento`} variant="outline" className="flex-1">
              Pedir orcamento
            </LinkButton>
            <LinkButton href={getWhatsappUrl(worker.whatsapp, message)} variant="secondary" target="_blank" rel="noreferrer" className="flex-1">
              <MessageCircle className="mr-2" size={18} />
              WhatsApp
            </LinkButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
