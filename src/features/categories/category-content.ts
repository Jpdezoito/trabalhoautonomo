import { publicCategories, workers } from "@/lib/marketplace-data";
import type { CategoryPageContent, CategoryWithContent } from "@/features/categories/types";

const fallbackHeroImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=85";

export const categoryContent: Record<string, CategoryPageContent> = {
  eletricistas: {
    slug: "eletricistas",
    title: "Eletricistas",
    subtitle: "Instalacoes, manutencao e emergencias eletricas com seguranca.",
    description:
      "Encontre eletricistas para quadros de energia, tomadas, iluminacao, revisoes preventivas e atendimento emergencial em residencias, condominios e pequenos comercios.",
    heroImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento residencial e predial", "Diagnostico de falhas", "Instalacoes com garantia"],
    commonServices: ["Troca de disjuntores", "Instalacao de tomadas", "Iluminacao planejada", "Revisao de quadro eletrico"],
    whenToHire: ["Quedas frequentes de energia", "Tomadas aquecendo", "Instalacao de novos pontos", "Modernizacao eletrica"],
  },
  encanadores: {
    slug: "encanadores",
    title: "Encanadores",
    subtitle: "Reparos hidraulicos, vazamentos e manutencao preventiva.",
    description:
      "Contrate encanadores para identificar vazamentos, trocar registros, resolver problemas em caixas acopladas, instalar pressurizadores e cuidar da rede hidraulica.",
    heroImage: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Caca vazamento", "Reparos localizados", "Atendimento para condominios"],
    commonServices: ["Vazamentos", "Caixa acoplada", "Troca de registros", "Pressurizador"],
    whenToHire: ["Conta de agua alta", "Infiltracao aparente", "Baixa pressao", "Banheiro com vazamento"],
  },
  mecanicos: {
    slug: "mecanicos",
    title: "Mecanicos",
    subtitle: "Diagnostico, revisao e manutencao automotiva local.",
    description:
      "Encontre mecanicos para revisoes, freios, suspensao, diagnostico, troca de pecas e atendimento local conforme disponibilidade.",
    heroImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Diagnostico claro", "Manutencao preventiva", "Atendimento local"],
    commonServices: ["Revisao geral", "Freios", "Suspensao", "Diagnostico eletronico"],
    whenToHire: ["Barulhos incomuns", "Luz de alerta no painel", "Revisao antes de viagem", "Troca de componentes"],
  },
  pedreiros: {
    slug: "pedreiros",
    title: "Pedreiros",
    subtitle: "Obras, alvenaria, pisos, reboco e pequenas reformas.",
    description:
      "Compare pedreiros para obras residenciais, ajustes estruturais, revestimentos, reparos e etapas de reforma com escopo definido.",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Pequenas e medias obras", "Revestimentos", "Acabamento organizado"],
    commonServices: ["Assentamento de piso", "Reboco", "Alvenaria", "Contrapiso"],
    whenToHire: ["Reforma de ambiente", "Correcoes em parede", "Instalacao de revestimento", "Adequacoes de obra"],
  },
  pintores: {
    slug: "pintores",
    title: "Pintores",
    subtitle: "Pintura residencial, comercial, textura e acabamento fino.",
    description:
      "Encontre pintores para renovacao de ambientes, pintura interna e externa, texturas, reparos de parede e acabamento final.",
    heroImage: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Acabamento limpo", "Pintura interna e externa", "Preparacao de superficie"],
    commonServices: ["Pintura de apartamento", "Textura", "Massa corrida", "Pintura comercial"],
    whenToHire: ["Renovar o imovel", "Corrigir manchas", "Preparar para entrega", "Finalizar reforma"],
  },
  montadores: {
    slug: "montadores",
    title: "Montadores",
    subtitle: "Montagem de moveis, ajustes, paineis e instalacoes leves.",
    description:
      "Contrate montadores para guarda-roupas, paineis, moveis planejados, ajustes de portas, instalacao de prateleiras e acabamento.",
    heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Montagem cuidadosa", "Ajustes finos", "Ferramentas adequadas"],
    commonServices: ["Guarda-roupa", "Painel de TV", "Prateleiras", "Moveis planejados"],
    whenToHire: ["Moveis novos", "Mudanca de casa", "Ajuste de portas", "Instalacao de paineis"],
  },
  reformas: {
    slug: "reformas",
    title: "Reformas",
    subtitle: "Renovacao de ambientes com cronograma e equipes especializadas.",
    description:
      "Encontre profissionais para reforma de banheiro, cozinha, sala, ambientes comerciais e renovacoes completas com planejamento.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Cronograma definido", "Equipe coordenada", "Acabamento de qualidade"],
    commonServices: ["Reforma de banheiro", "Reforma de cozinha", "Pisos", "Gesso e pintura"],
    whenToHire: ["Renovar ambientes", "Melhorar valorizacao", "Corrigir problemas antigos", "Integrar espacos"],
  },
  tecnicos: {
    slug: "tecnicos",
    title: "Tecnicos",
    subtitle: "Assistencia para eletrodomesticos, ar-condicionado e equipamentos.",
    description:
      "Busque tecnicos para manutencao, instalacao e reparo de eletrodomesticos, maquinas, ar-condicionado e equipamentos residenciais.",
    heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6b7d9c67?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Diagnostico tecnico", "Manutencao preventiva", "Reparo especializado"],
    commonServices: ["Ar-condicionado", "Maquina de lavar", "Geladeira", "Assistencia tecnica"],
    whenToHire: ["Equipamento com falha", "Instalacao nova", "Manutencao periodica", "Ruido ou baixo desempenho"],
  },
  frete: {
    slug: "frete",
    title: "Frete",
    subtitle: "Transporte local para moveis, volumes, compras e cargas leves.",
    description:
      "Compare profissionais para fretes, carretos, pequenas retiradas e transporte de itens avulsos com combinacao clara de horarios, ajudantes e cuidados no trajeto.",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Retirada e entrega local", "Transporte com protecao", "Agendamento flexivel"],
    commonServices: ["Carreto", "Transporte de moveis", "Pequenos transportes", "Transporte de eletrodomesticos"],
    whenToHire: ["Comprar um item grande", "Transportar moveis avulsos", "Retirar mercadorias", "Levar caixas e volumes"],
  },
  "mudanca-residencial": {
    slug: "mudanca-residencial",
    title: "Mudanca residencial",
    subtitle: "Mudancas de casas e apartamentos com apoio no transporte.",
    description:
      "Encontre profissionais para pequenas e medias mudancas residenciais, desmontagem, carregamento, transporte e entrega dos itens com planejamento por volume e distancia.",
    heroImage: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Planejamento por volume", "Ajudantes sob combinacao", "Protecao de moveis"],
    commonServices: ["Mudanca de apartamento", "Desmontagem de moveis", "Transporte de caixas", "Carga e descarga"],
    whenToHire: ["Troca de residencia", "Mudanca pequena", "Organizacao pos-mudanca", "Transporte com ajudante"],
  },
  "entrega-rapida": {
    slug: "entrega-rapida",
    title: "Entrega rapida",
    subtitle: "Coletas e entregas expressas de documentos, compras e pacotes.",
    description:
      "Contrate entregadores, motoboys e motofretes para demandas urgentes, rotas comerciais e entregas locais com atualizacao durante o trajeto.",
    heroImage: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Coleta expressa", "Entregas urbanas", "Rotas para empresas"],
    commonServices: ["Motoboy", "Motofrete", "Entrega de documentos", "Pequenos pacotes"],
    whenToHire: ["Documento urgente", "Compra local", "Entrega para cliente", "Coleta em varios pontos"],
  },
  guincho: {
    slug: "guincho",
    title: "Guincho",
    subtitle: "Remocao e apoio para carros, motos e panes emergenciais.",
    description:
      "Busque profissionais para guincho, remocao, apoio em pane, transporte de veiculos e atendimento emergencial conforme disponibilidade local.",
    heroImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento emergencial", "Remocao de veiculos", "Apoio para carros e motos"],
    commonServices: ["Guincho local", "Remocao de moto", "Pane mecanica", "Transporte de veiculo"],
    whenToHire: ["Veiculo parado", "Pane no trajeto", "Remocao para oficina", "Transporte programado"],
  },
  "marido-de-aluguel": {
    slug: "marido-de-aluguel",
    title: "Marido de aluguel",
    subtitle: "Pequenos reparos, instalacoes e manutencao domestica.",
    description:
      "Encontre profissionais versateis para resolver pendencias em casa, instalar itens, fazer ajustes, consertos simples e manutencoes preventivas.",
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Servicos variados", "Instalacoes simples", "Manutencao preventiva"],
    commonServices: ["Instalar suporte", "Ajustar portas", "Reparos simples", "Trocar pecas"],
    whenToHire: ["Lista de pequenos consertos", "Instalacoes em casa", "Manutencao antes de mudar", "Ajustes de rotina"],
  },
  limpeza: {
    slug: "limpeza",
    title: "Limpeza",
    subtitle: "Limpeza residencial, comercial, pos-obra e organizacao.",
    description:
      "Compare profissionais de limpeza para diarias, faxina pesada, limpeza pos-obra, organizacao de ambientes e rotinas domesticas sob agendamento.",
    heroImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento sob agenda", "Limpeza detalhada", "Rotina ou demanda pontual"],
    commonServices: ["Faxina residencial", "Limpeza pos-obra", "Organizacao", "Limpeza comercial"],
    whenToHire: ["Antes de receber visitas", "Apos reforma", "Mudanca de casa", "Manutencao semanal"],
  },
  beleza: {
    slug: "beleza",
    title: "Beleza",
    subtitle: "Servicos autonomos de beleza e bem-estar com atendimento local.",
    description:
      "Busque profissionais para cuidados pessoais, beleza domiciliar, atendimento por agenda e servicos especializados conforme disponibilidade.",
    heroImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Agenda flexivel", "Atendimento domiciliar", "Profissionais avaliados"],
    commonServices: ["Cabelo", "Maquiagem", "Manicure", "Bem-estar"],
    whenToHire: ["Evento especial", "Atendimento em casa", "Rotina de cuidados", "Servico com hora marcada"],
  },
  cuidados: {
    slug: "cuidados",
    title: "Cuidados",
    subtitle: "Apoio, acompanhamento e servicos de rotina com confianca.",
    description:
      "Encontre profissionais para apoio em rotinas domesticas, acompanhamento, cuidados pessoais e demandas de suporte com avaliacao e contato direto.",
    heroImage: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Apoio de rotina", "Contato direto", "Busca por localidade"],
    commonServices: ["Acompanhamento", "Apoio domestico", "Cuidados pessoais", "Servicos sob combinacao"],
    whenToHire: ["Precisa de apoio recorrente", "Organizar uma rotina", "Atendimento local", "Cuidados sob agenda"],
  },
};

