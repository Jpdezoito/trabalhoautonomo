import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function HowItWorksPage() {
  return (
    <InstitutionalPage
      eyebrow="Como funciona"
      title="Do encontro do profissional ao contato e avaliacao."
      description="O fluxo foi desenhado para ajudar clientes a encontrar autonomos com mais contexto e para dar aos profissionais uma apresentacao mais forte do trabalho."
      sections={[
        {
          title: "Para clientes",
          body: [
            "Busque por categoria, cidade e bairro. Compare perfis, portfolio, avaliacao, preco inicial e disponibilidade antes de pedir orcamento ou entrar em contato.",
            "Depois do atendimento, acompanhe o historico no painel, salve favoritos e publique uma avaliacao para ajudar outros clientes.",
          ],
        },
        {
          title: "Para profissionais",
          body: [
            "Crie um perfil publico com descricao, especialidades, areas atendidas, portfolio, canais de contato e disponibilidade. Perfis completos tendem a receber pedidos mais qualificados.",
            "No painel profissional, acompanhe orcamentos, atualize servicos, ajuste visibilidade, organize portfolio e veja avaliacoes recentes.",
          ],
        },
      ]}
    />
  );
}
