import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Verificar estado en DB
        if (decoded.id) {
            // Permitir logout sin verificar estado (para que puedan salir si se desactivan)
            if (req.path === '/logout' || req.path.endsWith('/logout')) {
                (req as AuthRequest).user = decoded;
                return next();
            }

            pool.query<RowDataPacket[]>('SELECT estado FROM usuarios WHERE id = ?', [decoded.id])
                .then(([rows]) => {
                    const isActive = rows.length > 0 && rows[0].estado === 1;

                    if (!isActive) {
                        // Si inactivo, permitir solo GET
                        if (req.method === 'GET') {
                             (req as AuthRequest).user = decoded;
                             return next();
                        }
                         return res.status(403).json({ message: 'Usuario inactivo. Solo lectura.' });
                    }
                    (req as AuthRequest).user = decoded;
                    next();
                })
                .catch(err => {
                    console.error('Error verificación estado usuario:', err);
                    return res.status(500).json({ message: 'Error interno de autenticación' });
                });
        } else {
            (req as AuthRequest).user = decoded;
            next();
        }
    } catch (err: any) {
        // Diferenciar token expirado de token inválido
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ message: 'Token inválido', code: 'TOKEN_INVALID' });
    }
};