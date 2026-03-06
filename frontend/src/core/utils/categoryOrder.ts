export type SupportedCarta = "RESTAURANT" | "BEBIDAS PREMIUM";

export type KnownCarta =
  | SupportedCarta
  | "POSTRES & CAFE"
  | "PROMOCIONES";

export type KnownCategory =
  | "PIZZA Y EMPANADA"
  | "PIZZAYEMPANADA"
  | "SANDWICHERIA"
  | "SNACK"
  | "BEBIDAS SIN ALCOHOL"
  | "CERVEZA"
  | "COCTELERIA"
  | "ESPUMANTES"
  | "GIN"
  | "VINOS"
  | "WISHKY"
  | "WHISKY"
  | "CAFETERIA"
  | "POSTRE"
  | "PROMO"
  | "PROMOCIONES"
  | "PROMO LUNES"
  | "PROMO MARTES"
  | "PROMO MIERCOLES"
  | "PROMO JUEVES Y DOMINGO";

const CARTA_BY_CATEGORY: Record<KnownCategory, KnownCarta> = {
  "PIZZA Y EMPANADA": "RESTAURANT",
  PIZZAYEMPANADA: "RESTAURANT",
  SANDWICHERIA: "RESTAURANT",
  SNACK: "RESTAURANT",
  "BEBIDAS SIN ALCOHOL": "RESTAURANT",
  CERVEZA: "RESTAURANT",
  COCTELERIA: "BEBIDAS PREMIUM",
  ESPUMANTES: "BEBIDAS PREMIUM",
  GIN: "BEBIDAS PREMIUM",
  VINOS: "BEBIDAS PREMIUM",
  WISHKY: "BEBIDAS PREMIUM",
  WHISKY: "BEBIDAS PREMIUM",
  CAFETERIA: "POSTRES & CAFE",
  POSTRE: "POSTRES & CAFE",
  PROMO: "PROMOCIONES",
  PROMOCIONES: "PROMOCIONES",
  "PROMO LUNES": "PROMOCIONES",
  "PROMO MARTES": "PROMOCIONES",
  "PROMO MIERCOLES": "PROMOCIONES",
  "PROMO JUEVES Y DOMINGO": "PROMOCIONES",
};

const ORDER_BY_CARTA: Record<SupportedCarta, string[]> = {
  RESTAURANT: [
    "PIZZAYEMPANADA",
    "SANDWICHERIA",
    "BEBIDASSINALCOHOL",
    "CERVEZA",
    "SNACK",
  ],
  "BEBIDAS PREMIUM": [
    "VINOS",
    "WISHKY",
    "COCTELERIA",
    "GIN",
    "ESPUMANTES",
  ],
};

const normalizeCategoryKey = (value: string): string => {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "");
};

const ORDER_INDEX_BY_CARTA: Record<SupportedCarta, Map<string, number>> = {
  RESTAURANT: new Map(
    ORDER_BY_CARTA.RESTAURANT.map((category, index) => [category, index]),
  ),
  "BEBIDAS PREMIUM": new Map(
    ORDER_BY_CARTA["BEBIDAS PREMIUM"].map((category, index) => [category, index]),
  ),
};

const getSupportedCarta = (
  carta: string | undefined,
): SupportedCarta | undefined => {
  if (carta === "RESTAURANT" || carta === "BEBIDAS PREMIUM") {
    return carta;
  }
  return undefined;
};

export const resolveCartaByCategory = (
  category: string,
): KnownCarta | undefined => {
  const normalizedInput = normalizeCategoryKey(category);
  const foundEntry = Object.entries(CARTA_BY_CATEGORY).find(
    ([key]) => normalizeCategoryKey(key) === normalizedInput,
  );
  return foundEntry?.[1];
};

export const getCategoryOrder = (
  carta: string | undefined,
  category: string,
): number => {
  const supportedCarta = getSupportedCarta(carta);
  if (!supportedCarta) return Number.MAX_SAFE_INTEGER;
  return (
    ORDER_INDEX_BY_CARTA[supportedCarta].get(normalizeCategoryKey(category)) ??
    Number.MAX_SAFE_INTEGER
  );
};

export const sortCategoriesForCarta = (
  carta: string | undefined,
  categories: string[],
): string[] => {
  const supportedCarta = getSupportedCarta(carta);
  if (!supportedCarta) return categories;
  return [...categories].sort(
    (a, b) => getCategoryOrder(supportedCarta, a) - getCategoryOrder(supportedCarta, b),
  );
};

export const sortItemsForCarta = <T extends { clasificacion: string; "nombre largo": string }>(
  carta: string | undefined,
  items: T[],
): T[] => {
  const supportedCarta = getSupportedCarta(carta);
  if (!supportedCarta) return items;

  return [...items].sort((a, b) => {
    const categoryOrderDiff =
      getCategoryOrder(supportedCarta, a.clasificacion) -
      getCategoryOrder(supportedCarta, b.clasificacion);

    if (categoryOrderDiff !== 0) {
      return categoryOrderDiff;
    }

    return a["nombre largo"].localeCompare(b["nombre largo"], "es", {
      sensitivity: "base",
    });
  });
};
