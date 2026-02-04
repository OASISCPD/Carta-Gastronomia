// Shim: algunas versiones de Node no exponen `SlowBuffer` globalmente y
// paquetes antiguos (p.ej. buffer-equal-constant-time) esperan `SlowBuffer`.
// Si el compañero ve "Cannot read properties of undefined (reading 'prototype')",
// esta línea previene el crash.
if (typeof (global as any).SlowBuffer === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SlowBuffer } = require('buffer');
    (global as any).SlowBuffer = SlowBuffer;
}

import { app } from './app';
import { pool } from './config/db';
import { poolDB2 } from './config/db2';

const PORT = process.env.PORT || 3005;

interface DatabaseConnection {
    name: string;
    test: () => Promise<void>;
}

/**
 * Prueba la conexión a una base de datos MySQL
 */
async function testMySQLConnection(pool: any, dbName: string): Promise<void> {
    const conn = await pool.getConnection();
    conn.release();
    console.log(`✅ Conexión a ${dbName} exitosa`);
}

/**
 * Verifica todas las conexiones a las bases de datos
 */
async function testDatabaseConnections(): Promise<boolean> {
    const connections: DatabaseConnection[] = [
        {
            name: 'MySQL Principal',
            test: () => testMySQLConnection(pool, 'MySQL Principal')
        },
        {
            name: 'MySQL DB2(53) (api_etl_workia)',
            test: () => testMySQLConnection(poolDB2, 'MySQL DB2(53)')
        },
    ];

    console.log('🔄 Verificando conexiones a bases de datos...\n');

    const results = await Promise.allSettled(
        connections.map(conn => conn.test())
    );

    let allSuccessful = true;
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`❌ Error en ${connections[index].name}:`, result.reason);
            allSuccessful = false;
        }
    });

    return allSuccessful;
}

/**
 * Inicia el servidor después de verificar las conexiones
 */
async function startServer() {
    try {
        const dbConnectionsOk = await testDatabaseConnections();

        if (!dbConnectionsOk) {
            throw new Error('Una o más conexiones a bases de datos fallaron');
        }

        console.log('\n✅ Todas las conexiones a bases de datos establecidas correctamente\n');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('\n❌ Error fatal al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
