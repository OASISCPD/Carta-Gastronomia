import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Producto {
  id: string;
  nombre: string;
  id_categoria: number;
  tipo: string;
  precio_venta: number;
  costo: number;
  unidad_medida?: string | null;
  estado?: string;
}

export async function upsertProductoByIdOrKey(producto: Partial<Producto>): Promise<{ action: 'inserted' | 'updated'; id: string; affectedRows: number }> {
  // Normalizar id_categoria para evitar NaN en queries
  const idCategoriaNorm = producto.id_categoria !== undefined && producto.id_categoria !== null
    ? Number(producto.id_categoria)
    : undefined;
  const id_categoria = Number.isNaN(idCategoriaNorm) ? 0 : idCategoriaNorm;

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
    `INSERT INTO productos (id, nombre, id_categoria, tipo, precio_venta, costo, unidad_medida, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      producto.nombre || '',
      id_categoria ?? 0,
      producto.tipo || 'Simple',
      producto.precio_venta ?? 0,
      producto.costo ?? 0,
      producto.unidad_medida ?? null,
      producto.estado ?? 'Activo',
    ]
  );

  return { action: 'inserted', id, affectedRows: insertRes.affectedRows };
}
