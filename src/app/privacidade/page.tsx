import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function PrivacyPage() {
  return (
    <InstitutionalPage
      eyebrow="Privacidade"
      title="Como tratamos dados de cadastro, contato e operacao."
      description="A plataforma usa dados pessoais para permitir login, perfis, pedidos de orcamento, notificacoes, suporte e medidas de seguranca."
      sections={[
        {
          title: "Dados utilizados",
          body: [
            "Podemos tratar nome, e-mail, telefone, cidade, bairro, informacoes de perfil, mensagens relacionadas a orcamentos e sinais operacionais necessarios para funcionamento da plataforma.",
            "Esses dados ajudam a autenticar contas, permitir contato entre as partes, organizar pedidos e manter historicos operacionais e de moderacao.",
          ],
        },
        {
          title: "Seguranca e visibilidade",
          body: [
            "Informacoes publicas de perfil sao exibidas conforme configuracoes da conta e regras da plataforma. Dados internos e administrativos devem ser usados apenas para suporte, seguranca e operacao.",
            "Sempre que houver necessidade de revisao, fraude suspeita ou moderacao, registros relacionados podem ser analisados pela equipe responsavel.",
          ],
        },
      ]}
    />
  );
}
