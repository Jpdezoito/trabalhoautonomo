"use client";

import { useState } from "react";
import { Link as LinkIcon, MessageCircle, Phone, Share2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { getPhoneUrl, getWhatsappUrl } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

export function ContactActions({ worker, className }: { worker: Worker; className?: string }) {
  const [shareState, setShareState] = useState<"idle" | "done">("idle");
  const settings = {
    showWhatsapp: worker.contactSettings?.showWhatsapp ?? true,
    showPhone: worker.contactSettings?.showPhone ?? false,
    allowQuotes: worker.contactSettings?.allowQuotes ?? true,
    allowShare: worker.contactSettings?.allowShare ?? true,
  };
  const whatsappMessage = `Ola, ${worker.name}. Encontrei seu perfil na AutonomoPro e gostaria de falar sobre um servico.`;

  async function handleShare() {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${worker.name} | AutonomoPro`,
          text: `Veja o perfil de ${worker.name} na AutonomoPro.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      setShareState("done");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  }

  return (
    <div className={className}>
      <div className="grid gap-3">
        {settings.showWhatsapp ? (
          <LinkButton href={getWhatsappUrl(worker.whatsapp, whatsappMessage)} variant="secondary" target="_blank" rel="noreferrer" className="w-full">
            <MessageCircle className="mr-2" size={18} />
            Chamar no WhatsApp
          </LinkButton>
        ) : null}

        {settings.showPhone && worker.phone ? (
          <LinkButton href={getPhoneUrl(worker.phone)} variant="outline" className="w-full">
            <Phone className="mr-2" size={18} />
            Ligar agora
          </LinkButton>
        ) : null}

        {settings.allowQuotes ? (
          <LinkButton href="#orcamento" className="w-full">
            <LinkIcon className="mr-2" size={18} />
            Solicitar orcamento
          </LinkButton>
        ) : null}

        {settings.allowShare ? (
          <Button type="button" variant="outline" className="w-full" onClick={() => void handleShare()}>
            <Share2 className="mr-2" size={18} />
            {shareState === "done" ? "Link copiado" : "Compartilhar perfil"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
