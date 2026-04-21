import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "muted" | "interactive";
  children: ReactNode;
};

const variants = {
  default: "border-border bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf7_100%)] shadow-[var(--shadow-sm)]",
  elevated: "border-border bg-gradient-to-b from-white to-[#fbfaf7] shadow-[var(--shadow-md)]",
  muted: "border-border bg-surface-muted shadow-none",
  interactive: "border-border bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf7_100%)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)]",
};

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-[8px] border", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b border-border px-5 py-4 sm:px-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-xl font-black tracking-tight text-foreground", className)} {...props}>
      {children}
    </h2>
  );
}
