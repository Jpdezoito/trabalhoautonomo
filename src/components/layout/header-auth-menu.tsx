"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { routes } from "@/config/routes";
import { getDashboardRouteByRole, getSettingsRouteByRole } from "@/lib/role-routing";
import { signOutFromNextAuth } from "@/lib/next-auth-client";

type HeaderAuthMenuProps = {
  name: string;
  role?: "CLIENT" | "WORKER" | "ADMIN" | "SUPER_ADMIN";
  mode?: "next-auth" | "dev-local";
};

export function HeaderAuthMenu({ name, role, mode = "next-auth" }: HeaderAuthMenuProps) {
  const router = useRouter();
  const dashboardHref = getDashboardRouteByRole(role);
  const settingsHref = getSettingsRouteByRole(role);

  async function handleLogout() {
    if (mode === "dev-local") {
      await fetch("/api/dev-auth/session", {
        method: "DELETE",
      });
      window.localStorage.removeItem("autonomopro.dev-auth");
      router.push(routes.home);
      router.refresh();
      return;
    }

    await signOutFromNextAuth(routes.home);
  }

  return (
    <Dropdown label={name} align="right">
      <Link href={dashboardHref}>
        <DropdownItem>
          <span className="inline-flex items-center gap-2">
            <UserRound size={16} />
            Meu painel
          </span>
        </DropdownItem>
      </Link>
      <Link href={settingsHref}>
        <DropdownItem>
          <span className="inline-flex items-center gap-2">
            <Settings size={16} />
            Configurações
          </span>
        </DropdownItem>
      </Link>
      {(role === "ADMIN" || role === "SUPER_ADMIN") ? (
        <Link href={routes.admin}>
          <DropdownItem>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} />
              Administração
            </span>
          </DropdownItem>
        </Link>
      ) : null}
      <button type="button" onClick={() => void handleLogout()} className="w-full text-left">
        <DropdownItem>
          <span className="inline-flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </span>
        </DropdownItem>
      </button>
    </Dropdown>
  );
}
