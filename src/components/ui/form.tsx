import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FieldGroup({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid min-w-0 gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

export function Field({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid min-w-0 gap-2", className)}>{children}</div>;
}

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-bold text-muted-strong", className)} {...props}>
      {children}
    </label>
  );
}

const controlClass =
  "h-11 w-full min-w-0 rounded-[8px] border border-border bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)] px-3 text-sm text-foreground shadow-[var(--shadow-sm)] transition placeholder:text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(controlClass, className)} {...props} />;
});

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlClass, "appearance-auto truncate pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-[8px] border border-border bg-surface p-3 text-sm text-foreground shadow-sm transition placeholder:text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted",
        "bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)] shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    />
  );
});

export function FieldHint({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs leading-5 text-muted", className)} {...props}>
      {children}
    </p>
  );
}

export function FieldError({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs font-semibold leading-5 text-danger", className)} {...props}>
      {children}
    </p>
  );
}
