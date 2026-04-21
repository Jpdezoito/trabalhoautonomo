import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function AboutPage() {
  return (
    <InstitutionalPage
      eyebrow="Sobre"
      title="Uma plataforma para conectar clientes a autonomos com mais clareza, confianca e organizacao."
      description="AutonomoPro nasce para reunir servicos locais em um marketplace profissional, com perfis completos, portfolio, contato rapido, pedidos de orcamento e estrutura de moderacao."
      sections={[
        {
          title: "Proposito",
          body: [
            "A plataforma foi desenhada para ajudar clientes a comparar profissionais por categoria, localizacao, portfolio, avaliacao e disponibilidade antes de entrar em contato.",
            "Ao mesmo tempo, profissionais autonomos ganham um espaco organizado para apresentar servicos, areas atendidas, reputacao e canais de contato em um ambiente mais confiavel.",
          ],
        },
        {
          title: "O que a plataforma cobre",
          body: [
            "O marketplace nao e limitado a profissoes tradicionais. Ele suporta servicos tecnicos, manutencao, limpeza, beleza, cuidados, frete, entregas, mudancas, reparos, instalacoes e varias outras categorias autonomas.",
            "Esse modelo amplo ajuda clientes a encontrar desde um eletricista ate um motoboy, um frete pequeno, um faz-tudo ou um profissional de limpeza em um unico ambiente.",
          ],
        },
      ]}
    />
  );
}
