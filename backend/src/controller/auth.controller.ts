import { Request, Response } from 'express'
import { loginService } from '../services/auth.service';

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { usr, password } = req.body;
        if (!usr || !password) {
            return res.status(404).json({ message: "Los campos username y password son requeridos" });
        }
        const result = await loginService(usr, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.json({ token: result.token, user: result.user });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno', error });
    }
};

export const logoutUser = (req:Request, res:Response) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Sesion cerrada correctamente' });
};

