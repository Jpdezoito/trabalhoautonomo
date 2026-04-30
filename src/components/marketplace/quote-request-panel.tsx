import { QuoteRequestForm } from "@/features/quotes/quote-request-form";
import { Card } from "@/components/ui/card";
import type { Worker } from "@/types/marketplace";

export function QuoteRequestPanel({ worker }: { worker: Worker }) {
  return (
    <Card
      id="orcamento"
      className="min-w-0 p-5 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col"
    >
      <div className="shrink-0">
        <h2 className="text-2xl font-black text-foreground">Solicitar orçamento</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Envie os detalhes do serviço. A AutonomoPro calcula uma faixa inicial com taxa da plataforma e valor estimado para o profissional.
        </p>
      </div>
      <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#e2e8f0] scrollbar-track-transparent lg:block">
        <QuoteRequestForm worker={worker} />
      </div>
    </Card>
  );
}
