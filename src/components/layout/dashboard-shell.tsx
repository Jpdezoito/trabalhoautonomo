import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { DashboardNav } from "@/components/layout/dashboard-nav";

type DashboardShellProps = {
  title: string;
  description: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
};

export function DashboardShell({ title, description, nav, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <DashboardNav nav={nav} />
        </aside>
        <main>
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Área segura</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