export function getCategoriesWithContent(): CategoryWithContent[] {
  return publicCategories.map((category) => {
    const relatedSlugs = getRelatedCategorySlugs(category.slug);

    return {
      ...category,
      content: categoryContent[category.slug] ?? createFallbackContent(category.slug, category.name, category.description),
      workers: workers.filter((worker) => worker.categories.some((workerCategory) => relatedSlugs.includes(workerCategory))),
    };
  });
}

export function getCategoryWithContent(slug: string) {
  return getCategoriesWithContent().find((category) => category.slug === slug);
}

function createFallbackContent(slug: string, name: string, description: string): CategoryPageContent {
  return {
    slug,
    title: name,
    subtitle: description,
    description,
    heroImage: fallbackHeroImage,
    highlights: ["Profissionais avaliados", "Orcamento direto", "Atendimento local"],
    commonServices: ["Atendimento sob consulta", "Diagnostico", "Execucao do servico"],
    whenToHire: ["Quando precisar comparar profissionais", "Quando quiser solicitar orcamento", "Quando buscar atendimento local"],
  };
}

function getRelatedCategorySlugs(slug: string) {
  const category = publicCategories.find((item) => item.slug === slug);
  const childSlugs = publicCategories.filter((item) => item.parentSlug === slug).map((item) => item.slug);

  return Array.from(new Set([slug, ...(category?.subcategories ?? []), ...childSlugs]));
}
