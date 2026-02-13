import { Request, Response } from "express";
import {
  getAllArticulosService,
  getArticuloByIdService,
  createArticuloService,
  updateArticuloService,
  deleteArticuloService,
  getCategoriasService,
} from "../services/articulos.service";
import {
  bulkUpsertArticulosService,
  upsertArticuloByKeyService,
} from "../services/articulos.service";
// Reusar fetcher existente que usa Google Sheets API
import { fetchArticulos } from "../scripts/fetchArticulosGoogleSheets";

/**
 * Helper: convierte ISO a MySQL datetime en zona Argentina (UTC-3)
 */
function toMySQLDateTimeArgentina(isoString: string | null): string | null {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return null;
  // Argentina UTC-3 -> restar 3 horas de UTC
  const argentinaMs = d.getTime() - 3 * 60 * 60 * 1000;
  const dt = new Date(argentinaMs);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const seconds = String(dt.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * GET /api/v1/articulos
 * Obtener todos los artículos con filtros opcionales
 */
export const getArticulos = async (req: Request, res: Response) => {
  console.log("[API] GET /articulos - Querying database");
  try {
    const { categoria, disponibilidad } = req.query;

    const filters: any = {};
    if (categoria) filters.categoria = categoria as string;
    if (disponibilidad)
      filters.disponibilidad = disponibilidad as "HABILITADO" | "DESHABILITADO";

    const articulos = await getAllArticulosService(filters);
    return res.json({ success: true, data: articulos });
  } catch (error: any) {
    console.error("Error en getArticulos:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener artículos",
        error: error?.message,
      });
  }
};

/**
 * POST /api/v1/articulos/sync
 * Descarga la hoja ARTICULOS y actualiza la base (insert/update).
 */
export const syncArticulos = async (req: Request, res: Response) => {
  try {
    // fetchArticulos retorna filas ya normalizadas (ver scripts/fetchArticulosGoogleSheets.ts)
    const rows = await fetchArticulos();
    if (!rows || !Array.isArray(rows)) {
      return res
        .status(500)
        .json({
          success: false,
          message: "No se obtuvieron datos desde Sheets",
        });
    }

    // Mapear al tipo Articulo que espera el servicio
    const mapped = rows.map((item: any) => ({
      categoria: item.categoria || "",
      articulo: item.articulo || "",
      precio: Number(item.precio) || 0,
      costo: Number(item.costo) || 0,
      pct_ganancia_pretendida: item.pct_ganancia_pretendida ?? null,
      precio_sugerido: item.precio_sugerido ?? null,
      ganancia_final: item.ganancia_final ?? null,
      pct_ganancia_final: item.pct_ganancia_final ?? null,
      disponibilidad:
        item.disponibilidad === "DESHABILITADO"
          ? "DESHABILITADO"
          : "HABILITADO",
      fecha_alta_producto:
        toMySQLDateTimeArgentina(item.fecha_alta_producto) || null,
      fecha_actualizacion_costo:
        toMySQLDateTimeArgentina(item.fecha_actualizacion_costo) || null,
      fecha_actualizacion_producto:
        toMySQLDateTimeArgentina(item.fecha_actualizacion_producto) || null,
      tipo_carta: item.tipo_carta || null,
    }));

    const result = await bulkUpsertArticulosService(mapped as any);

    return res.json({ success: true, message: "Sync completed", result });
  } catch (error: any) {
    console.error("Error en syncArticulos:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al sincronizar",
        error: error?.message,
      });
  }
};
/**
 * GET /api/v1/articulos/:id
 * Obtener un artículo por ID
 */
export const getArticuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articulo = await getArticuloByIdService(Number(id));

    if (!articulo) {
      return res
        .status(404)
        .json({ success: false, message: "Artículo no encontrado" });
    }

    return res.json({ success: true, data: articulo });
  } catch (error: any) {
    console.error("Error en getArticuloById:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener artículo",
        error: error?.message,
      });
  }
};

/**
 * POST /api/v1/articulos
 * Crear un nuevo artículo
 */
export const createArticulo = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.categoria || !data.articulo) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Categoría y artículo son requeridos",
        });
    }

    const newArticulo = await createArticuloService(data);
    return res.status(201).json({ success: true, data: newArticulo });
  } catch (error: any) {
    console.error("Error en createArticulo:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al crear artículo",
        error: error?.message,
      });
  }
};

/**
 * PUT /api/v1/articulos/:id
 * Actualizar un artículo existente
 */
export const updateArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await updateArticuloService(Number(id), data);

    if (!updated) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Artículo no encontrado o sin cambios",
        });
    }

    return res.json({
      success: true,
      message: "Artículo actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error en updateArticulo:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al actualizar artículo",
        error: error?.message,
      });
  }
};

