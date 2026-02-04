import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

/**
 * Middleware que valida el estado del usuario consultando la DB cuando es posible.
 * Reglas:
 * - Permite `/logout`.
 * - Si existe `req.session.estado` se ignora y se consulta la DB si hay `user.id`.
 * - Si `req.user.id` está presente (puesto por `authenticateToken`) se consulta la DB
 *   para obtener el `estado` más reciente y así reflejar cambios hechos por admin.
 */
export const checkUserState = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/logout' || req.path.endsWith('/logout')) return next();

    const authReq = req as AuthRequest;

    // Si tenemos un user con id, preferimos consultar DB para estado actual
    if (authReq.user && typeof authReq.user === 'object' && (authReq.user as any).id) {
        const userId = (authReq.user as any).id;
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT estado FROM usuarios WHERE id = ?', [userId]);
            const isActive = rows.length > 0 && rows[0].estado === 1;
            if (!isActive) {
                return res.status(403).json({ message: 'Usuario desactivado' });
            }
            return next();
        } catch (err) {
            console.error('Error verificando estado usuario (DB):', err);
            return res.status(500).json({ message: 'Error interno' });
        }
    }

    // Si no hay user.id y existe session.estado, respetarlo (fallback)
    const sessionEstado = (req as any).session?.estado;
    if (typeof sessionEstado !== 'undefined' && Number(sessionEstado) === 0) {
        return res.status(403).json({ message: 'Usuario desactivado' });
    }

    return next();
};
