import { InstitutionalPage } from "@/components/layout/institutional-page";

export default function PrivacyPage() {
  return (
    <InstitutionalPage
      eyebrow="Privacidade"
      title="Política de Privacidade — AutonomoPro"
      description="A AutonomoPro valoriza a privacidade dos usuários e utiliza dados pessoais apenas para permitir o funcionamento da plataforma, conectar clientes e profissionais, proteger contas, prevenir fraudes e melhorar a experiência de uso."
      sections={[
        {
          title: "Quem somos",
          body: [
            "A AutonomoPro é uma plataforma digital que conecta clientes e profissionais autônomos para prestação de serviços locais, facilitando orçamentos, avaliações, comunicação e contratação de forma segura e transparente.",
          ],
        },
        {
          title: "Quais dados coletamos",
          body: [
            "Podemos coletar informações como nome, e-mail, telefone, cidade, bairro, dados de perfil, categoria profissional, serviços oferecidos, mensagens relacionadas a orçamentos, avaliações, favoritos, histórico de pedidos, status de disponibilidade para atendimento e sinais técnicos necessários para segurança da plataforma.",
            "Também podemos tratar dados operacionais, como registros de acesso, ações realizadas no sistema, tentativas de login, preferências de busca e informações necessárias para suporte, auditoria e moderação.",
          ],
        },
        {
          title: "Como usamos os dados",
          body: [
            "Utilizamos os dados para criar e autenticar contas, permitir que clientes encontrem profissionais, permitir que profissionais recebam pedidos de orçamento, organizar solicitações, mensagens e históricos, mostrar informações públicas de perfil profissional, calcular estimativas de orçamento, melhorar filtros, busca e experiência da plataforma, prevenir abuso, fraude, spam ou uso indevido, e cumprir obrigações legais e administrativas.",
          ],
        },
        {
          title: "Dados visíveis publicamente",
          body: [
            "Algumas informações do profissional podem aparecer publicamente, como nome profissional, cidade, bairro de atendimento, categorias, serviços, descrição do perfil, avaliações, disponibilidade pública e selo de verificação.",
            "A AutonomoPro não deve exibir em páginas públicas informações privadas ou administrativas da conta, como plano de assinatura, dados internos de pagamento, status administrativo, registros de moderação, dados privados do cliente, disponibilidade do cliente no dia do serviço ou qualquer informação que não seja necessária para a contratação pública do profissional.",
          ],
        },
        {
          title: "Dados privados e administrativos",
          body: [
            "Informações internas, administrativas ou sensíveis da conta não devem aparecer em páginas públicas. Isso inclui plano de assinatura, dados internos de moderação, registros administrativos, informações privadas de conta e dados que não sejam necessários para a contratação do serviço.",
          ],
        },
        {
          title: "Compartilhamento entre cliente e profissional",
          body: [
            "Quando um cliente solicita orçamento ou atendimento, algumas informações podem ser compartilhadas com o profissional relacionado ao pedido, como nome, forma de contato, cidade, bairro, descrição do serviço, melhor horário, observações enviadas e informações necessárias para executar o atendimento.",
            "O profissional só deve usar esses dados para responder ao pedido, combinar o serviço e realizar o atendimento solicitado.",
          ],
        },
        {
          title: "Status de disponibilidade do cliente",
          body: [
            "A plataforma pode permitir que o cliente informe sua disponibilidade no dia do serviço, como 'em casa', 'saí, mas estou voltando' ou 'fora de casa'.",
            "Esse status serve apenas para evitar deslocamentos desnecessários do profissional e melhorar a comunicação no atendimento. Ele não deve ser exibido publicamente no perfil do cliente. Apenas o cliente, o profissional relacionado ao pedido e a administração da plataforma, quando necessário, podem acessar essa informação.",
          ],
        },
        {
          title: "Favoritos, avaliações e interações",
          body: [
            "A plataforma pode registrar profissionais favoritados, avaliações, mensagens, cliques em botões de contato e outras interações necessárias para funcionamento, segurança e melhoria da experiência.",
            "Essas informações podem ser usadas para organizar a conta do usuário, melhorar recomendações, evitar abuso e manter histórico operacional da plataforma.",
          ],
        },
        {
          title: "Cookies, login e segurança",
          body: [
            "A plataforma pode usar cookies ou tecnologias semelhantes para manter login ativo, lembrar preferências, melhorar navegação, medir desempenho e proteger a plataforma contra uso indevido.",
            "Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda, alteração, divulgação indevida ou uso inadequado. Nenhum sistema é totalmente imune a riscos. Por isso, recomendamos que o usuário mantenha sua senha segura, não compartilhe acesso à conta e utilize canais oficiais da plataforma.",
          ],
        },
        {
          title: "Por quanto tempo guardamos os dados",
          body: [
            "Os dados podem ser mantidos enquanto a conta estiver ativa, enquanto forem necessários para prestação do serviço, cumprimento de obrigações legais, prevenção a fraudes, resolução de disputas ou manutenção de histórico operacional.",
            "Quando não forem mais necessários, os dados poderão ser excluídos, anonimizados ou mantidos apenas quando houver base legal para conservação.",
          ],
        },
        {
          title: "Direitos do usuário",
          body: [
            "O usuário pode solicitar informações sobre seus dados pessoais, correção de dados incompletos ou desatualizados, exclusão quando aplicável, revisão de preferências e esclarecimentos sobre o uso das informações.",
            "Algumas solicitações podem depender de verificação de identidade e podem ser limitadas quando houver necessidade de manter dados por obrigação legal, segurança, prevenção de fraude ou defesa de direitos.",
          ],
        },
        {
          title: "Como pedir exclusão, correção ou acesso aos dados",
          body: [
            "Para dúvidas, solicitações ou pedidos relacionados à privacidade e proteção de dados, entre em contato pelo canal oficial da AutonomoPro:",
            "E-mail: privacidade@autonomopro.com.br",
          ],
        },
        {
          title: "Alterações nesta política",
          body: [
            "Esta Política de Privacidade pode ser atualizada para refletir melhorias na plataforma, mudanças legais ou novas funcionalidades. Quando houver alterações relevantes, a AutonomoPro poderá comunicar os usuários por aviso no site ou outros canais disponíveis.",
          ],
        },
      ]}
    />
  );
}
