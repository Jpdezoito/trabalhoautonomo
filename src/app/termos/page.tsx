import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function TermsPage() {
  return (
    <InstitutionalPage
      eyebrow="Termos de uso"
      title="Regras básicas para uso da plataforma."
      description="Estes termos resumem responsabilidades gerais de clientes, profissionais e administradores durante o uso do marketplace."
      sections={[
        {
          title: "Uso da plataforma",
          body: [
            "Clientes e profissionais devem fornecer informações verdadeiras, manter dados de contato atualizados e respeitar as políticas de conteúdo e moderação publicadas pela plataforma.",
            "Perfis, avaliações, portfólios e pedidos de orçamento podem passar por revisão administrativa para manter a segurança e a confiabilidade do ambiente.",
          ],
        },
        {
          title: "Responsabilidades",
          body: [
            "A plataforma organiza a conexão entre as partes, mas a contratação do serviço, valores, prazos, materiais, execução e garantias devem ser alinhados diretamente entre cliente e profissional.",
            "Conteúdos falsos, ofensivos, fraudulentos ou enganosos podem ser removidos e podem gerar suspensão ou encerramento da conta.",
          ],
        },
      ]}
    />
  );
}
