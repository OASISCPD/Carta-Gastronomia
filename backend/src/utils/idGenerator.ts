import crypto from 'crypto';

/**
 * Genera un ID tipo AppSheet (8 caracteres hexadecimales)
 * Ejemplos: 0c6e15c4, ff83306f, 4af5c8bc
 */
export function generateAppSheetId(): string {
  return crypto.randomBytes(4).toString('hex');
}
