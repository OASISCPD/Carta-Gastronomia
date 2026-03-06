import api from "./api";
import type { MenuItem } from "../core/types";
import { resolveCartaByCategory } from "../core/utils/categoryOrder";

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
  const response = await api.get<BackendArticulosResponse>("/articulos");

  if (!response.data || !Array.isArray(response.data.data)) {
    throw new Error("Respuesta invalida de /api/v1/articulos");
  }

  return mapArticulos(response.data.data);
};
