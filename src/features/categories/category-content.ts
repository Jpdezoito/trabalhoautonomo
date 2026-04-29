import { publicCategories, workers } from "@/lib/marketplace-data";
import type { CategoryPageContent, CategoryWithContent } from "@/features/categories/types";

const fallbackHeroImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=85";

export const categoryContent: Record<string, CategoryPageContent> = {
  eletricistas: {
    slug: "eletricistas",
    title: "Eletricistas",
    subtitle: "Instalações, manutenção e emergências elétricas com segurança.",
    description:
      "Encontre eletricistas para quadros de energia, tomadas, iluminação, revisões preventivas e atendimento emergencial em residências, condomínios e pequenos comércios.",
    heroImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento residencial e predial", "Diagnóstico de falhas", "Instalações com garantia"],
    commonServices: ["Troca de disjuntores", "Instalação de tomadas", "Iluminação planejada", "Revisão de quadro elétrico"],
    whenToHire: ["Quedas frequentes de energia", "Tomadas aquecendo", "Instalação de novos pontos", "Modernização elétrica"],
  },
  encanadores: {
    slug: "encanadores",
    title: "Encanadores",
    subtitle: "Reparos hidráulicos, vazamentos e manutenção preventiva.",
    description:
      "Contrate encanadores para identificar vazamentos, trocar registros, resolver problemas em caixas acopladas, instalar pressurizadores e cuidar da rede hidráulica.",
    heroImage: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Caça-vazamento", "Reparos localizados", "Atendimento para condomínios"],
    commonServices: ["Vazamentos", "Caixa acoplada", "Troca de registros", "Pressurizador"],
    whenToHire: ["Conta de água alta", "Infiltração aparente", "Baixa pressão", "Banheiro com vazamento"],
  },
  mecanicos: {
    slug: "mecanicos",
    title: "Mecânicos",
    subtitle: "Diagnóstico, revisão e manutenção automotiva local.",
    description:
      "Encontre mecânicos para revisões, freios, suspensão, diagnóstico, troca de peças e atendimento local conforme disponibilidade.",
    heroImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Diagnóstico claro", "Manutenção preventiva", "Atendimento local"],
    commonServices: ["Revisão geral", "Freios", "Suspensão", "Diagnóstico eletrônico"],
    whenToHire: ["Barulhos incomuns", "Luz de alerta no painel", "Revisão antes de viagem", "Troca de componentes"],
  },
  pedreiros: {
    slug: "pedreiros",
    title: "Pedreiros",
    subtitle: "Obras, alvenaria, pisos, reboco e pequenas reformas.",
    description:
      "Compare pedreiros para obras residenciais, ajustes estruturais, revestimentos, reparos e etapas de reforma com escopo definido.",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Pequenas e médias obras", "Revestimentos", "Acabamento organizado"],
    commonServices: ["Assentamento de piso", "Reboco", "Alvenaria", "Contrapiso"],
    whenToHire: ["Reforma de ambiente", "Correções em parede", "Instalação de revestimento", "Adequações de obra"],
  },
  pintores: {
    slug: "pintores",
    title: "Pintores",
    subtitle: "Pintura residencial, comercial, textura e acabamento fino.",
    description:
      "Encontre pintores para renovação de ambientes, pintura interna e externa, texturas, reparos de parede e acabamento final.",
    heroImage: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Acabamento limpo", "Pintura interna e externa", "Preparação de superfície"],
    commonServices: ["Pintura de apartamento", "Textura", "Massa corrida", "Pintura comercial"],
    whenToHire: ["Renovar o imóvel", "Corrigir manchas", "Preparar para entrega", "Finalizar reforma"],
  },
  montadores: {
    slug: "montadores",
    title: "Montadores",
    subtitle: "Montagem de móveis, ajustes, painéis e instalações leves.",
    description:
      "Contrate montadores para guarda-roupas, painéis, móveis planejados, ajustes de portas, instalação de prateleiras e acabamento.",
    heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Montagem cuidadosa", "Ajustes finos", "Ferramentas adequadas"],
    commonServices: ["Guarda-roupa", "Painel de TV", "Prateleiras", "Móveis planejados"],
    whenToHire: ["Móveis novos", "Mudança de casa", "Ajuste de portas", "Instalação de painéis"],
  },
  reformas: {
    slug: "reformas",
    title: "Reformas",
    subtitle: "Renovação de ambientes com cronograma e equipes especializadas.",
    description:
      "Encontre profissionais para reforma de banheiro, cozinha, sala, ambientes comerciais e renovações completas com planejamento.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Cronograma definido", "Equipe coordenada", "Acabamento de qualidade"],
    commonServices: ["Reforma de banheiro", "Reforma de cozinha", "Pisos", "Gesso e pintura"],
    whenToHire: ["Renovar ambientes", "Melhorar valorização", "Corrigir problemas antigos", "Integrar espaços"],
  },
  tecnicos: {
    slug: "tecnicos",
    title: "Técnicos",
    subtitle: "Assistência para eletrodomésticos, ar-condicionado e equipamentos.",
    description:
      "Busque técnicos para manutenção, instalação e reparo de eletrodomésticos, máquinas, ar-condicionado e equipamentos residenciais.",
    heroImage: "https://images.unsplash.com/photo-1581091215367-59ab6b7d9c67?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Diagnóstico técnico", "Manutenção preventiva", "Reparo especializado"],
    commonServices: ["Ar-condicionado", "Máquina de lavar", "Geladeira", "Assistência técnica"],
    whenToHire: ["Equipamento com falha", "Instalação nova", "Manutenção periódica", "Ruído ou baixo desempenho"],
  },
  frete: {
    slug: "frete",
    title: "Frete",
    subtitle: "Transporte local para móveis, volumes, compras e cargas leves.",
    description:
      "Compare profissionais para fretes, carretos, pequenas retiradas e transporte de itens avulsos com combinação clara de horários, ajudantes e cuidados no trajeto.",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Retirada e entrega local", "Transporte com proteção", "Agendamento flexível"],
    commonServices: ["Carreto", "Transporte de móveis", "Pequenos transportes", "Transporte de eletrodomésticos"],
    whenToHire: ["Comprar um item grande", "Transportar móveis avulsos", "Retirar mercadorias", "Levar caixas e volumes"],
  },
  carreto: {
    slug: "carreto",
    title: "Carreto",
    subtitle: "Carretos rápidos para pequenas cargas, compras e retiradas.",
    description:
      "Encontre profissionais para carretos locais, retirada de compras, transporte de volumes e pequenas cargas com horário combinado e cuidado no trajeto.",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Retirada local", "Pequenas cargas", "Agendamento flexível"],
    commonServices: ["Retirada de compras", "Transporte de caixas", "Carreto para móveis pequenos", "Entrega local"],
    whenToHire: ["Comprou um item grande", "Precisa retirar mercadoria", "Tem poucos volumes", "Quer combinar horário direto"],
  },
  "mudanca-residencial": {
    slug: "mudanca-residencial",
    title: "Mudança residencial",
    subtitle: "Mudanças de casas e apartamentos com apoio no transporte.",
    description:
      "Encontre profissionais para pequenas e médias mudanças residenciais, desmontagem, carregamento, transporte e entrega dos itens com planejamento por volume e distância.",
    heroImage: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Planejamento por volume", "Ajudantes sob combinação", "Proteção de móveis"],
    commonServices: ["Mudança de apartamento", "Desmontagem de móveis", "Transporte de caixas", "Carga e descarga"],
    whenToHire: ["Troca de residência", "Mudança pequena", "Organização pós-mudança", "Transporte com ajudante"],
  },
  "entrega-rapida": {
    slug: "entrega-rapida",
    title: "Entrega rápida",
    subtitle: "Coletas e entregas expressas de documentos, compras e pacotes.",
    description:
      "Contrate entregadores, motoboys e motofretes para demandas urgentes, rotas comerciais e entregas locais com atualização durante o trajeto.",
    heroImage: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Coleta expressa", "Entregas urbanas", "Rotas para empresas"],
    commonServices: ["Motoboy", "Motofrete", "Entrega de documentos", "Pequenos pacotes"],
    whenToHire: ["Documento urgente", "Compra local", "Entrega para cliente", "Coleta em vários pontos"],
  },
  guincho: {
    slug: "guincho",
    title: "Guincho",
    subtitle: "Remoção e apoio para carros, motos e panes emergenciais.",
    description:
      "Busque profissionais para guincho, remoção, apoio em pane, transporte de veículos e atendimento emergencial conforme disponibilidade local.",
    heroImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento emergencial", "Remoção de veículos", "Apoio para carros e motos"],
    commonServices: ["Guincho local", "Remoção de moto", "Pane mecânica", "Transporte de veículo"],
    whenToHire: ["Veículo parado", "Pane no trajeto", "Remoção para oficina", "Transporte programado"],
  },
  "marido-de-aluguel": {
    slug: "marido-de-aluguel",
    title: "Marido de aluguel",
    subtitle: "Pequenos reparos, instalações e manutenção doméstica.",
    description:
      "Encontre profissionais versáteis para resolver pendências em casa, instalar itens, fazer ajustes, consertos simples e manutenções preventivas.",
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Serviços variados", "Instalações simples", "Manutenção preventiva"],
    commonServices: ["Instalar suporte", "Ajustar portas", "Reparos simples", "Trocar peças"],
    whenToHire: ["Lista de pequenos consertos", "Instalações em casa", "Manutenção antes de mudar", "Ajustes de rotina"],
  },
  limpeza: {
    slug: "limpeza",
    title: "Limpeza",
    subtitle: "Limpeza residencial, comercial, pós-obra e organização.",
    description:
      "Compare profissionais de limpeza para diárias, faxina pesada, limpeza pós-obra, organização de ambientes e rotinas domésticas sob agendamento.",
    heroImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Atendimento sob agenda", "Limpeza detalhada", "Rotina ou demanda pontual"],
    commonServices: ["Faxina residencial", "Limpeza pós-obra", "Organização", "Limpeza comercial"],
    whenToHire: ["Antes de receber visitas", "Após reforma", "Mudança de casa", "Manutenção semanal"],
  },
  beleza: {
    slug: "beleza",
    title: "Beleza",
    subtitle: "Serviços autônomos de beleza e bem-estar com atendimento local.",
    description:
      "Busque profissionais para cuidados pessoais, beleza domiciliar, atendimento por agenda e serviços especializados conforme disponibilidade.",
    heroImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Agenda flexível", "Atendimento domiciliar", "Profissionais avaliados"],
    commonServices: ["Cabelo", "Maquiagem", "Manicure", "Bem-estar"],
    whenToHire: ["Evento especial", "Atendimento em casa", "Rotina de cuidados", "Serviço com hora marcada"],
  },
  cuidados: {
    slug: "cuidados",
    title: "Cuidados",
    subtitle: "Apoio, acompanhamento e serviços de rotina com confiança.",
    description:
      "Encontre profissionais para apoio em rotinas domésticas, acompanhamento, cuidados pessoais e demandas de suporte com avaliação e contato direto.",
    heroImage: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1800&q=85",
    highlights: ["Apoio de rotina", "Contato direto", "Busca por localidade"],
    commonServices: ["Acompanhamento", "Apoio doméstico", "Cuidados pessoais", "Serviços sob combinação"],
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
    highlights: ["Profissionais avaliados", "Orçamento direto", "Atendimento local"],
    commonServices: ["Atendimento sob consulta", "Diagnóstico", "Execução do serviço"],
    whenToHire: ["Quando precisar comparar profissionais", "Quando quiser solicitar orçamento", "Quando buscar atendimento local"],
  };
}

function getRelatedCategorySlugs(slug: string) {
  const category = publicCategories.find((item) => item.slug === slug);
  const childSlugs = publicCategories.filter((item) => item.parentSlug === slug).map((item) => item.slug);

  return Array.from(new Set([slug, ...(category?.subcategories ?? []), ...childSlugs]));
}
