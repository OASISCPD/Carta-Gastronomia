import { Router } from 'express';
import multer from 'multer';
import { syncProductosFromSheet, syncProductosFromJson, createProducto, updateProducto, getAllProductos, uploadProductoImage } from '../controller/productos.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

const router = Router();

// GET /api/v1/productos -> obtener todos los productos desde la base de datos
router.get('/', getAllProductos);

// POST /api/v1/productos -> crear nuevo producto en Google Sheets
router.post('/', createProducto);
// PUT /api/v1/productos/:id -> actualizar producto en Google Sheets (solo estado, precio_venta, costo)
router.put('/:id', updateProducto);
// POST /api/v1/productos/:id/image -> subir imagen a Google Drive
router.post('/:id/image', upload.single('image'), uploadProductoImage);
// POST /api/v1/productos/sync -> desde Google Sheets (usa fetch interna)
router.post('/sync', syncProductosFromSheet);
// POST /api/v1/productos/sync/json -> enviar array de productos en body.rows
router.post('/sync/json', syncProductosFromJson);

export default router;
