import api, { DATA_SOURCE } from "./api";
import dataMock from "../core/mock/data.mock";

export interface BackendProducto {
  id: string;
  nombre: string;
  id_categoria: string | number;
  categoria_nombre: string | null;
  tipo: string;
  precio_venta: string | number;
  costo: string | number;
  unidad_medida: string;
  estado: "Activo" | "Inactivo";
  created_at: string;
  updated_at: string;
  url_image: string | null;
  URL_IMAGE?: string | null;
}

interface BackendProductosResponse {
  success: boolean;
  data: BackendProducto[];
}

export interface ProductoMapeado {
  carta: string;
  clasificacion: string;
  "nombre largo": string;
  monto: number;
  "monto individual": number | null;
  "apto vegano": boolean | null | string;
  "info producto": string | null;
  url_image: string | null;
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isStringOrNumber = (value: unknown): value is string | number => {
  return typeof value === "string" || typeof value === "number";
};

const asBackendProducto = (
  value: unknown,
  index: number,
  source: string,
): BackendProducto => {
  if (!isObjectRecord(value)) {
    throw new Error(`${source}: item ${index} is not an object`);
  }

  const requiredStringFields = [
    "id",
    "nombre",
    "tipo",
    "unidad_medida",
    "created_at",
    "updated_at",
  ] as const;

  for (const field of requiredStringFields) {
    if (typeof value[field] !== "string") {
      throw new Error(`${source}: invalid field '${field}' at item ${index}`);
    }
  }

  if (!isStringOrNumber(value.id_categoria)) {
    throw new Error(`${source}: invalid field 'id_categoria' at item ${index}`);
  }

  if (!isStringOrNumber(value.precio_venta)) {
    throw new Error(`${source}: invalid field 'precio_venta' at item ${index}`);
  }

  if (!isStringOrNumber(value.costo)) {
    throw new Error(`${source}: invalid field 'costo' at item ${index}`);
  }

  const estado = value.estado;
  if (estado !== "Activo" && estado !== "Inactivo") {
    throw new Error(`${source}: invalid field 'estado' at item ${index}`);
  }

  const categoriaNombre = value.categoria_nombre;
  if (categoriaNombre !== null && typeof categoriaNombre !== "string") {
    throw new Error(`${source}: invalid field 'categoria_nombre' at item ${index}`);
  }

  const urlImage = value.url_image;
  if (urlImage !== null && typeof urlImage !== "string") {
    throw new Error(`${source}: invalid field 'url_image' at item ${index}`);
  }

  const uppercaseUrlImage = value.URL_IMAGE;
  if (
    uppercaseUrlImage !== undefined &&
    uppercaseUrlImage !== null &&
    typeof uppercaseUrlImage !== "string"
  ) {
    throw new Error(`${source}: invalid field 'URL_IMAGE' at item ${index}`);
  }

  return {
    id: value.id as string,
    nombre: value.nombre as string,
    id_categoria: value.id_categoria,
    categoria_nombre: categoriaNombre,
    tipo: value.tipo as string,
    precio_venta: value.precio_venta,
    costo: value.costo,
    unidad_medida: value.unidad_medida as string,
    estado,
    created_at: value.created_at as string,
    updated_at: value.updated_at as string,
    url_image: urlImage,
    URL_IMAGE: uppercaseUrlImage as string | null | undefined,
  };
};

const parseBackendProductosPayload = (
  payload: unknown,
  source: string,
): BackendProducto[] => {
  if (!isObjectRecord(payload)) {
    throw new Error(`${source}: payload is not an object`);
  }

  if (!Array.isArray(payload.data)) {
    throw new Error(`${source}: payload.data is not an array`);
  }

  return payload.data.map((item, index) => asBackendProducto(item, index, source));
};

const sanitizeDriveUrl = (url: string | null): string | null => {
  if (!url) return null;
  // Keep the original source URL to avoid unexpected provider-side format changes.
  return url;
};

const CARTA_MAPPING: Record<string, string> = {
  "PIZZA Y EMPANADA": "RESTAURANT",
  SANDWICHERIA: "RESTAURANT",
  SNACK: "RESTAURANT",
  "BEBIDAS SIN ALCOHOL": "RESTAURANT",
  CERVEZA: "RESTAURANT",
  COCTELERIA: "BEBIDAS PREMIUM",
  ESPUMANTES: "BEBIDAS PREMIUM",
  GIN: "BEBIDAS PREMIUM",
  VINOS: "BEBIDAS PREMIUM",
  WISHKY: "BEBIDAS PREMIUM",
  CAFETERIA: "POSTRES & CAFE",
  POSTRE: "POSTRES & CAFE",
  PROMO: "PROMOCIONES",
  PROMOCIONES: "PROMOCIONES",
  "PROMO LUNES": "PROMOCIONES",
  "PROMO MARTES": "PROMOCIONES",
  "PROMO MIERCOLES": "PROMOCIONES",
  "PROMO JUEVES Y DOMINGO": "PROMOCIONES",
};

const toNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapProductos = (productos: BackendProducto[]): ProductoMapeado[] => {
  return productos
    .filter((item) => item.estado === "Activo")
    .map((item) => {
      const rawCategory = item.categoria_nombre || "Sin categoria";
      return {
        carta: CARTA_MAPPING[rawCategory] || "RESTAURANT",
        clasificacion: rawCategory,
        "nombre largo": item.nombre,
        monto: toNumber(item.precio_venta),
        "monto individual": null,
        "apto vegano": null,
        "info producto": null,
        url_image: sanitizeDriveUrl(item.url_image || item.URL_IMAGE || null),
      };
    });
};

const getProductosFromMock = (): ProductoMapeado[] => {
  const mockData = parseBackendProductosPayload(dataMock as unknown, "Mock data");
  return mapProductos(mockData);
};

let cachedProductos: ProductoMapeado[] | null = null;
let fetchPromise: Promise<ProductoMapeado[]> | null = null;

export const getProductos = async (
  forceRefresh = false,
): Promise<ProductoMapeado[]> => {
  if (fetchPromise) return fetchPromise;
  if (cachedProductos && !forceRefresh) return cachedProductos;

  fetchPromise = (async () => {
    try {
      if (DATA_SOURCE === "mock") {
        cachedProductos = getProductosFromMock();
        return cachedProductos;
      }

      const response = await api.get<BackendProductosResponse>("/productos");
      const productosApi = parseBackendProductosPayload(
        response.data,
        "API /productos",
      );
      cachedProductos = mapProductos(productosApi);
      return cachedProductos;
    } catch (error) {
      console.warn("getProductos: fallback to mock data", error);
      cachedProductos = getProductosFromMock();
      return cachedProductos;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const getCategorias = async (): Promise<string[]> => {
  const productos = await getProductos();
  const unique = new Set(productos.map((p) => p.clasificacion));
  return Array.from(unique).sort();
};
