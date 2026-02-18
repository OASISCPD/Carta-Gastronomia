import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { Producto } from './productos.service';

export async function getAllProductosService(): Promise<Producto[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nombre, id_categoria, tipo, precio_venta, costo, unidad_medida, estado, created_at, updated_at, URL_IMAGE FROM productos');
  return rows as unknown as Producto[];
}

