import type { SearchFilters, SearchResultWorker } from "@/features/search/types";
import type { Worker } from "@/types/marketplace";

function normalize(value?: string) {
  return value?.trim().toLowerCase();
}

export function filterWorkers(workers: Worker[], filters: SearchFilters) {
  const keyword = normalize(filters.keyword);
  const service = normalize(filters.service);
  const category = normalize(filters.category);
  const city = normalize(filters.city);
  const neighborhood = normalize(filters.neighborhood);

  const results: SearchResultWorker[] = workers.map((worker) => ({
    worker,
    priceAmount: getWorkerStartingPriceAmount(worker),
  }));

  return results.filter(({ worker, priceAmount }) => {
    const searchableContent = [
      worker.name,
      worker.role,
      worker.headline,
      worker.bio,
      worker.city,
      worker.neighborhood,
      worker.startingPrice,
      ...worker.services,
      ...worker.categories,
      ...worker.areas,
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = !keyword || searchableContent.includes(keyword);
    const matchesService =
      !service ||
      worker.categories.some((category) => category.includes(service)) ||
      worker.services.some((item) => item.toLowerCase().includes(service)) ||
      worker.role.toLowerCase().includes(service);
    const matchesCategory = !category || worker.categories.some((item) => item.includes(category));

    const matchesCity = !city || worker.city.toLowerCase().includes(city);
    const matchesNeighborhood =
      !neighborhood ||
      worker.neighborhood.toLowerCase().includes(neighborhood) ||
      worker.areas.some((area) => area.toLowerCase().includes(neighborhood));
    const matchesVerification = !filters.verifiedOnly || worker.verified;
    const matchesAvailability = !filters.availableOnly || worker.available;
    const matchesRating = !filters.minimumRating || worker.rating >= filters.minimumRating;
    const matchesMinPrice = filters.minPrice === undefined || priceAmount >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === undefined || priceAmount <= filters.maxPrice;
    const matchesPortfolio = !filters.withPortfolio || worker.portfolio.length > 0;

    return (
      matchesKeyword &&
      matchesService &&
      matchesCategory &&
      matchesCity &&
      matchesNeighborhood &&
      matchesVerification &&
      matchesAvailability &&
      matchesRating &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesPortfolio
    );
  }).sort((a, b) => sortSearchResults(a, b, filters.sortBy));
}

export function getWorkerStartingPriceAmount(worker: Worker) {
  const explicitAmount = worker.startingPrice.match(/R\$\s?(\d+(?:[.,]\d+)?)/i)?.[1];

  if (explicitAmount) {
    return Number(explicitAmount.replace(".", "").replace(",", "."));
  }

  if (worker.startingPrice.toLowerCase().includes("sob visita")) {
    return 300;
  }

  return 150;
}

function sortSearchResults(a: SearchResultWorker, b: SearchResultWorker, sortBy: SearchFilters["sortBy"] = "relevance") {
  const availabilityOrder = Number(b.worker.available) - Number(a.worker.available);

  if (availabilityOrder !== 0) {
    return availabilityOrder;
  }

  switch (sortBy) {
    case "rating":
      return b.worker.rating - a.worker.rating || b.worker.reviewsCount - a.worker.reviewsCount;
    case "price_asc":
      return a.priceAmount - b.priceAmount;
    case "price_desc":
      return b.priceAmount - a.priceAmount;
    case "response_time":
      return getResponseScore(a.worker.responseTime) - getResponseScore(b.worker.responseTime);
    case "experience":
      return b.worker.yearsExperience - a.worker.yearsExperience;
    case "relevance":
    default:
      return getPlanScore(b.worker.plan) - getPlanScore(a.worker.plan) || Number(b.worker.verified) - Number(a.worker.verified) || b.worker.rating - a.worker.rating;
  }
}

function getPlanScore(plan: Worker["plan"]) {
  if (plan === "DESTAQUE") return 3;
  if (plan === "PRO") return 2;

  return 1;
}

function getResponseScore(responseTime: string) {
  const text = responseTime.toLowerCase();

  if (text.includes("20 min")) return 20;
  if (text.includes("1 h")) return 60;
  if (text.includes("hoje")) return 240;

  return 999;
}
