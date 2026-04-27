import type { Worker } from "@/types/marketplace";

type QuotePricingInput = {
  serviceType: string;
  description: string;
  city?: string;
  neighborhood?: string;
  worker?: Worker;
  workerStartingPrice?: string | null;
};

export type QuotePricingEstimate = {
  min: number;
  max: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  professionalNetMin: number;
  professionalNetMax: number;
  confidence: "baixa" | "media" | "alta";
  factors: string[];
};

const platformFeePercent = 5;

const serviceBasePrices = [
  { pattern: /quadro|energia|eletric|tomada|chuveiro|ilumin/i, min: 120, max: 420, label: "servico eletrico residencial" },
  { pattern: /banheiro|reforma|piso|revest|gesso|pintura/i, min: 450, max: 2400, label: "reforma ou acabamento" },
  { pattern: /vazamento|encan|hidraul|registro|caixa/i, min: 140, max: 580, label: "reparo hidraulico" },
  { pattern: /frete|carreto|mudanca|transporte|sofa|rack|geladeira/i, min: 120, max: 520, label: "transporte local" },
  { pattern: /entrega|motoboy|motofrete|documento|pacote/i, min: 25, max: 95, label: "entrega rapida" },
  { pattern: /limpeza|diaria|organizacao|faxina/i, min: 160, max: 360, label: "limpeza residencial" },
];

export function estimateQuotePrice(input: QuotePricingInput): QuotePricingEstimate {
  const text = `${input.serviceType} ${input.description}`.toLowerCase();
  const matched = serviceBasePrices.find((item) => item.pattern.test(text));
  const startingPrice = parseStartingPrice(input.worker?.startingPrice ?? input.workerStartingPrice);
  const factors: string[] = [];

  let min = matched?.min ?? 120;
  let max = matched?.max ?? 500;

  if (matched) {
    factors.push(`base por ${matched.label}`);
  } else {
    factors.push("base generica por servico local");
  }

  if (startingPrice) {
    min = Math.max(min, Math.round(startingPrice * 0.9));
    max = Math.max(max, Math.round(startingPrice * 1.8));
    factors.push("preco inicial do profissional");
  }

  if (/urgente|hoje|agora|emergencia|emergencial/i.test(text)) {
    min = Math.round(min * 1.25);
    max = Math.round(max * 1.35);
    factors.push("urgencia informada");
  }

  if (/apartamento|condominio|portaria|predial/i.test(text)) {
    max = Math.round(max * 1.12);
    factors.push("complexidade de acesso/condominio");
  }

  if (/material|peca|comprar|fornecer/i.test(text)) {
    max = Math.round(max * 1.2);
    factors.push("possivel inclusao de materiais");
  }

  if (input.neighborhood && input.worker?.areas.includes(input.neighborhood)) {
    factors.push("bairro dentro da area atendida");
  }

  const feeBasis = Math.round((min + max) / 2);
  const platformFeeAmount = roundCurrency(feeBasis * (platformFeePercent / 100));
  const professionalNetMin = roundCurrency(min * (1 - platformFeePercent / 100));
  const professionalNetMax = roundCurrency(max * (1 - platformFeePercent / 100));

  return {
    min: roundCurrency(min),
    max: roundCurrency(max),
    platformFeePercent,
    platformFeeAmount,
    professionalNetMin,
    professionalNetMax,
    confidence: factors.length >= 3 ? "alta" : factors.length === 2 ? "media" : "baixa",
    factors,
  };
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function parseStartingPrice(value?: string | null) {
  const amount = value?.match(/R\$\s?(\d+(?:[.,]\d+)?)/i)?.[1];

  return amount ? Number(amount.replace(".", "").replace(",", ".")) : null;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}
