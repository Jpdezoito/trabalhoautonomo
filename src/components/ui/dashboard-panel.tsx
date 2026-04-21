import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardPanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardPanel({ title, description, action, children }: DashboardPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
