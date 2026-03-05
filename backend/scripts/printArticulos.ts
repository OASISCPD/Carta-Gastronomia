import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fetchArticulos } from './fetchArticulosGoogleSheets';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function getArticulosData() {
  const outPath = path.resolve(__dirname, 'articulos.json');
  // Si ya existe el archivo, leerlo para no pedir la API cada vez
  if (fs.existsSync(outPath)) {
    try {
      const raw = fs.readFileSync(outPath, 'utf8');
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err: any) {
      console.warn('No se pudo leer articulos.json, volveré a consultar la API:', err?.message || err);
    }
  }

  // Si no existe o falla la lectura, llamar a la API
  const data = await fetchArticulos();
  return data;
}

function prettyPrintItem(i: number, item: any) {
  const parts = [
    `${i + 1}. ${item.articulo || item['articulo'] || item['articulo_o'] || '—'}`,
    `categoria: ${item.categoria || item['categoria'] || '—'}`,
    `precio: ${item.precio ?? item['precio'] ?? '—'}`,
    `costo: ${item.costo ?? item['costo'] ?? '—'}`,
    `disponibilidad: ${item.disponibilidad || item['disponibilidad'] || '—'}`,
    `fecha_alta: ${item.fecha_alta || item['fecha_alta'] || '—'}`,
  ];
  console.log(parts.join(' | '));
}

async function main() {
  const data = await getArticulosData();
  if (!data || !Array.isArray(data)) {
    console.error('No hay datos de articulos para mostrar.');
    process.exit(1);
  }

  console.log(`Mostrando ${data.length} filas de ARTICULOS:`);
  // imprimir primeras 50 por defecto para no llenar la consola
  const limit = process.env.PRINT_LIMIT ? Number(process.env.PRINT_LIMIT) : 50;
  for (let i = 0; i < Math.min(limit, data.length); i++) {
    prettyPrintItem(i, data[i]);
  }

  if (data.length > limit) {
    console.log(`(mostradas ${limit} de ${data.length}; establece PRINT_LIMIT para cambiar)`);
  }
}

if (require.main === module) {
  main().catch((err: any) => {
    console.error('Error en printArticulos:', err?.message || err);
    process.exit(1);
  });
}
