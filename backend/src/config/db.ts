import mysql from 'mysql2/promise';
import { config } from './index';

export const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0,
    // Asegurar que la conexión use la zona horaria correcta.
    // Puedes configurar DB_TIMEZONE en el .env (ej: "-03:00" o "Z" para UTC).
    timezone: process.env.DB_TIMEZONE || '-03:00',
});

