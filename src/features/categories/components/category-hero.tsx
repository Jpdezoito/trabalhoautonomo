import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { CategoryWithContent } from "@/features/categories/types";

export function CategoryHero({ category }: { category: CategoryWithContent }) {
  const Icon = category.icon;

  return (
    <section className="relative overflow-hidden bg-[#202522] text-white">
      <Image src={category.content.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-32" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#202522] via-[#202522]/88 to-[#202522]/45" />
      <div className="relative container-page py-14 sm:py-18 lg:py-20">
        <div className="max-w-4xl">
          <Badge variant="warning" className="bg-white/12 text-accent ring-white/20">
            Categoria de serviço
          </Badge>
          <div className="mt-6 flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[8px] bg-white/12 text-accent ring-1 ring-white/20">
              <Icon size={28} />
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{category.content.title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#eee7d9]">{category.content.description}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={`${routes.search}?categoria=${category.slug}`} variant="secondary">
              <Search className="mr-2" size={18} />
              Buscar profissionais
            </LinkButton>
            <LinkButton href={routes.categories} variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/14">
              Ver outras categorias
              <ArrowRight className="ml-2" size={18} />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
