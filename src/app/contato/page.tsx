import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function ContactPage() {
  return (
    <InstitutionalPage
      eyebrow="Contato"
      title="Fale com a equipe da plataforma."
      description="Se voce precisa de ajuda com conta, moderacao, perfis, orcamentos ou assuntos administrativos, use os canais institucionais."
      sections={[
        {
          title: "Atendimento",
          body: [
            "E-mail: suporte@autonomopro.com.br",
            "Horario de atendimento: segunda a sexta, das 9h as 18h, exceto feriados.",
          ],
        },
        {
          title: "Assuntos mais comuns",
          body: [
            "Ajuda com acesso, configuracao de conta, verificacao de profissional, analise de conteudo, revisao de avaliacao e suporte em fluxos de orcamento.",
            "Para assuntos ligados a um servico especifico entre cliente e profissional, o ideal e manter o historico dentro da plataforma sempre que possivel.",
          ],
        },
      ]}
    />
  );
}
