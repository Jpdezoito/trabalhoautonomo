import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DropdownProps = {
  label: string;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
};

export function Dropdown({ label, children, align = "left", className }: DropdownProps) {
  return (
    <div className={cn("group relative inline-flex", className)}>
      <Button type="button" variant="outline" size="sm">
        {label}
        <ChevronDown className="ml-2" size={16} />
      </Button>
      <Card
        className={cn(
          "invisible absolute top-[calc(100%+0.5rem)] z-50 min-w-56 p-2 opacity-0 shadow-[var(--shadow-lg)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100",
          align === "right" ? "right-0" : "left-0",
        )}
      >
        {children}
      </Card>
    </div>
  );
}

export function DropdownItem({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] px-3 py-2 text-sm font-semibold text-muted-strong hover:bg-primary-soft hover:text-primary-strong">
      {children}
    </div>
  );
}
