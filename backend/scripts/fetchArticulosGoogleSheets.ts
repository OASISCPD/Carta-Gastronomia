import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { google } from 'googleapis';

// Load .env from backend folder so SPREADSHEET_ID is available
dotenv.config({ path: path.resolve(__dirname, '../.env') });

type RowObject = { [k: string]: string | number | null };

function keyFromHeader(h: string) {
  return h
    .trim()
    .toLowerCase()
    .replace(/%/g, 'pct')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function parseNumber(s?: string): number | null {
  if (!s) return null;
  const t = s.toString().trim();
  if (!t) return null;
  // Remove percent sign and non-numeric characters except separators
  const cleaned = t.replace(/%/g, '').replace(/[^0-9.,-]/g, '');
  if (cleaned.indexOf('.') !== -1 && cleaned.indexOf(',') !== -1) {
    return Number(cleaned.replace(/\./g, '').replace(/,/g, '.')) || null;
  }
  if (cleaned.indexOf(',') !== -1) return Number(cleaned.replace(/,/g, '.')) || null;
  const n = Number(cleaned);
  return isNaN(n) ? null : n;
}

function parseFecha(s?: string): string | null {
  if (!s) return null;
  const t = s.toString().trim();
  if (!t) return null;
  // Intentar dd/mm/yyyy hh:mm:ss
  const parts = t.split(' ');
  const dparts = (parts[0] || '').split('/');
  if (dparts.length === 3) {
    const [d, m, y] = dparts;
    const time = parts[1] || '00:00:00';
    const iso = `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${time}`;
    const dt = new Date(iso);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }
  const parsed = Date.parse(t);
  return isNaN(parsed) ? null : new Date(parsed).toISOString();
}

async function fetchArticulos() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.error('Setea la variable de entorno SPREADSHEET_ID con el id del spreadsheet.');
    process.exit(1);
  }

  const sheetName = process.env.SHEET_NAME || 'ARTICULOS';

  // Google Auth: usa GOOGLE_APPLICATION_CREDENTIALS o el default credential chain
  // Preferir archivo de credenciales dentro del repo si existe
  const defaultKeyPath = path.resolve(__dirname, '../credentials/service-account.json');
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyPath;

  const authOptions: any = { scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] };
  if (fs.existsSync(keyFilePath)) {
    authOptions.keyFilename = keyFilePath;
    console.log(`🔐 Usando credenciales de servicio en: ${keyFilePath}`);
  } else {
    console.log('⚠️  No se encontró archivo de credenciales local; usando credenciales por defecto o GOOGLE_APPLICATION_CREDENTIALS');
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const range = `${sheetName}!A1:Z`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.log('No se encontraron filas en el rango solicitado.');
    return;
  }

  const headers = rows[0].map((h) => (h ? h.toString().trim() : ''));
  const keys = headers.map((h) => keyFromHeader(h || 'col'));

  const data: RowObject[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj: RowObject = {};
    let hasArticulo = false;
    for (let c = 0; c < keys.length; c++) {
      const raw = row[c] !== undefined ? row[c].toString().trim() : '';
      const key = keys[c] || `col_${c}`;
      // Preferir parseo de fecha cuando el header contiene 'fecha'
      if (key.includes('fecha') || key.includes('fecha_alta')) {
        obj[key] = parseFecha(raw);
      } else if (key.includes('precio') || key.includes('costo') || key.includes('ganancia')) {
        obj[key] = parseNumber(raw);
      } else {
        obj[key] = raw || null;
      }
      if (key.includes('articulo') && raw) hasArticulo = true;
    }
    if (hasArticulo) data.push(obj);
  }

  const outPath = path.resolve(__dirname, 'articulos.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Guardado ${data.length} filas en ${outPath}`);
  return data;
}

if (require.main === module) {
  fetchArticulos().catch((err) => {
    console.error('Error al leer Google Sheets:', err.message || err);
    process.exit(1);
  });
}

export { fetchArticulos };
