import mysql from 'mysql2/promise';
import { config } from './index';

export const poolDB2 = mysql.createPool({
    host: config.db2.host,
    user: config.db2.user,
    password: config.db2.password,
    database: config.db2.database,
    port: config.db2.port,
    waitForConnections: true,
    connectionLimit: config.db2.connectionLimit,
    queueLimit: 0,
});