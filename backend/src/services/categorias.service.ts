import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Categoria {
  id: string;
  nombre: string;
  display_order?: number;
  estado?: string;
}

export async function upsertCategoriaByIdOrKey(categoria: Partial<Categoria>): Promise<{ action: 'inserted' | 'updated'; id: string; affectedRows: number }> {
  const id = categoria.id;

  if (id) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM categorias_productos WHERE id = ?', [id]);
    if (rows.length > 0) {
      const fields: string[] = [];
      const values: any[] = [];
      if (categoria.nombre !== undefined) { fields.push('nombre = ?'); values.push(categoria.nombre); }
      if (categoria.display_order !== undefined) { fields.push('display_order = ?'); values.push(Number(categoria.display_order)); }
      if (categoria.estado !== undefined) { fields.push('estado = ?'); values.push(categoria.estado); }
      if (fields.length === 0) return { action: 'updated', id, affectedRows: 0 };
      values.push(id);
      const [result] = await pool.query<ResultSetHeader>(`UPDATE categorias_productos SET ${fields.join(', ')} , updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
      return { action: 'updated', id, affectedRows: result.affectedRows };
    }
  }

  // intentar por nombre
  if (categoria.nombre) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM categorias_productos WHERE nombre = ?', [categoria.nombre]);
    if (rows.length > 0) {
      const existingId = rows[0].id;
      const fields: string[] = [];
      const values: any[] = [];
      if (categoria.display_order !== undefined) { fields.push('display_order = ?'); values.push(Number(categoria.display_order)); }
      if (categoria.estado !== undefined) { fields.push('estado = ?'); values.push(categoria.estado); }
      if (fields.length === 0) return { action: 'updated', id: existingId, affectedRows: 0 };
      values.push(existingId);
      const [result] = await pool.query<ResultSetHeader>(`UPDATE categorias_productos SET ${fields.join(', ')} , updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
      return { action: 'updated', id: existingId, affectedRows: result.affectedRows };
    }
  }

  // Insert
  const newId = categoria.id || require('crypto').randomUUID();
  const [insertRes] = await pool.query<ResultSetHeader>(
    `INSERT INTO categorias_productos (id, nombre, display_order, estado) VALUES (?, ?, ?, ?)`,
    [
      newId,
      categoria.nombre || '',
      categoria.display_order ?? 0,
      categoria.estado ?? 'Activo'
    ]
  );

  return { action: 'inserted', id: newId, affectedRows: insertRes.affectedRows };
}

export async function getAllCategoriasService(): Promise<Categoria[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nombre, display_order, estado, created_at, updated_at FROM categorias_productos ORDER BY display_order, nombre');
  return rows as unknown as Categoria[];
}
