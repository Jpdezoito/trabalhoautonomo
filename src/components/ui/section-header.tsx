import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, action, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "mx-auto max-w-3xl text-center sm:block",
        className,
      )}
    >
      <div>
        {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">{eyebrow}</p> : null}
        <h2 className="mt-2 text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-base leading-7 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
