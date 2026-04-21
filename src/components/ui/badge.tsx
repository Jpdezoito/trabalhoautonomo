import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-surface-muted text-muted-strong ring-border",
  primary: "bg-primary-soft text-primary-strong ring-[#b9ded7]",
  success: "bg-success-soft text-success ring-[#b8dec9]",
  warning: "bg-warning-soft text-warning ring-[#ead47f]",
  danger: "bg-danger-soft text-danger ring-[#edc0bc]",
  info: "bg-info-soft text-info ring-[#bad6e6]",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
  children: ReactNode;
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[8px] px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
