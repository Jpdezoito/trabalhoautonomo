import { quotes } from "@/lib/marketplace-data";
import { Badge } from "@/components/ui/badge";

export function QuoteTable() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#dbe5e1] bg-white shadow-sm">
      <div className="border-b border-[#dbe5e1] p-5">
        <h2 className="text-xl font-black text-[#1f2933]">Orçamentos recentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f4f7f9] text-[#334e68]">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Serviço</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Profissional</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5ece8]">
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td className="px-5 py-4 font-bold text-[#1f2933]">{quote.id}</td>
                <td className="px-5 py-4 text-[#52616b]">{quote.service}</td>
                <td className="px-5 py-4 text-[#52616b]">{quote.client}</td>
                <td className="px-5 py-4 text-[#52616b]">{quote.worker}</td>
                <td className="px-5 py-4">
                  <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
                </td>
                <td className="px-5 py-4 font-semibold text-[#1f2933]">{quote.value ?? "A definir"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  if (status === "Aprovado" || status === "Concluído") return "success" as const;
  if (status === "Respondido") return "info" as const;
  return "primary" as const;
}
