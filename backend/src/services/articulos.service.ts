import { pool } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Articulo {
  id?: number;
  categoria: string;
  articulo: string;
  precio: number;
  costo: number;
  pct_ganancia_pretendida?: number | null;
  precio_sugerido?: number | null;
  ganancia_final?: number | null;
  pct_ganancia_final?: number | null;
  disponibilidad: "HABILITADO" | "DESHABILITADO";
  fecha_alta_producto?: string | null;
  fecha_actualizacion_costo?: string | null;
  fecha_actualizacion_producto?: string | null;
  tipo_carta?: string | null;
}

/**
 * Obtener todos los artículos con filtros opcionales
 */
export async function getAllArticulosService(filters?: {
  categoria?: string;
  disponibilidad?: "HABILITADO" | "DESHABILITADO";
}): Promise<Articulo[]> {
  let query = "SELECT * FROM articulos WHERE 1=1";
  const params: any[] = [];

  if (filters?.categoria) {
    query += " AND categoria = ?";
    params.push(filters.categoria);
  }

  if (filters?.disponibilidad) {
    query += " AND disponibilidad = ?";
    params.push(filters.disponibilidad);
  }

  query += " ORDER BY categoria, articulo";

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows as Articulo[];
}

/**
 * Obtener un artículo por ID
 */
export async function getArticuloByIdService(
  id: number,
): Promise<Articulo | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM articulos WHERE id = ?",
    [id],
  );
  return rows.length > 0 ? (rows[0] as Articulo) : null;
}

/**
 * Crear un nuevo artículo
 */
export async function createArticuloService(data: Articulo): Promise<Articulo> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO articulos (
      categoria, articulo, precio, costo, 
      pct_ganancia_pretendida, precio_sugerido, 
      ganancia_final, pct_ganancia_final, 
      disponibilidad, fecha_alta_producto, 
      fecha_actualizacion_costo, fecha_actualizacion_producto, 
      tipo_carta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.categoria,
      data.articulo,
      data.precio,
      data.costo,
      data.pct_ganancia_pretendida,
      data.precio_sugerido,
      data.ganancia_final,
      data.pct_ganancia_final,
      data.disponibilidad,
      data.fecha_alta_producto,
      data.fecha_actualizacion_costo,
      data.fecha_actualizacion_producto,
      data.tipo_carta,
    ],
  );

  return { ...data, id: result.insertId };
}

/**
 * Actualizar un artículo existente
 */
export async function updateArticuloService(
  id: number,
  data: Partial<Articulo>,
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.categoria !== undefined) {
    fields.push("categoria = ?");
    values.push(data.categoria);
  }
  if (data.articulo !== undefined) {
    fields.push("articulo = ?");
    values.push(data.articulo);
  }
  if (data.precio !== undefined) {
    fields.push("precio = ?");
    values.push(data.precio);
  }
  if (data.costo !== undefined) {
    fields.push("costo = ?");
    values.push(data.costo);
  }
  if (data.pct_ganancia_pretendida !== undefined) {
    fields.push("pct_ganancia_pretendida = ?");
    values.push(data.pct_ganancia_pretendida);
  }
  if (data.precio_sugerido !== undefined) {
    fields.push("precio_sugerido = ?");
    values.push(data.precio_sugerido);
  }
  if (data.ganancia_final !== undefined) {
    fields.push("ganancia_final = ?");
    values.push(data.ganancia_final);
  }
  if (data.pct_ganancia_final !== undefined) {
    fields.push("pct_ganancia_final = ?");
    values.push(data.pct_ganancia_final);
  }
  if (data.disponibilidad !== undefined) {
    fields.push("disponibilidad = ?");
    values.push(data.disponibilidad);
  }
  if (data.fecha_alta_producto !== undefined) {
    fields.push("fecha_alta_producto = ?");
    values.push(data.fecha_alta_producto);
  }
  if (data.fecha_actualizacion_costo !== undefined) {
    fields.push("fecha_actualizacion_costo = ?");
    values.push(data.fecha_actualizacion_costo);
  }
  if (data.fecha_actualizacion_producto !== undefined) {
    fields.push("fecha_actualizacion_producto = ?");
    values.push(data.fecha_actualizacion_producto);
  }
  if (data.tipo_carta !== undefined) {
    fields.push("tipo_carta = ?");
    values.push(data.tipo_carta);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE articulos SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return result.affectedRows > 0;
}

/**
 * Eliminar un artículo
 */
export async function deleteArticuloService(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM articulos WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

/**
 * Obtener categorías únicas
 */
export async function getCategoriasService(): Promise<string[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT DISTINCT categoria FROM articulos ORDER BY categoria",
  );
  return rows.map((r) => r.categoria);
}

