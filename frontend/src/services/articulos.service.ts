import api from "./api";
import type { MenuItem } from "../core/types";
import { resolveCartaByCategory } from "../core/utils/categoryOrder";
import { reportMetric } from "../core/utils/metrics";

interface BackendArticulo {
  id: number | string;
  categoria: string;
  articulo: string;
  precio: number | string;
  disponibilidad: "HABILITADO" | "DESHABILITADO";
  tipo_carta?: string | null;
}

interface BackendArticulosResponse {
  success: boolean;
  data: BackendArticulo[];
}

let articulosCache: MenuItem[] | null = null;
let articulosRequest: Promise<MenuItem[]> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;

const toNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapArticulos = (items: BackendArticulo[]): MenuItem[] => {
  return items
    .filter((item) => item.disponibilidad === "HABILITADO")
    .map((item) => {
      const clasificacion = item.categoria || "Sin categoria";
      return {
        carta: item.tipo_carta || resolveCartaByCategory(clasificacion) || "RESTAURANT",
        clasificacion,
        "nombre largo": item.articulo,
        monto: toNumber(item.precio),
        "monto individual": null,
        "apto vegano": null,
        "info producto": null,
      };
    });
};

export const getArticulos = async (): Promise<MenuItem[]> => {
  const now = Date.now();
  const cacheAge = now - cacheTimestamp;
  if (articulosCache && cacheAge < CACHE_TTL_MS) {
    reportMetric("articulos_cache_hit", cacheAge, { stale: false });
    return articulosCache;
  }
  if (articulosCache && cacheAge >= CACHE_TTL_MS) {
    articulosCache = null;
    cacheTimestamp = 0;
  }

  if (!articulosRequest) {
    const fetchStartedAt = performance.now();
    articulosRequest = api
      .get<BackendArticulosResponse>("/articulos")
      .then((response) => {
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error("Respuesta invalida de /api/v1/articulos");
        }

        const mapped = mapArticulos(response.data.data);
        articulosCache = mapped;
        cacheTimestamp = Date.now();
        reportMetric("articulos_fetch_ms", Math.round(performance.now() - fetchStartedAt), {
          items: mapped.length,
        });
        return mapped;
      })
      .catch((error) => {
        articulosRequest = null;
        reportMetric("articulos_fetch_error", "network_or_parse");
        throw error;
      })
      .finally(() => {
        articulosRequest = null;
      });
  }

  return articulosRequest;
};

export const prefetchArticulos = (): Promise<MenuItem[]> => {
  return getArticulos().catch(() => []);
};

export const invalidateArticulosCache = () => {
  articulosCache = null;
  cacheTimestamp = 0;
  articulosRequest = null;
};
