import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ModalProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ title, description, children, footer }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#202522]/55 p-4 backdrop-blur-sm">
      <Card variant="elevated" className="w-full max-w-lg overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="text-xl font-black text-foreground">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="sm" aria-label="Fechar modal">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-border bg-surface-muted p-5">{footer}</div> : null}
      </Card>
    </div>
  );
}
