import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ImagenProducto {
  id?: number;
  producto_id: string;
  file_id: string;
  file_name?: string | null;
  web_view_link?: string | null;
  web_content_link?: string | null;
  direct_link?: string | null;
}

/**
 * Inserta un registro en imagenes_productos con el resultado de la subida a Drive.
 * Devuelve el id autoincremental generado.
 */
export async function insertImagenProducto(data: ImagenProducto): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO imagenes_productos
       (producto_id, file_id, file_name, web_view_link, web_content_link, direct_link)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.producto_id,
      data.file_id,
      data.file_name   ?? null,
      data.web_view_link   ?? null,
      data.web_content_link ?? null,
      data.direct_link ?? null,
    ]
  );
  return result.insertId;
}

/**
 * Devuelve todas las imágenes asociadas a un producto.
 */
export async function getImagenesByProductoId(productoId: string): Promise<ImagenProducto[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM imagenes_productos WHERE producto_id = ? ORDER BY created_at DESC`,
    [productoId]
  );
  return rows as ImagenProducto[];
}

/**
 * Devuelve la imagen más reciente de un producto (o null si no tiene ninguna).
 */
export async function getLatestImagenByProductoId(productoId: string): Promise<ImagenProducto | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM imagenes_productos WHERE producto_id = ? ORDER BY created_at DESC LIMIT 1`,
    [productoId]
  );
  return rows.length > 0 ? (rows[0] as ImagenProducto) : null;
}
