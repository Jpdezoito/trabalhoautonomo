"use client";

import { useState } from "react";
import { LoaderCircle, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AvailabilityToggleProps = {
  initialAvailable: boolean;
};

export function AvailabilityToggle({ initialAvailable }: AvailabilityToggleProps) {
  const [available, setAvailable] = useState(initialAvailable);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggleAvailability() {
    const nextAvailable = !available;

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/profissional/disponibilidade", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disponivel: nextAvailable }),
      });
      const payload = (await response.json()) as { disponivel?: boolean; message?: string };

      if (!response.ok || typeof payload.disponivel !== "boolean") {
        throw new Error(payload.message || "Nao foi possivel atualizar disponibilidade.");
      }

      setAvailable(payload.disponivel);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao atualizar disponibilidade.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className={cn(
        "rounded-[8px] border p-5 shadow-[var(--shadow-sm)]",
        available ? "border-success/30 bg-success-soft" : "border-border bg-surface-muted",
      )}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-muted">Disponibilidade</p>
          <h2 className="mt-1 text-2xl font-black text-foreground">Receber clientes agora?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {available
              ? "Seu perfil aparece como disponivel agora nas buscas e no perfil publico."
              : "Seu perfil fica pausado para novos contatos ate voce ativar novamente."}
          </p>
          {error ? <p className="mt-3 text-sm font-bold text-danger">{error}</p> : null}
        </div>
        <Button
          type="button"
          variant={available ? "primary" : "outline"}
          size="lg"
          className={cn("min-w-48", available ? "bg-success hover:bg-success" : "bg-surface")}
          onClick={() => void toggleAvailability()}
          disabled={busy}
        >
          {busy ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : <Power className="mr-2" size={18} />}
          {available ? "Disponivel agora" : "Ativar disponibilidade"}
        </Button>
      </div>
    </section>
  );
}
