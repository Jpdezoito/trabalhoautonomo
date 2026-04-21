"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  nav: readonly { href: string; label: string }[] | { href: string; label: string }[];
  authLinks?: { href: string; label: string; variant?: "ghost" | "secondary" | "outline" }[];
};

export function MobileNav({ nav, authLinks = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex rounded-[8px] border border-border bg-surface p-2 text-muted-strong shadow-sm"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={cn("fixed inset-x-0 top-16 z-50 border-b border-border bg-surface shadow-[var(--shadow-lg)] transition", open ? "opacity-100" : "pointer-events-none opacity-0")}>
        <div className="container-page grid gap-3 py-4">
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[8px] border border-border bg-surface-muted px-4 py-3 text-sm font-bold text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {authLinks.length ? (
            <div className="grid gap-2 pt-2">
              {authLinks.map((item) => (
                <LinkButton key={item.href} href={item.href} variant={item.variant ?? "outline"} size="sm" onClick={() => setOpen(false)}>
                  {item.label}
                </LinkButton>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
