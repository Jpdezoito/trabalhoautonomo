import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function AboutPage() {
  return (
    <InstitutionalPage
      eyebrow="Sobre"
      title="Uma plataforma para conectar clientes a autônomos com mais clareza, confiança e organizacao."
      description="AutonomoPro nasce para reunir serviços locais em um marketplace profissional, com perfis completos, portfólio, contato rápido, pedidos de orçamento e estrutura de moderação."
      sections={[
        {
          title: "Proposito",
          body: [
            "A plataforma foi desenhada para ajudar clientes a comparar profissionais por categoria, localização, portfólio, avaliação e disponibilidade antes de entrar em contato.",
            "Ao mesmo tempo, profissionais autônomos ganham um espaco organizado para apresentar serviços, áreas atendidas, reputacao e canais de contato em um ambiente mais confiavel.",
          ],
        },
        {
          title: "O que a plataforma cobre",
          body: [
            "O marketplace não e limitado a profissões tradicionais. Ele suporta serviços técnicos, manutenção, limpeza, beleza, cuidados, frete, entregas, mudanças, reparos, instalações e varias outras categorias autonomas.",
            "Esse modelo amplo ajuda clientes a encontrar desde um eletricista ate um motoboy, um frete pequeno, um faz-tudo ou um profissional de limpeza em um unico ambiente.",
          ],
        },
      ]}
    />
  );
}
