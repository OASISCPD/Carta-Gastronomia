import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Producto {
  id: string;
  nombre: string;
  id_categoria: string | number;
  tipo: string;
  precio_venta: number;
  costo: number;
  unidad_medida?: string | null;
  estado?: string;
  url_image?: string | null;
  categoria_nombre?: string | null;
}

export async function upsertProductoByIdOrKey(producto: Partial<Producto>): Promise<{ action: 'inserted' | 'updated'; id: string; affectedRows: number }> {
  // Preservar id_categoria tal como viene (puede ser número o string UUID)
  const id_categoria = producto.id_categoria !== undefined && producto.id_categoria !== null
    ? String(producto.id_categoria).trim()
    : undefined;

  // Si viene id, buscar por id; si no, intentar por nombre+id_categoria
  if (producto.id) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM productos WHERE id = ?', [producto.id]);
    if (rows.length > 0) {
      // Update
      const fields: string[] = [];
      const values: any[] = [];
      if (producto.nombre !== undefined) { fields.push('nombre = ?'); values.push(producto.nombre); }
      if (producto.id_categoria !== undefined) { fields.push('id_categoria = ?'); values.push(id_categoria); }
      if (producto.tipo !== undefined) { fields.push('tipo = ?'); values.push(producto.tipo); }
      if (producto.precio_venta !== undefined) { fields.push('precio_venta = ?'); values.push(producto.precio_venta); }
      if (producto.costo !== undefined) { fields.push('costo = ?'); values.push(producto.costo); }
      if (producto.unidad_medida !== undefined) { fields.push('unidad_medida = ?'); values.push(producto.unidad_medida); }
      if (producto.estado !== undefined) { fields.push('estado = ?'); values.push(producto.estado); }
      if (producto.url_image !== undefined) { fields.push('url_image = ?'); values.push(producto.url_image); }
      if (fields.length === 0) return { action: 'updated', id: producto.id!, affectedRows: 0 };
      values.push(producto.id);
      const [result] = await pool.query<ResultSetHeader>(`UPDATE productos SET ${fields.join(', ')} , updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
      return { action: 'updated', id: producto.id!, affectedRows: result.affectedRows };
    }
  }

  // intentar por nombre + id_categoria
  if (producto.nombre && id_categoria !== undefined) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM productos WHERE nombre = ? AND id_categoria = ?', [producto.nombre, id_categoria]);
    if (rows.length > 0) {
      const existingId = rows[0].id;
      const fields: string[] = [];
      const values: any[] = [];
      if (producto.tipo !== undefined) { fields.push('tipo = ?'); values.push(producto.tipo); }
      if (producto.precio_venta !== undefined) { fields.push('precio_venta = ?'); values.push(producto.precio_venta); }
      if (producto.costo !== undefined) { fields.push('costo = ?'); values.push(producto.costo); }
      if (producto.unidad_medida !== undefined) { fields.push('unidad_medida = ?'); values.push(producto.unidad_medida); }
      if (producto.estado !== undefined) { fields.push('estado = ?'); values.push(producto.estado); }
      if (producto.url_image !== undefined) { fields.push('url_image = ?'); values.push(producto.url_image); }
      if (fields.length === 0) return { action: 'updated', id: existingId, affectedRows: 0 };
      values.push(existingId);
      const [result] = await pool.query<ResultSetHeader>(`UPDATE productos SET ${fields.join(', ')} , updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
      return { action: 'updated', id: existingId, affectedRows: result.affectedRows };
    }
  }

  // Insert new
  // Generar id si no viene
  const id = producto.id || require('crypto').randomUUID();
  const [insertRes] = await pool.query<ResultSetHeader>(
    `INSERT INTO productos (id, nombre, id_categoria, tipo, precio_venta, costo, unidad_medida, estado, url_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      producto.nombre || '',
      id_categoria ?? '',
      producto.tipo || 'Simple',
      producto.precio_venta ?? 0,
      producto.costo ?? 0,
      producto.unidad_medida ?? null,
      producto.estado ?? 'Activo',
      producto.url_image ?? null,
    ]
  );

  return { action: 'inserted', id, affectedRows: insertRes.affectedRows };
}
