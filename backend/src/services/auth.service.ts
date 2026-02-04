import { pool } from '../config/db';
import { poolDB2 } from '../config/db2';
import { registerExternalUserService } from './external.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../types/database';
import { RowDataPacket } from 'mysql2';

export const loginService = async (usr: string, password: string) => {
    // Buscar primero en base local
    const [rows] = await pool.query<Usuario[]>('SELECT * FROM usuarios WHERE usr = ?', [usr]);
    const user = rows[0];

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: 'Contraseña incorrecta' };

        const token = jwt.sign({ id: user.id, nombre: user.nombre }, process.env.JWT_SECRET!, {
            expiresIn: '24h',
        });

        // Filtrar manualmente los campos que querés devolver
        const filteredUser = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            usr: user.usr,
            email: user.email,
            permisos_id: user.permisos_id,
            estado: user.estado
        };

        return { success: true, token, user: filteredUser };
    }

    // Buscar en DB2 si no se encuentra localmente
    const [externalRows] = await poolDB2.query<RowDataPacket[]>(
        `SELECT * FROM empleados_api_general 
   WHERE (legajo = ?) 
     AND estado_empleado = 'Activo' 
     AND empresa = 'Bingo Pilar'`,
        [usr]
    );
    const externalUser = externalRows[0];
    if (!externalUser) {
        return { success: false, message: 'Usuario no encontrado en ninguna base' };
    }

    // En este punto es un usuario externo validado
    // Lo registramos en la base local
    try {
        const registeredUser = await registerExternalUserService({
            legajo: externalUser.legajo,
            nombre: externalUser.nombre,
            apellido: externalUser.apellido,
            mail: externalUser.mail,
            contacto_numero: externalUser.contacto_numero,
        });


        // Generamos token con datos locales
        const token = jwt.sign(
            { id: registeredUser.id, nombre: registeredUser.nombre, permisos_id: registeredUser.permisos_id },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return { success: true, token, user: registeredUser };
    } catch (error) {
        console.error('❌ Error al registrar usuario externo en login:', error);
        return { success: false, message: 'Error al procesar el registro del usuario' };
    }
};
