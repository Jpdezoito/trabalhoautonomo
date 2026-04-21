import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, detail, icon, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">{value}</p>
        </div>
        {icon ? <div className="rounded-[8px] border border-border bg-primary-soft p-3 text-primary shadow-[var(--shadow-sm)]">{icon}</div> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
    </Card>
  );
}
