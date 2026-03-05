import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta';
const PUBLIC_ROUTES = ['/login', '/api', '/assets', '/vite.svg'];

/**
 * Middleware para verificar autenticación en rutas del frontend
 * Si no hay token válido en cookies, redirige a /login
 */
export const frontendAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Si es ruta de API o assets, pasar al siguiente middleware
    if (PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
        return next();
    }

    // Intentar obtener token de cookies o headers
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '') || undefined;

    // Helper: request busca JSON (API) o HTML (navegación)
    const expectsJson = req.headers.accept?.includes('application/json') || req.xhr || req.path.startsWith('/api');

    if (!token) {
        if (expectsJson) {
            return res.status(401).json({ success: false, message: 'no autorizado' });
        }
        // Para navegación HTML dejamos que el SPA maneje la redirección al login
        return next();
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        // Verificar estado en DB
        if (decoded.id) {
            pool.query<RowDataPacket[]>('SELECT estado FROM usuarios WHERE id = ?', [decoded.id])
                .then(([rows]) => {
                    const isActive = rows.length > 0 && rows[0].estado === 1;

                    if (!isActive) {
                        // Si espera JSON (API call interna)
                        if (expectsJson) {
                            // Permitir GET (read-only)
                            if (req.method === 'GET') {
                                return next();
                            }
                            return res.status(403).json({ success: false, message: 'Usuario inactivo. Solo lectura.' });
                        }
                        // Si es navegacion HTML -> permitir siempre para que el frontend maneje la UI (Home, Footer, etc)
                        return next();
                    }
                    return next();
                })
                .catch(err => {
                    console.error('Error verificación estado usuario (frontend):', err);
                    if (expectsJson) {
                        return res.status(500).json({ success: false, message: 'Error interno' });
                    }
                    return next();
                });
        } else {
            return next();
        }
    } catch (error) {
        if (expectsJson) {
            return res.status(401).json({ success: false, message: 'token inválido o expirado' });
        }
        // Para peticiones de HTML, permitimos servir index.html y que el frontend decida
        return next();
    }
};
