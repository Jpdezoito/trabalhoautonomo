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
            "1. Busque profissionais por categoria, cidade ou bairro, filtrando conforme sua necessidade.",
            "2. Analise os perfis: veja avaliações, portfólio, preço inicial, áreas de atuação e disponibilidade antes de entrar em contato.",
            "3. Solicite orçamento ou envie mensagem diretamente pelo perfil do profissional.",
            "4. Acompanhe o andamento dos seus pedidos e conversas no painel do cliente.",
            "5. Após o atendimento, avalie o profissional e salve em seus favoritos para futuras necessidades.",
            "6. Suas avaliações ajudam outros clientes a escolherem melhor e valorizam os bons profissionais.",
          ],
        },
        {
          title: "Para profissionais",
          body: [
            "1. Cadastre-se gratuitamente e crie um perfil público detalhado, incluindo descrição, especialidades, áreas atendidas, portfólio, canais de contato e disponibilidade.",
            "2. Perfis completos e com portfólio tendem a receber mais pedidos qualificados.",
            "3. Receba notificações de novos orçamentos ou mensagens diretamente no painel profissional.",
            "4. Responda rapidamente aos clientes, envie propostas e negocie condições.",
            "5. Organize seu portfólio, atualize serviços, ajuste visibilidade e acompanhe avaliações recebidas.",
            "6. Profissionais bem avaliados ganham destaque e mais oportunidades na plataforma.",
          ],
        },
      ]}
    />
  );
}