/**
 * DELETE /api/v1/articulos/:id
 * Eliminar un artículo
 */
export const deleteArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteArticuloService(Number(id));

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Artículo no encontrado" });
    }

    return res.json({
      success: true,
      message: "Artículo eliminado correctamente",
    });
  } catch (error: any) {
    console.error("Error en deleteArticulo:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al eliminar artículo",
        error: error?.message,
      });
  }
};

/**
 * GET /api/v1/articulos/categorias/list
 * Obtener lista de categorías únicas
 */
export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await getCategoriasService();
    return res.json({ success: true, data: categorias });
  } catch (error: any) {
    console.error("Error en getCategorias:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener categorías",
        error: error?.message,
      });
  }
};

/**
 * POST /api/v1/articulos/sync/row
 * Sincroniza UNA fila desde Google Sheets (disparado por Apps Script v2)
 * Usa categoria + articulo como clave compuesta única
 * - Si existe: UPDATE
 * - Si no existe: INSERT
 */
export const syncArticuloRow = async (req: Request, res: Response) => {
  try {
    const { data, uniqueKey, sheet, row, editedAt } = req.body;

    // Validar datos requeridos
    if (!data || !uniqueKey || !uniqueKey.categoria || !uniqueKey.articulo) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan datos requeridos: data, uniqueKey.categoria, uniqueKey.articulo",
      });
    }

    console.log(
      `[SYNC ROW] Procesando fila ${row || "?"} de hoja ${sheet || "?"}:`,
      {
        categoria: uniqueKey.categoria,
        articulo: uniqueKey.articulo,
        editedAt,
      },
    );

    console.log(`[SYNC ROW] Datos completos recibidos:`, data);

    // Helper: convertir a número seguro
    const toSafeNumber = (value: any): number => {
      if (value === null || value === undefined || value === "") return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Helper: convertir a número seguro que puede ser null
    const toSafeNumberOrNull = (value: any): number | null => {
      if (value === null || value === undefined || value === "") return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Normalizar los datos del Excel al formato de la BD
    const articuloData: any = {
      categoria: data.CATEGORIA || data.categoria || uniqueKey.categoria,
      articulo: data.ARTICULO || data.articulo || uniqueKey.articulo,
      precio: toSafeNumber(data.PRECIO || data.precio),
      costo: toSafeNumber(data.COSTO || data.costo),
      pct_ganancia_pretendida: toSafeNumberOrNull(
        data.PCT_GANANCIA_PRETENDIDA || data.pct_ganancia_pretendida,
      ),
      precio_sugerido: toSafeNumberOrNull(
        data.PRECIO_SUGERIDO || data.precio_sugerido,
      ),
      ganancia_final: toSafeNumberOrNull(
        data.GANANCIA_FINAL || data.ganancia_final,
      ),
      pct_ganancia_final: toSafeNumberOrNull(
        data.PCT_GANANCIA_FINAL || data.pct_ganancia_final,
      ),
      disponibilidad:
        data.DISPONIBILIDAD === "DESHABILITADO" ||
        data.disponibilidad === "DESHABILITADO"
          ? "DESHABILITADO"
          : "HABILITADO",
      fecha_alta_producto:
        toMySQLDateTimeArgentina(
          data.FECHA_ALTA_PRODUCTO || data.fecha_alta_producto,
        ) || null,
      fecha_actualizacion_costo:
        toMySQLDateTimeArgentina(
          data.FECHA_ACTUALIZACION_COSTO || data.fecha_actualizacion_costo,
        ) || null,
      fecha_actualizacion_producto:
        toMySQLDateTimeArgentina(
          data.FECHA_ACTUALIZACION_PRODUCTO ||
            data.fecha_actualizacion_producto,
        ) || null,
      tipo_carta: data.TIPO_CARTA || data.tipo_carta || null,
    };

    console.log(`[SYNC ROW] Datos normalizados:`, articuloData);
    console.log(
      `[SYNC ROW] Buscando registro con: categoria="${uniqueKey.categoria}", articulo="${uniqueKey.articulo}"`,
    );

    // Llamar al servicio que hace upsert por clave compuesta
    const result = await upsertArticuloByKeyService(
      uniqueKey.categoria,
      uniqueKey.articulo,
      articuloData,
    );

    console.log(`[SYNC ROW] Resultado:`, result);

    return res.json({
      success: true,
      action: result.action, // 'updated' o 'inserted'
      message:
        result.action === "updated"
          ? `Artículo actualizado: ${uniqueKey.categoria} - ${uniqueKey.articulo}`
          : `Artículo creado: ${uniqueKey.categoria} - ${uniqueKey.articulo}`,
      data: result,
    });
  } catch (error: any) {
    console.error("[SYNC ROW] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error al sincronizar fila",
      error: error?.message,
    });
  }
};
