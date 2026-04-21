import Link from "next/link";
import { Card } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { publicCategories } from "@/lib/marketplace-data";

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {publicCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.slug} variant="interactive">
            <Link href={routes.category(category.slug)} className="block p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                  <Icon size={22} />
                </span>
                <div>
                  {category.group ? <p className="mb-1 text-xs font-black uppercase tracking-normal text-primary">{category.group}</p> : null}
                  <h3 className="font-black text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  <p className="mt-3 text-sm font-bold text-primary">{category.professionals} profissionais ativos</p>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
