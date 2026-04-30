"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, MapPin, MessageSquareText, Phone, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { quoteStatusLabels, quoteStatusVariants } from "@/features/quotes/service";
import type { QuoteLifecycleStatus, QuoteRequestRecord } from "@/features/quotes/types";

type WorkerQuoteInboxProps = {
  initialQuotes: QuoteRequestRecord[];
};

const statusOptions: QuoteLifecycleStatus[] = ["OPEN", "IN_CONTACT", "ACCEPTED", "DECLINED", "COMPLETED"];

export function WorkerQuoteInbox({ initialQuotes }: WorkerQuoteInboxProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedId, setSelectedId] = useState(initialQuotes[0]?.id);
  const selectedQuote = quotes.find((quote) => quote.id === selectedId) ?? quotes[0];

  const stats = useMemo(
    () => ({
      open: quotes.filter((quote) => quote.status === "OPEN").length,
      accepted: quotes.filter((quote) => quote.status === "ACCEPTED").length,
      completed: quotes.filter((quote) => quote.status === "COMPLETED").length,
    }),
    [quotes],
  );

  function updateStatus(quoteId: string, status: QuoteLifecycleStatus) {
    setQuotes((current) => current.map((quote) => (quote.id === quoteId ? { ...quote, status } : quote)));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="grid min-w-0 gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Novos" value={stats.open.toString()} icon={<Clock size={20} />} />
          <Metric label="Aceitos" value={stats.accepted.toString()} icon={<CheckCircle2 size={20} />} />
          <Metric label="Concluídos" value={stats.completed.toString()} icon={<MessageSquareText size={20} />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quotes.map((quote) => (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => setSelectedId(quote.id)}
                  className={`rounded-[8px] border p-4 text-left transition ${
                    selectedQuote?.id === quote.id ? "border-primary bg-primary-soft" : "border-border bg-surface hover:bg-surface-muted"
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{quote.code}</p>
                      <h2 className="mt-1 text-lg font-black text-foreground">{quote.serviceType}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{quote.description}</p>
                    </div>
                    <Badge variant={quoteStatusVariants[quote.status]}>{quoteStatusLabels[quote.status]}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-muted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={15} />
                      {quote.neighborhood}, {quote.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone size={15} />
                      {quote.clientPhone}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="xl:sticky xl:top-24 xl:h-fit">
        {selectedQuote ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Detalhes do pedido</CardTitle>
                  <p className="mt-1 text-sm font-bold text-primary">{selectedQuote.code}</p>
                </div>
                <Badge variant={quoteStatusVariants[selectedQuote.status]}>{quoteStatusLabels[selectedQuote.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Detail label="Cliente" value={selectedQuote.clientName} />
                <Detail label="Contato" value={`${selectedQuote.clientPhone} - ${selectedQuote.clientEmail}`} />
                <Detail label="Local" value={`${selectedQuote.neighborhood}, ${selectedQuote.city}`} />
                <Detail label="Serviço" value={selectedQuote.serviceType} />
                <Detail label="Descrição" value={selectedQuote.description} />
                {selectedQuote.extraNotes ? <Detail label="Observações" value={selectedQuote.extraNotes} /> : null}
                {selectedQuote.preferredDate ? (
                  <div className="rounded-[8px] bg-surface-muted p-3">
                    <p className="flex items-center gap-2 text-sm font-bold text-muted">
                      <CalendarDays size={16} />
                      Data preferida
                    </p>
                    <p className="mt-1 font-black text-foreground">{selectedQuote.preferredDate}</p>
                  </div>
                ) : null}
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-muted-strong">Atualizar status</label>
                  <Select value={selectedQuote.status} onChange={(event) => updateStatus(selectedQuote.id, event.target.value as QuoteLifecycleStatus)}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {quoteStatusLabels[status]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="button" variant="subtle" onClick={() => updateStatus(selectedQuote.id, "IN_CONTACT")}>
                    Em contato
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => updateStatus(selectedQuote.id, "ACCEPTED")}>
                    Aceitar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => updateStatus(selectedQuote.id, "COMPLETED")}>
                    Concluir
                  </Button>
                  <Button type="button" variant="danger" onClick={() => updateStatus(selectedQuote.id, "DECLINED")}>
                    <XCircle className="mr-2" size={17} />
                    Recusar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-muted">{label}</p>
            <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
          </div>
          <span className="rounded-[8px] bg-primary-soft p-3 text-primary">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-foreground">{value}</p>
    </div>
  );
}
