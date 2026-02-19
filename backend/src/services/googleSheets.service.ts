import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

export interface ProductoSheetData {
  id: string;
  nombre: string;
  id_categoria: string | number;
  tipo: string;
  precio_venta: number;
  costo: number;
  unidad_medida?: string | null;
  estado: string;
}

/**
 * Inserta un nuevo producto en Google Sheets
 * Asume que la hoja PRODUCTOS tiene estas columnas en el siguiente orden:
 * id | nombre | id_categoria | tipo | precio_venta | costo | unidad_medida | estado
 */
export async function insertProductoInSheet(
  producto: ProductoSheetData,
  spreadsheetId?: string,
  sheetName: string = 'PRODUCTOS'
): Promise<void> {
  const id = spreadsheetId || process.env.SPREADSHEET_ID_PRODUCTOS || process.env.SPREADSHEET_ID;
  
  if (!id) {
    throw new Error('spreadsheetId requerido o configura SPREADSHEET_ID_PRODUCTOS en .env');
  }

  const defaultKeyPath = path.resolve(__dirname, '../../credentials/service-account.json');
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyPath;

  const authOptions: any = { 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'] // Permiso de escritura
  };
  
  if (fs.existsSync(keyFilePath)) {
    authOptions.keyFilename = keyFilePath;
    console.log(`🔐 Usando credenciales de servicio en: ${keyFilePath}`);
  } else {
    console.log('⚠️  No se encontró archivo de credenciales local');
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Preparar la fila con los valores en el orden correcto
  const row = [
    producto.id,
    producto.nombre,
    producto.id_categoria,
    producto.tipo,
    producto.precio_venta,
    producto.costo,
    producto.unidad_medida || '',
    producto.estado
  ];

  const range = `${sheetName}!A:H`; // Columnas A-H

  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row]
    }
  });

  console.log(`✅ Producto ${producto.id} insertado en Google Sheets`);
}

export interface ProductoUpdateData {
  estado?: string;
  precio_venta?: number;
  costo?: number;
}

/**
 * Actualiza un producto existente en Google Sheets por su ID
 * Solo permite actualizar: estado, precio_venta, costo
 */
export async function updateProductoInSheet(
  id: string,
  updates: ProductoUpdateData,
  spreadsheetId?: string,
  sheetName: string = 'PRODUCTOS'
): Promise<{ found: boolean; updated: boolean }> {
  const sheetId = spreadsheetId || process.env.SPREADSHEET_ID_PRODUCTOS || process.env.SPREADSHEET_ID;
  
  if (!sheetId) {
    throw new Error('spreadsheetId requerido o configura SPREADSHEET_ID_PRODUCTOS en .env');
  }

  const defaultKeyPath = path.resolve(__dirname, '../../credentials/service-account.json');
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyPath;

  const authOptions: any = { 
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  };
  
  if (fs.existsSync(keyFilePath)) {
    authOptions.keyFilename = keyFilePath;
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Leer todas las filas para encontrar el ID
  const range = `${sheetName}!A:H`;
  const res = await sheets.spreadsheets.values.get({ 
    spreadsheetId: sheetId, 
    range 
  });
  
  const rows = res.data.values || [];
  if (rows.length === 0) {
    return { found: false, updated: false };
  }

  // Buscar la fila que contiene el ID (columna A)
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) { // Empezar en 1 para saltar headers
    if (rows[i][0] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    console.log(`⚠️  Producto con ID ${id} no encontrado en Google Sheets`);
    return { found: false, updated: false };
  }

  // 2. Actualizar solo las columnas permitidas
  // Asumiendo columnas: A=id, B=nombre, C=id_categoria, D=tipo, E=precio_venta, F=costo, G=unidad_medida, H=estado
  const actualRowNumber = rowIndex + 1; // +1 porque las filas en Sheets empiezan en 1
  const updateRequests: any[] = [];

  if (updates.precio_venta !== undefined) {
    // Columna E (precio_venta)
    updateRequests.push({
      range: `${sheetName}!E${actualRowNumber}`,
      values: [[updates.precio_venta]]
    });
  }

  if (updates.costo !== undefined) {
    // Columna F (costo)
    updateRequests.push({
      range: `${sheetName}!F${actualRowNumber}`,
      values: [[updates.costo]]
    });
  }

  if (updates.estado !== undefined) {
    // Columna H (estado)
    updateRequests.push({
      range: `${sheetName}!H${actualRowNumber}`,
      values: [[updates.estado]]
    });
  }

  // 3. Ejecutar las actualizaciones
  if (updateRequests.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updateRequests
      }
    });

    console.log(`✅ Producto ${id} actualizado en Google Sheets (fila ${actualRowNumber})`);
    return { found: true, updated: true };
  }

  return { found: true, updated: false };
}

/**
 * Actualiza la celda url_imagen de un producto en Google Sheets.
 * Busca la columna cuyo header sea "url_imagen" (o "url_image") dinámicamente.
 * Si no la encuentra, escribe en la primera columna vacía después de H (columna I).
 *
 * @param productoId  - ID del producto (columna A)
 * @param imageUrl    - Valor a escribir (normalmente directLink o fileId)
 */
export async function updateProductoImageUrl(
  productoId: string,
  imageUrl: string,
  spreadsheetId?: string,
  sheetName: string = 'PRODUCTOS'
): Promise<{ found: boolean; updated: boolean }> {
  const sheetId = spreadsheetId || process.env.SPREADSHEET_ID_PRODUCTOS || process.env.SPREADSHEET_ID;

  if (!sheetId) {
    throw new Error('spreadsheetId requerido o configura SPREADSHEET_ID_PRODUCTOS en .env');
  }

  const defaultKeyPath = path.resolve(__dirname, '../../credentials/service-account.json');
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyPath;

  const authOptions: any = {
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  };

  if (fs.existsSync(keyFilePath)) {
    authOptions.keyFilename = keyFilePath;
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Leer todas las filas (desde A hasta Z para abarcar cualquier columna)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:Z`,
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return { found: false, updated: false };

  // Detectar la columna url_imagen buscando en la fila de headers (fila 0)
  const headers = rows[0].map((h: string) => String(h).toLowerCase().trim());
  const urlColIndex = headers.findIndex(
    (h: string) => h === 'url_imagen' || h === 'url_image' || h === 'imagen_url' || h === 'image_url'
  );

  // Si no existe el header, usar columna I (índice 8, base 0) por defecto
  const colIndex = urlColIndex !== -1 ? urlColIndex : 8;

  // Convertir índice numérico a letra de columna (0=A, 8=I, etc.)
  const colLetter = String.fromCharCode(65 + colIndex);

  // Buscar la fila del producto por ID (columna A)
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === productoId) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    console.warn(`⚠️  [SHEETS] Producto ${productoId} no encontrado para actualizar url_imagen`);
    return { found: false, updated: false };
  }

  const actualRow = rowIndex + 1; // Sheets es 1-based
  const range = `${sheetName}!${colLetter}${actualRow}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[imageUrl]] },
  });

  console.log(`✅ [SHEETS] url_imagen actualizado para producto ${productoId} en ${range}`);
  return { found: true, updated: true };
}
