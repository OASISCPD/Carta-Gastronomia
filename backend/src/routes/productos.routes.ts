import { Router } from 'express';
import { syncProductosFromSheet, syncProductosFromJson } from '../controller/productos.controller';

const router = Router();

// POST /api/v1/productos/sync -> desde Google Sheets (usa fetch interna)
router.post('/sync', syncProductosFromSheet);
// POST /api/v1/productos/sync/json -> enviar array de productos en body.rows
router.post('/sync/json', syncProductosFromJson);

export default router;
