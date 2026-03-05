import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { bulkInsertArticulosService, Articulo } from '../src/services/articulos.service';
import { pool } from '../src/config/db';

// Load .env so SPREADSHEET_ID or other env vars from backend/.env are available
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Convierte fecha ISO a formato MySQL (YYYY-MM-DD HH:MM:SS)
 */
function toMySQLDateTime(isoString: string | null): string | null {
  if (!isoString) return null;
  try {
    // Parse as UTC then convert to Argentina timezone (UTC-3)
    const dateUtc = new Date(isoString);
    if (isNaN(dateUtc.getTime())) return null;
    // Argentina (Buenos Aires) is UTC-3 (no DST currently) -> subtract 3 hours from UTC
    const argentinaMs = dateUtc.getTime() - 3 * 60 * 60 * 1000;
    const date = new Date(argentinaMs);
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return null;
  }
}

async function insertArticulosFromJson() {
  const jsonPath = path.resolve(__dirname, '../../backend/scripts/articulos.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ No se encontró el archivo ${jsonPath}`);
    console.log('Ejecuta primero: npm run fetch:articulos');
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data) || data.length === 0) {
      console.error('❌ El archivo JSON no contiene datos válidos');
      process.exit(1);
    }

    console.log(`📦 Se encontraron ${data.length} artículos en el JSON`);

    // Limpiar tabla antes de insertar (opcional - comenta si no quieres)
    console.log('🗑️  Limpiando tabla articulos...');
    await pool.query('DELETE FROM articulos');

    // Mapear los datos al formato esperado
    const articulos: Articulo[] = data.map((item: any) => ({
      categoria: item.categoria || '',
      articulo: item.articulo || '',
      precio: Number(item.precio) || 0,
      costo: Number(item.costo) || 0,
      pct_ganancia_pretendida: item.pct_ganancia_pretendida ? Number(item.pct_ganancia_pretendida) : null,
      precio_sugerido: item.precio_sugerido ? Number(item.precio_sugerido) : null,
      ganancia_final: item.ganancia_final ? Number(item.ganancia_final) : null,
      pct_ganancia_final: item.pct_ganancia_final ? Number(item.pct_ganancia_final) : null,
      disponibilidad: item.disponibilidad === 'DESHABILITADO' ? 'DESHABILITADO' : 'HABILITADO',
      fecha_alta_producto: toMySQLDateTime(item.fecha_alta_producto),
      fecha_actualizacion_costo: toMySQLDateTime(item.fecha_actualizacion_costo),
      fecha_actualizacion_producto: toMySQLDateTime(item.fecha_actualizacion_producto),
      tipo_carta: item.tipo_carta || null,
    }));

    console.log('💾 Insertando artículos en la base de datos...');
    const inserted = await bulkInsertArticulosService(articulos);

    console.log(`✅ Se insertaron ${inserted} artículos correctamente`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error al insertar artículos:', error?.message || error);
    process.exit(1);
  }
}

if (require.main === module) {
  insertArticulosFromJson();
}
