import { Request, Response } from 'express';
import { upsertProductoByIdOrKey } from '../services/productos.service';
import { fetchProductos } from '../../scripts/productos/fetchProductos';

export const syncProductosFromSheet = async (req: Request, res: Response) => {
  try {
    const safeBody = req && typeof req.body === 'object' ? req.body as any : {};
    const spreadsheetId = safeBody.spreadsheetId || req.query?.spreadsheetId || process.env.SPREADSHEET_ID_PRODUCTOS || process.env.SPREADSHEET_ID;
    const sheetName = safeBody.sheetName || req.query?.sheetName || 'PRODUCTOS';

    if (!spreadsheetId) {
      console.error('[SYNC PRODUCTOS] Missing spreadsheetId and no SPREADSHEET_ID in env');
      return res.status(400).json({ success: false, message: 'spreadsheetId required (body or query) or set SPREADSHEET_ID in .env' });
    }

    const rows = await fetchProductos(String(spreadsheetId), String(sheetName));
    if (!rows || !Array.isArray(rows)) return res.status(500).json({ success: false, message: 'No se obtuvieron filas' });

    let inserted = 0; let updated = 0;
    for (const r of rows) {
      const producto: any = {
        id: r.id || undefined,
        nombre: r.nombre || r.name || '',
        id_categoria: r.id_categoria ? Number(r.id_categoria) : 0,
        tipo: r.tipo || 'Simple',
        precio_venta: r.precio_venta ?? 0,
        costo: r.costo ?? 0,
        unidad_medida: r.unidad_medida || null,
        estado: r.estado || 'Activo'
      };
      const result = await upsertProductoByIdOrKey(producto);
      if (result.action === 'inserted') inserted++; else updated++;
    }

    return res.json({ success: true, message: 'Sync productos completed', result: { inserted, updated } });
  } catch (err: any) {
    console.error('[SYNC PRODUCTOS] Error:', err);
    return res.status(500).json({ success: false, message: 'Error on sync', error: err?.message });
  }
};

export const syncProductosFromJson = async (req: Request, res: Response) => {
  try {
    // endpoint to accept array of productos in body
    const rows = req.body.rows;
    if (!rows || !Array.isArray(rows)) return res.status(400).json({ success: false, message: 'rows array required' });

    let inserted = 0; let updated = 0;
    for (const r of rows) {
      const producto: any = {
        id: r.id || undefined,
        nombre: r.nombre || r.name || '',
        id_categoria: r.id_categoria ? Number(r.id_categoria) : 0,
        tipo: r.tipo || 'Simple',
        precio_venta: r.precio_venta ?? 0,
        costo: r.costo ?? 0,
        unidad_medida: r.unidad_medida || null,
        estado: r.estado || 'Activo'
      };
      const result = await upsertProductoByIdOrKey(producto);
      if (result.action === 'inserted') inserted++; else updated++;
    }

    return res.json({ success: true, message: 'Sync productos from JSON completed', result: { inserted, updated } });
  } catch (err: any) {
    console.error('[SYNC PRODUCTOS JSON] Error:', err);
    return res.status(500).json({ success: false, message: 'Error on sync', error: err?.message });
  }
};
