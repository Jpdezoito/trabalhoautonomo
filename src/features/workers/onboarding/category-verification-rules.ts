export type CategoryVerificationRule = {
  title: string;
  minimumPortfolioImages: number;
  recommendWorkerOnSiteImage: boolean;
  evidenceGuidance: string[];
};

const defaultRule: CategoryVerificationRule = {
  title: "Prova de atividade",
  minimumPortfolioImages: 3,
  recommendWorkerOnSiteImage: false,
  evidenceGuidance: [
    "Mostre serviços reais executados por você.",
    "Inclua fotos claras do resultado final.",
    "Adicione contexto do ambiente, ferramenta ou etapa do serviço.",
  ],
};

const ruleMap: Record<string, CategoryVerificationRule> = {
  reformas: {
    title: "Obra, reforma e campo",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: true,
    evidenceGuidance: [
      "Use fotos de obra real, antes e depois, ou etapas relevantes.",
      "Quando possível, inclua pelo menos uma imagem sua no local ou ao lado do resultado.",
      "Mostre acabamento, instalacao ou execução final.",
    ],
  },
  eletricista: {
    title: "Serviço técnico em campo",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: true,
    evidenceGuidance: [
      "Mostre instalações, manutencoes ou correcoes reais.",
      "Quando aplicável, inclua você no ambiente de trabalho.",
      "Evite imagens genéricas sem relação com o serviço.",
    ],
  },
  frete: {
    title: "Transporte e frete",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Inclua veiculo, carga, acondicionamento ou entrega concluida.",
      "Mostre contexto do serviço real sem expor dados sensíveis de terceiros.",
      "Vale combinar veiculo, equipamento e resultado da entrega.",
    ],
  },
  motoboy: {
    title: "Entrega e deslocamento",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Mostre moto, bolsa de entrega, equipamento ou contexto do trabalho.",
      "Use imagens reais de operação, sem expor dados privados.",
      "Fotos de equipamento e serviço concluído ajudam na análise.",
    ],
  },
  beleza: {
    title: "Resultado e portfólio visual",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Inclua resultados reais do trabalho realizado.",
      "Antes e depois ou sequências de processo ajudam na verificação.",
      "Mostre variedade de resultado sem usar imagens promocionais genéricas.",
    ],
  },
};

export function getCategoryVerificationRule(categorySlug?: string) {
  if (!categorySlug) {
    return defaultRule;
  }

  const directRule = ruleMap[categorySlug];

  if (directRule) {
    return directRule;
  }

  const matchedRule = Object.entries(ruleMap).find(([key]) => categorySlug.includes(key));

  return matchedRule?.[1] ?? defaultRule;
}
