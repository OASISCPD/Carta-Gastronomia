import { Router } from 'express';
import { syncCategoriasFromSheet, getAllCategorias } from '../controller/categorias.controller';

const router = Router();

// GET /api/v1/categorias -> listar categorias
router.get('/', getAllCategorias);
// POST /api/v1/categorias/sync -> sincronizar desde Google Sheets
router.post('/sync', syncCategoriasFromSheet);

export default router;
