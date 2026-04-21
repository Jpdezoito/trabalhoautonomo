import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function TermsPage() {
  return (
    <InstitutionalPage
      eyebrow="Termos de uso"
      title="Regras basicas para uso da plataforma."
      description="Estes termos resumem responsabilidades gerais de clientes, profissionais e administradores durante o uso do marketplace."
      sections={[
        {
          title: "Uso da plataforma",
          body: [
            "Clientes e profissionais devem fornecer informacoes verdadeiras, manter dados de contato atualizados e respeitar as politicas de conteudo e moderacao publicadas pela plataforma.",
            "Perfis, avaliacoes, portfolios e pedidos de orcamento podem passar por revisao administrativa para manter a seguranca e a confiabilidade do ambiente.",
          ],
        },
        {
          title: "Responsabilidades",
          body: [
            "A plataforma organiza a conexao entre as partes, mas a contratacao do servico, valores, prazos, materiais, execucao e garantias devem ser alinhados diretamente entre cliente e profissional.",
            "Conteudos falsos, ofensivos, fraudulentos ou enganosos podem ser removidos e podem gerar suspensao ou encerramento da conta.",
          ],
        },
      ]}
    />
  );
}
