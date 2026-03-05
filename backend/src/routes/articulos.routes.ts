import { Router } from 'express';
import {
  getArticulos,
  getArticuloById,
  createArticulo,
  updateArticulo,
  deleteArticulo,
  getCategorias,
  syncArticulos,
  syncArticuloRow,
} from '../controller/articulos.controller';
// no auth middleware: este servidor no exige tokens

const router = Router();

// Rutas públicas (sin autenticación si lo deseas, o añade authenticateToken)
router.get('/', getArticulos);
router.get('/categorias/list', getCategorias);
router.get('/:id', getArticuloById);
router.post('/sync', syncArticulos);
router.post('/sync/row', syncArticuloRow);

// Rutas de escritura (actualmente sin autenticación)
router.post('/', createArticulo);
router.put('/:id', updateArticulo);
router.delete('/:id', deleteArticulo);

export default router;
