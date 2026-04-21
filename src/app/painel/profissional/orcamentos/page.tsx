import { DashboardShell } from "@/components/layout/dashboard-shell";
import { workerNavigation } from "@/config/navigation";
import { WorkerQuoteInbox } from "@/features/quotes/worker-quote-inbox";
import type { QuoteRequestRecord } from "@/features/quotes/types";
import { quotes, workers } from "@/lib/marketplace-data";

export default function WorkerQuotesPage() {
  const worker = workers[0];
  const initialQuotes: QuoteRequestRecord[] = quotes.map((quote, index) => ({
    id: quote.id,
    code: quote.id,
    workerId: worker.slug,
    workerSlug: worker.slug,
    workerName: quote.worker,
    clientName: quote.client,
    clientEmail: `cliente${index + 1}@email.com`,
    clientPhone: `(11) 9999${index}-100${index}`,
    serviceType: quote.service,
    city: quote.location.split(", ")[1] ?? worker.city,
    neighborhood: quote.location.split(", ")[0] ?? worker.neighborhood,
    description: `Pedido de orcamento para ${quote.service.toLowerCase()} com necessidade de retorno do profissional.`,
    extraNotes: "Cliente prefere contato pelo WhatsApp.",
    preferredDate: "",
    status: mapQuoteStatus(quote.status),
    createdAt: new Date().toISOString(),
  }));

  return (
    <DashboardShell
      title="Orcamentos recebidos"
      description="Veja pedidos enviados por clientes, acompanhe detalhes e atualize o status do atendimento."
      nav={[...workerNavigation]}
    >
      <WorkerQuoteInbox initialQuotes={initialQuotes} />
    </DashboardShell>
  );
}

function mapQuoteStatus(status: string): QuoteRequestRecord["status"] {
  if (status === "Respondido") return "IN_CONTACT";
  if (status === "Aprovado") return "ACCEPTED";
  if (status === "Concluido") return "COMPLETED";
  return "OPEN";
}
