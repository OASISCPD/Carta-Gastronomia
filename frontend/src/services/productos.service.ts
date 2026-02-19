import api from "./api";

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

const sanitizeDriveUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    const id = idMatch ? idMatch[1] : null;
    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }
  return url;
};

const CARTA_MAPPING: Record<string, string> = {
  // RESTAURANT
  "PIZZA Y EMPANADA": "RESTAURANT",
  SANDWICHERIA: "RESTAURANT",
  SNACK: "RESTAURANT",
  "BEBIDAS SIN ALCOHOL": "RESTAURANT",
  CERVEZA: "RESTAURANT",

  // BEBIDAS PREMIUM
  COCTELERIA: "BEBIDAS PREMIUM",
  ESPUMANTES: "BEBIDAS PREMIUM",
  GIN: "BEBIDAS PREMIUM",
  VINOS: "BEBIDAS PREMIUM",
  WISHKY: "BEBIDAS PREMIUM",

  // POSTRES & CAFÉ
  CAFETERIA: "POSTRES & CAFÉ",
  POSTRE: "POSTRES & CAFÉ",

  // PROMOCIONES
  PROMO: "PROMOCIONES",
  PROMOCIONES: "PROMOCIONES",
  "PROMO LUNES": "PROMOCIONES",
  "PROMO MARTES": "PROMOCIONES",
  "PROMO MIERCOLES": "PROMOCIONES",
  "PROMO JUEVES Y DOMINGO": "PROMOCIONES",
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
      const response = await api.get<{
        success: boolean;
        data: BackendProducto[];
      }>("/productos");

      cachedProductos = response.data.data
        .filter((item) => item.estado === "Activo")
        .map((item) => {
          const rawCat = item.categoria_nombre || "Sin categoría";
          return {
            carta: CARTA_MAPPING[rawCat] || "RESTAURANT", // Fallback to RESTAURANT if not mapped
            clasificacion: rawCat,
            "nombre largo": item.nombre,
            monto:
              typeof item.precio_venta === "string"
                ? parseFloat(item.precio_venta)
                : item.precio_venta,
            "monto individual": null,
            "apto vegano": null,
            "info producto": null,
            url_image: sanitizeDriveUrl(
              item.url_image || item.URL_IMAGE || null,
            ),
          };
        });

      return cachedProductos;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      throw new Error(
        error.response?.data?.message || "Error al obtener productos",
      );
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
