import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { HeaderAuthMenu } from "@/components/layout/header-auth-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LinkButton } from "@/components/ui/button";
import { adminNavigation, clientNavigation, publicNavigation, workerNavigation } from "@/config/navigation";
import { platformConfig } from "@/config/platform";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";
import { getDashboardRouteByRole } from "@/lib/role-routing";

export async function SiteHeader() {
  const session = await getAppSession();
  const role = session?.user?.role;
  const mobileNav = role === "ADMIN" || role === "SUPER_ADMIN" ? adminNavigation : role === "WORKER" ? workerNavigation : role === "CLIENT" ? clientNavigation : publicNavigation;
  const desktopNav =
    role === "ADMIN" || role === "SUPER_ADMIN"
      ? [
          { href: routes.admin, label: "Administração" },
          { href: routes.adminClients, label: "Clientes" },
          { href: routes.adminWorkers, label: "Profissionais" },
          { href: routes.adminModeration, label: "Moderação" },
          { href: routes.adminVerification, label: "Verificacoes" },
        ]
      : role === "WORKER"
        ? [
            { href: routes.workerDashboard, label: "Meu painel" },
            { href: routes.workerQuotes, label: "Orçamentos" },
            { href: routes.workerPortfolio, label: "Portfólio" },
            { href: routes.workerPlan, label: "Meu plano" },
          ]
        : role === "CLIENT"
          ? [
              { href: routes.clientDashboard, label: "Meu painel" },
              { href: routes.clientQuotes, label: "Orçamentos" },
              { href: routes.clientFavorites, label: "Favoritos" },
          ]
          : publicNavigation;
  const authLinks = session
    ? []
    : [
        { href: routes.login, label: "Entrar", variant: "ghost" as const },
        { href: routes.register, label: "Cadastrar", variant: "secondary" as const },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/92 shadow-sm backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href={routes.home} className="flex items-center gap-2 text-lg font-black text-foreground">
          <span className="flex size-9 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#0f766e_0%,#129184_100%)] text-white shadow-[var(--shadow-sm)]">
            <ShieldCheck size={20} />
          </span>
          {platformConfig.name}
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {desktopNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-muted-strong transition hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {session?.user ? (
            <>
              <Link href={getDashboardRouteByRole(role)} className="text-sm font-bold text-muted-strong transition hover:text-primary">
                Meu painel
              </Link>
              <HeaderAuthMenu name={session.user.name ?? "Minha conta"} role={role} mode={session.mode} />
            </>
          ) : (
            <>
              <LinkButton href={routes.login} variant="ghost" size="sm">
                Entrar
              </LinkButton>
              <LinkButton href={routes.register} variant="secondary" size="sm">
                Cadastrar
              </LinkButton>
            </>
          )}
        </div>
        <MobileNav nav={mobileNav} authLinks={authLinks} />
      </div>
    </header>
  );
}
