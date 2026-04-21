import { QuoteRequestForm } from "@/features/quotes/quote-request-form";
import { Card } from "@/components/ui/card";
import type { Worker } from "@/types/marketplace";

export function QuoteRequestPanel({ worker }: { worker: Worker }) {
  return (
    <Card id="orcamento" className="min-w-0 p-5">
      <h2 className="text-2xl font-black text-foreground">Solicitar orcamento</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Envie os detalhes do servico para o profissional analisar prazo, materiais e disponibilidade.
      </p>
      <QuoteRequestForm worker={worker} />
    </Card>
  );
}
