import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white shadow-[var(--shadow-sm)] hover:bg-primary-strong hover:shadow-[var(--shadow-md)]",
  secondary: "bg-accent text-foreground shadow-[var(--shadow-sm)] hover:bg-[#d9a936] hover:shadow-[var(--shadow-md)]",
  outline: "border border-border bg-surface text-foreground shadow-[var(--shadow-sm)] hover:border-border-strong hover:bg-surface-muted",
  ghost: "text-muted-strong hover:bg-primary-soft hover:text-primary-strong",
  danger: "bg-danger text-white shadow-[var(--shadow-sm)] hover:bg-[#98362f] hover:shadow-[var(--shadow-md)]",
  subtle: "bg-primary-soft text-primary-strong hover:bg-[#ccebe4]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-7 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f6b5f]/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export function LinkButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f6b5f]/30",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
