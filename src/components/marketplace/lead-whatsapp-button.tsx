"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsappUrl } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

type LeadWhatsappButtonProps = {
  worker: Worker;
  message: string;
  source: string;
  className?: string;
};

export function LeadWhatsappButton({ worker, message, source, className }: LeadWhatsappButtonProps) {
  async function handleClick() {
    const whatsappUrl = getWhatsappUrl(worker.whatsapp, message);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerSlug: worker.slug,
          source,
          channel: "WHATSAPP",
          city: worker.city,
          neighborhood: worker.neighborhood,
          referrer: window.location.href,
        }),
        keepalive: true,
      });
    } finally {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Button type="button" variant="secondary" className={className} onClick={() => void handleClick()}>
      <MessageCircle className="mr-2" size={18} />
      WhatsApp
    </Button>
  );
}
