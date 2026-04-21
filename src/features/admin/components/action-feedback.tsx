"use client";

import { cn } from "@/lib/utils";

type ActionFeedbackProps = {
  message?: string;
  tone?: "success" | "error" | "info";
  className?: string;
};

export function ActionFeedback({ message, tone = "info", className }: ActionFeedbackProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-sm font-semibold",
        tone === "success" && "text-success",
        tone === "error" && "text-danger",
        tone === "info" && "text-primary",
        className,
      )}
    >
      {message}
    </p>
  );
}
