import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function ContactPage() {
  return (
    <InstitutionalPage
      eyebrow="Contato"
      title="Fale com a equipe da plataforma."
      description="Se você precisa de ajuda com conta, moderação, perfis, orçamentos ou assuntos administrativos, use os canais institucionais."
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
            "Ajuda com acesso, configuração de conta, verificação de profissional, análise de conteúdo, revisão de avaliação e suporte em fluxos de orçamento.",
            "Para assuntos ligados a um serviço específico entre cliente e profissional, o ideal é manter o Histórico dentro da plataforma sempre que possível.",
          ],
        },
      ]}
    />
  );
}
