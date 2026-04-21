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
    "Mostre servicos reais executados por voce.",
    "Inclua fotos claras do resultado final.",
    "Adicione contexto do ambiente, ferramenta ou etapa do servico.",
  ],
};

const ruleMap: Record<string, CategoryVerificationRule> = {
  reformas: {
    title: "Obra, reforma e campo",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: true,
    evidenceGuidance: [
      "Use fotos de obra real, antes e depois, ou etapas relevantes.",
      "Quando possivel, inclua pelo menos uma imagem sua no local ou ao lado do resultado.",
      "Mostre acabamento, instalacao ou execucao final.",
    ],
  },
  eletricista: {
    title: "Servico tecnico em campo",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: true,
    evidenceGuidance: [
      "Mostre instalacoes, manutencoes ou correcoes reais.",
      "Quando aplicavel, inclua voce no ambiente de trabalho.",
      "Evite imagens genericas sem relacao com o servico.",
    ],
  },
  frete: {
    title: "Transporte e frete",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Inclua veiculo, carga, acondicionamento ou entrega concluida.",
      "Mostre contexto do servico real sem expor dados sensiveis de terceiros.",
      "Vale combinar veiculo, equipamento e resultado da entrega.",
    ],
  },
  motoboy: {
    title: "Entrega e deslocamento",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Mostre moto, bolsa de entrega, equipamento ou contexto do trabalho.",
      "Use imagens reais de operacao, sem expor dados privados.",
      "Fotos de equipamento e servico concluido ajudam na analise.",
    ],
  },
  beleza: {
    title: "Resultado e portfolio visual",
    minimumPortfolioImages: 3,
    recommendWorkerOnSiteImage: false,
    evidenceGuidance: [
      "Inclua resultados reais do trabalho realizado.",
      "Antes e depois ou sequencias de processo ajudam na verificacao.",
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
