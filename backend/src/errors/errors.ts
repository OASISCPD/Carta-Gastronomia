import { Response } from 'express';

export const handleError = (res: Response, error: unknown, message: string) => {
    console.error('❌ Error en controlador:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message, error: errorMessage });
};

export const handleErrorDatabase = (error: unknown, context: string = '') => {
    console.error(`❌ Error en base de datos${context ? ` (${context})` : ''}:`, error);
    throw new Error(`Database error: ${context || 'Error desconocido'}`);
};
