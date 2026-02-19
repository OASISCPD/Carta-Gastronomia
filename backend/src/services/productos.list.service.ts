import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { Producto } from './productos.service';

export async function getAllProductosService(): Promise<Producto[]> {
  // Traer nombre de categoría desde la tabla categorias_productos
  const sql = `
    SELECT p.id, p.nombre, p.id_categoria, p.tipo, p.precio_venta, p.costo, p.unidad_medida, p.estado,
           p.created_at, p.updated_at, p.url_image,
           cp.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias_productos cp ON cp.id = p.id_categoria
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows as unknown as Producto[];
}

