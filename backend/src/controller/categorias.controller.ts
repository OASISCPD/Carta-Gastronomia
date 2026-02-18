import { Request, Response } from 'express';
import { upsertCategoriaByIdOrKey, getAllCategoriasService } from '../services/categorias.service';
import { fetchProductos } from '../../scripts/productos/fetchProductos';

export const syncCategoriasFromSheet = async (req: Request, res: Response) => {
  try {
    const safeBody = req && typeof req.body === 'object' ? req.body as any : {};
    const spreadsheetId = safeBody.spreadsheetId || req.query?.spreadsheetId || process.env.SPREADSHEET_ID_PRODUCTOS || process.env.SPREADSHEET_ID;
    const sheetName = safeBody.sheetName || req.query?.sheetName || 'CATEGORIA_PRODUCTOS';

    if (!spreadsheetId) return res.status(400).json({ success: false, message: 'spreadsheetId required' });

    const rows = await fetchProductos(String(spreadsheetId), String(sheetName));
    if (!rows || !Array.isArray(rows)) return res.status(500).json({ success: false, message: 'No se obtuvieron filas' });

    let inserted = 0; let updated = 0;
    for (const r of rows) {
      const categoria: any = {
        id: r.id || undefined,
        nombre: r.nombre || r.name || '',
        display_order: r.display_order !== undefined ? Number(r.display_order) : 0,
        estado: r.estado || 'Activo'
      };
      const result = await upsertCategoriaByIdOrKey(categoria);
      if (result.action === 'inserted') inserted++; else updated++;
    }

    return res.json({ success: true, message: 'Sync categorias completed', result: { inserted, updated } });
  } catch (err: any) {
    console.error('[SYNC CATEGORIAS] Error:', err);
    return res.status(500).json({ success: false, message: 'Error on sync', error: err?.message });
  }
};

export const getAllCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await getAllCategoriasService();
    return res.json({ success: true, data: categorias });
  } catch (err: any) {
    console.error('[GET CATEGORIAS] Error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching categorias', error: err?.message });
  }
};