/**
 * Insertar múltiples artículos (para importación masiva desde JSON)
 */
export async function bulkInsertArticulosService(
  articulos: Articulo[],
): Promise<number> {
  if (articulos.length === 0) return 0;

  const values = articulos.map((a) => [
    a.categoria,
    a.articulo,
    a.precio,
    a.costo,
    a.pct_ganancia_pretendida,
    a.precio_sugerido,
    a.ganancia_final,
    a.pct_ganancia_final,
    a.disponibilidad,
    a.fecha_alta_producto,
    a.fecha_actualizacion_costo,
    a.fecha_actualizacion_producto,
    a.tipo_carta,
  ]);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO articulos (
      categoria, articulo, precio, costo, 
      pct_ganancia_pretendida, precio_sugerido, 
      ganancia_final, pct_ganancia_final, 
      disponibilidad, fecha_alta_producto, 
      fecha_actualizacion_costo, fecha_actualizacion_producto, 
      tipo_carta
    ) VALUES ?`,
    [values],
  );

  return result.affectedRows;
}

/**
 * Bulk upsert: inserta nuevos y actualiza existentes basándose en la clave compuesta (categoria + articulo).
 */
export async function bulkUpsertArticulosService(
  articulos: Articulo[],
): Promise<{ inserted: number; updated: number }> {
  if (articulos.length === 0) return { inserted: 0, updated: 0 };

  // Leer artículos existentes para comparar por clave compuesta
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, categoria, articulo FROM articulos",
  );

  const existingMap: Record<string, number> = {};
  (rows as any[]).forEach((r) => {
    // Clave: "categoria|articulo" en minúsculas para evitar colisiones
    const key = `${String(r.categoria).toLowerCase()}|${String(r.articulo).toLowerCase()}`;
    existingMap[key] = r.id;
  });

  const toInsert: Articulo[] = [];
  const toUpdate: { id: number; data: Partial<Articulo> }[] = [];

  for (const a of articulos) {
    const key = `${String(a.categoria || "").toLowerCase()}|${String(a.articulo || "").toLowerCase()}`;
    if (existingMap[key]) {
      toUpdate.push({ id: existingMap[key], data: a });
    } else {
      toInsert.push(a);
    }
  }

  let inserted = 0;
  let updated = 0;

  if (toInsert.length > 0) {
    inserted = await bulkInsertArticulosService(toInsert);
  }

  for (const u of toUpdate) {
    const success = await updateArticuloService(u.id, u.data);
    if (success) updated++;
  }

  return { inserted, updated };
}

/**
 * Upsert de un artículo usando categoria + articulo como clave compuesta
 * Si existe: UPDATE
 * Si no existe: INSERT
 */
export async function upsertArticuloByKeyService(
  categoria: string,
  articulo: string,
  data: Partial<Articulo>,
): Promise<{
  action: "updated" | "inserted";
  id: number;
  affectedRows: number;
}> {
  // 1. Buscar si existe el registro por categoria + articulo
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM articulos WHERE categoria = ? AND articulo = ?",
    [categoria, articulo],
  );

  if (rows.length > 0) {
    // EXISTE → UPDATE
    const existingId = rows[0].id;

    const fields: string[] = [];
    const values: any[] = [];

    // Construir campos dinámicamente
    Object.keys(data).forEach((key) => {
      if (key !== "id" && data[key as keyof Articulo] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key as keyof Articulo]);
      }
    });

    if (fields.length === 0) {
      // No hay cambios, retornar el ID existente
      return { action: "updated", id: existingId, affectedRows: 0 };
    }

    values.push(existingId);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE articulos SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return {
      action: "updated",
      id: existingId,
      affectedRows: result.affectedRows,
    };
  } else {
    // NO EXISTE → INSERT
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO articulos (
        categoria, articulo, precio, costo, 
        pct_ganancia_pretendida, precio_sugerido, 
        ganancia_final, pct_ganancia_final, 
        disponibilidad, fecha_alta_producto, 
        fecha_actualizacion_costo, fecha_actualizacion_producto, 
        tipo_carta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.categoria || categoria,
        data.articulo || articulo,
        data.precio ?? 0,
        data.costo ?? 0,
        data.pct_ganancia_pretendida ?? null,
        data.precio_sugerido ?? null,
        data.ganancia_final ?? null,
        data.pct_ganancia_final ?? null,
        data.disponibilidad ?? "HABILITADO",
        data.fecha_alta_producto ?? null,
        data.fecha_actualizacion_costo ?? null,
        data.fecha_actualizacion_producto ?? null,
        data.tipo_carta ?? null,
      ],
    );

    return {
      action: "inserted",
      id: result.insertId,
      affectedRows: result.affectedRows,
    };
  }
}
