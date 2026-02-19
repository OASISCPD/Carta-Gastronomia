import { Request, Response } from 'express';
import { upsertProductoByIdOrKey } from '../services/productos.service';
import { fetchProductos } from '../../scripts/productos/fetchProductos';
import { insertProductoInSheet, updateProductoInSheet, updateProductoImageUrl } from '../services/googleSheets.service';
import { generateAppSheetId } from '../utils/idGenerator';
import { getAllProductosService } from '../services/productos.list.service';
import { uploadImageToDrive } from '../services/drive.service';
import { insertImagenProducto } from '../services/imagenes_productos.service';
import { pool } from '../config/db';

/**
 * POST /api/v1/productos
 * Crea un nuevo producto en Google Sheets con ID tipo AppSheet
 */
export const createProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, id_categoria, tipo, precio_venta, costo, unidad_medida, estado } = req.body;

    // Validar campos requeridos
    if (!nombre || !id_categoria || !tipo || precio_venta === undefined || costo === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campos requeridos: nombre, id_categoria, tipo, precio_venta, costo' 
      });
    }

    // Generar ID tipo AppSheet
    const id = generateAppSheetId();

    const producto = {
      id,
      nombre,
      id_categoria: Number(id_categoria),
      tipo,
      precio_venta: Number(precio_venta),
      costo: Number(costo),
      unidad_medida: unidad_medida || null,
      estado: estado || 'Activo'
    };

    // Insertar en Google Sheets
    await insertProductoInSheet(producto);

    return res.status(201).json({ 
      success: true, 
      message: 'Producto creado en Google Sheets', 
      data: producto 
    });
  } catch (err: any) {
    console.error('[CREATE PRODUCTO] Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear producto', 
      error: err?.message 
    });
  }
};

/**
 * PUT /api/v1/productos/:id
 * Actualiza un producto existente en Google Sheets
 * Solo permite editar: estado, precio_venta, costo
 */
export const updateProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, precio_venta, costo } = req.body;

    // Validar que el ID está presente
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID del producto requerido' 
      });
    }

    // Validar que se envió al menos un campo para actualizar
    if (estado === undefined && precio_venta === undefined && costo === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Debe proporcionar al menos un campo para actualizar: estado, precio_venta, costo' 
      });
    }

    // Preparar objeto de actualización solo con campos permitidos
    const updates: any = {};
    if (estado !== undefined) updates.estado = estado;
    if (precio_venta !== undefined) updates.precio_venta = Number(precio_venta);
    if (costo !== undefined) updates.costo = Number(costo);

    // Actualizar en Google Sheets
    const result = await updateProductoInSheet(id, updates);

    if (!result.found) {
      return res.status(404).json({ 
        success: false, 
        message: `Producto con ID ${id} no encontrado en Google Sheets` 
      });
    }

    if (!result.updated) {
      return res.status(400).json({ 
        success: false, 
        message: 'No hay cambios para actualizar' 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Producto actualizado en Google Sheets', 
      data: { id, updates } 
    });
  } catch (err: any) {
    console.error('[UPDATE PRODUCTO] Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar producto', 
      error: err?.message 
    });
  }
};

/**
 * GET /api/v1/productos
 * Devuelve todos los productos desde la base de datos
 */
export const getAllProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await getAllProductosService();
    return res.json({ success: true, data: productos });
  } catch (err: any) {
    console.error('[GET ALL PRODUCTOS] Error:', err);
    return res.status(500).json({ success: false, message: 'Error al obtener productos', error: err?.message });
  }
};

/**
 * POST /api/v1/productos/:id/image
 * Sube una imagen a Google Drive y devuelve los links
 * Body: multipart/form-data con campo "image"
 */
export const uploadProductoImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Imagen requerida (field: image)' });
    }

    // Validar que sea imagen
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: `Tipo no permitido: ${file.mimetype}. Solo jpeg, png, webp, gif.` });
    }

    // Nombre con prefijo de id del producto para fácil identificación
    const ext = file.originalname.split('.').pop() || 'jpg';
    const filename = `producto_${id}_${Date.now()}.${ext}`;

    const result = await uploadImageToDrive(file.buffer, filename, file.mimetype);

    // 1. Guardar registro en imagenes_productos
    await insertImagenProducto({
      producto_id:      id,
      file_id:          result.fileId,
      file_name:        result.fileName,
      web_view_link:    result.webViewLink,
      web_content_link: result.webContentLink,
      direct_link:      result.directLink,
    });

    // 2. Actualizar url_image en la tabla productos
    await pool.query(
      `UPDATE productos SET url_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [result.directLink, id]
    );

    // 3. Actualizar url_imagen en Google Sheets (no falla la respuesta si el sheet falla)
    try {
      await updateProductoImageUrl(id, result.directLink);
    } catch (sheetErr: any) {
      console.warn('[UPLOAD IMAGE] No se pudo actualizar Google Sheets:', sheetErr?.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Imagen subida a Google Drive',
      data: {
        productoId: id,
        ...result,
      },
    });
  } catch (err: any) {
    console.error('[UPLOAD IMAGE] Error:', err);
    return res.status(500).json({ success: false, message: 'Error al subir imagen', error: err?.message });
  }
};

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
        id_categoria: r.id_categoria != null ? String(r.id_categoria).trim() : '',
        tipo: r.tipo || 'Simple',
        precio_venta: r.precio_venta ?? 0,
        costo: r.costo ?? 0,
        unidad_medida: r.unidad_medida || null,
        estado: r.estado || 'Activo',
        url_image: r.url_image || r.imagen_url || r.image || r.image_url || null
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
        id_categoria: r.id_categoria != null ? String(r.id_categoria).trim() : '',
        tipo: r.tipo || 'Simple',
        precio_venta: r.precio_venta ?? 0,
        costo: r.costo ?? 0,
        unidad_medida: r.unidad_medida || null,
        estado: r.estado || 'Activo',
        url_image: r.url_image || r.imagen_url || r.image || r.image_url || null
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
