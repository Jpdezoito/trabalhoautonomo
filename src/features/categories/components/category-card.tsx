import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { routes } from "@/config/routes";
import type { CategoryWithContent } from "@/features/categories/types";

export function CategoryCard({ category }: { category: CategoryWithContent }) {
  const Icon = category.icon;

  return (
    <Card variant="interactive" className="h-full">
      <Link href={routes.category(category.slug)} className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
            <Icon size={24} />
          </span>
          <Badge variant={category.workers.length ? "success" : "neutral"}>
            {category.workers.length || category.professionals} profissionais
          </Badge>
        </div>
        <h2 className="mt-5 text-xl font-black text-foreground">{category.content.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{category.content.subtitle}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-black text-primary">
          Explorar categoria
          <ArrowRight size={16} />
        </div>
      </Link>
    </Card>
  );
}
