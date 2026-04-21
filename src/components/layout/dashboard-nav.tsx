"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  nav: { href: string; label: string }[];
};

export function DashboardNav({ nav }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <Card className="p-3">
      <nav className="grid gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[8px] px-3 py-2 text-sm font-bold transition",
                active ? "bg-primary text-white shadow-sm" : "text-muted-strong hover:bg-primary-soft hover:text-primary-strong",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
