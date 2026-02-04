import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ExternalUser } from '../types/register';
import { Usuario } from '../types/database';
import { ResultSetHeader } from 'mysql2';


export const registerExternalUserService = async (user: ExternalUser) => {
    try {
        console.log('📥 Datos recibidos para registro:', user);
        
        // Verifica si ya existe en la base local
        const [existing] = await pool.query<Usuario[]>('SELECT * FROM usuarios WHERE legajo = ?', [user.legajo]);
        
        if (existing.length > 0) {
            console.log('⚠️ Usuario ya existe en la base local');
            // Devolver el usuario existente en lugar de error
            return {
                id: existing[0].id,
                nombre: existing[0].nombre,
                apellido: existing[0].apellido,
                usr: existing[0].usr,
                email: existing[0].email,
                permisos_id: existing[0].permisos_id,
                estado: existing[0].estado
            };
        }

        // Hash de la contraseña (usando legajo como password temporal)
        const passwordHash = await bcrypt.hash(user.legajo, 10);

        // ID 2 = OPERADOR  - permiso básico
        const defaultPermisosId = 2;
        console.log(`📋 Asignando permisos_id: ${defaultPermisosId} (OPERADOR)`);

        const insertQuery = `
            INSERT INTO usuarios (nombre, apellido, usr, email, password, celular, estado, permisos_id, legajo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user.nombre,
            user.apellido,
            user.legajo,               // usr
            user.mail,
            passwordHash,
            user.contacto_numero,
            1,                         // estado activo
            defaultPermisosId,         // Usar el ID del permiso que realmente existe
            user.legajo
        ];

        console.log('📝 Ejecutando INSERT con valores:', values);

        const [result] = await pool.query<ResultSetHeader>(insertQuery, values);

        console.log('✅ Usuario insertado con ID:', result.insertId);

        return {
            id: result.insertId,
            nombre: user.nombre,
            apellido: user.apellido,
            usr: user.legajo,
            email: user.mail,
            permisos_id: defaultPermisosId,
            estado: 1
        };
    } catch (error) {
        console.error('❌ Error al insertar usuario externo:', error);
        throw error; // Propagar el error para ver qué pasó realmente
    }
};
