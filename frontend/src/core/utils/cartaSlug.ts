const KNOWN_CARTAS = [
  "RESTAURANT",
  "PROMOCIONES",
  "BEBIDAS PREMIUM",
  "POSTRES & CAFE",
] as const;

export type KnownCartaValue = (typeof KNOWN_CARTAS)[number];

const normalizeForSlug = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const SLUG_TO_CARTA: Record<string, KnownCartaValue> = KNOWN_CARTAS.reduce(
  (acc, carta) => {
    acc[normalizeForSlug(carta)] = carta;
    return acc;
  },
  {} as Record<string, KnownCartaValue>,
);

export const toCartaSlug = (value: string): string => normalizeForSlug(value);

export const resolveCartaFromRoute = (
  routeValue: string | undefined,
): KnownCartaValue | undefined => {
  if (!routeValue) return undefined;

  const decoded = decodeURIComponent(routeValue);
  const normalizedSlug = normalizeForSlug(decoded);
  const bySlug = SLUG_TO_CARTA[normalizedSlug];
  if (bySlug) return bySlug;

  const byLegacyUpper = KNOWN_CARTAS.find(
    (carta) => carta.toUpperCase() === decoded.toUpperCase(),
  );
  return byLegacyUpper;
};

export const getCanonicalCategoryPath = (routeValue: string | undefined): string => {
  const resolved = resolveCartaFromRoute(routeValue);
  if (!resolved) return "/";
  return `/${toCartaSlug(resolved)}`;
};
