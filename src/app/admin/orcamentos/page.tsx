import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNavigation } from "@/config/navigation";
import { QuoteTable } from "@/components/dashboard/quote-table";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { MessageSquareText, TimerReset, WalletCards } from "lucide-react";

export default function AdminQuotesPage() {
  return (
    <DashboardShell
      title="Orçamentos"
      description="Acompanhe solicitacoes, status, respostas, tempo medio e possiveis disputas entre clientes e profissionais."
      nav={[...adminNavigation]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Abertos" value="12" detail="Pedidos aguardando resposta." icon={<MessageSquareText size={22} />} />
        <StatCard label="Tempo medio" value="3h" detail="Tempo medio de primeiro retorno." icon={<TimerReset size={22} />} />
        <StatCard label="Conversão" value="41%" detail="Orçamentos aprovados no periodo." icon={<WalletCards size={22} />} />
      </div>
      <Card className="mt-6">
        <CardContent>
          <QuoteTable />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
