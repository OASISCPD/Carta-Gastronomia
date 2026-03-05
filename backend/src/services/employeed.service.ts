import fetch from 'node-fetch';
import { pool } from '../config/db';
import { Usuario, EmpleadoMetabase } from '../types/database';

export const searchUsuarios = async (query: string) => {
    const searchTerm = `%${query}%`;
    const sql = `
        SELECT 
            id, 
            nombre, 
            apellido, 
            usr, 
            email, 
            permisos_id, 
            fecha_registro, 
            legajo 
        FROM usuarios 
        WHERE nombre LIKE ? 
            OR apellido LIKE ? 
            OR usr LIKE ? 
            OR email LIKE ?
            OR legajo LIKE ?
        ORDER BY nombre, apellido
        LIMIT 50
    `;

    const [rows] = await pool.query<Usuario[]>(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
    return rows;
};



export const fetchEmployeesFromMetabase = async (date: string) => {
    const response = await fetch(
        'https://metabase.hcwork.com/api/card/18078/query/json?format_rows=true',
        {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'x-api-key': process.env.METABASE_API_KEY!,
            },
            body: new URLSearchParams({
                parameters: JSON.stringify([
                    { type: 'text', value: date, target: ['variable', ['template-tag', 'fecha_inicio']] },
                    { type: 'text', value: date, target: ['variable', ['template-tag', 'fecha_fin']] }
                ])
            })
        }
    );


    if (!response.ok) {
        throw new Error(`Error en Metabase: ${response.status}`);
    }

    const data = await response.json() as EmpleadoMetabase[];

    // Filtrar empleados con working_day === 'false' (string)
    /*   const filteredEmployees = data.filter((empleado: EmpleadoMetabase) => {
          // working_day debe ser el string 'false'
          if (empleado.working_day !== 'false') return false;
  
          // Solo de Bingo Pilar
          if (empleado.empresa !== 'Bingo Pilar') return false;
          return true;
      });
   */

    return data;
};

/**
 * Obtener todos los usuarios sin el campo password
 */
export const getAllUsuarios = async () => {
    const sql = `
            SELECT
                u.id,
                u.nombre,
                u.apellido,
                u.usr,
                u.email,
                u.celular,
                u.estado,
                u.permisos_id,
                p.nombre AS permiso_nombre,
                u.fecha_registro,
                u.legajo
            FROM usuarios u
            LEFT JOIN permisos p ON p.id = u.permisos_id
            ORDER BY u.nombre, u.apellido
        `;
    const [rows] = await pool.query<any[]>(sql);
    return rows;
};

/**
 * Actualizar un campo permitido de la tabla `usuarios`.
 * Evitamos SQL injection validando el nombre de campo contra una lista blanca.
 */
export const updateUsuarioField = async (usuarioId: number, field: string, value: any) => {
    const allowedFields: Record<string, 'number' | 'string' | 'any'> = {
        nombre: 'string',
        apellido: 'string',
        email: 'string',
        celular: 'string',
        permisos_id: 'number',
        estado: 'string',
        legajo: 'string'
    };
    // Validaciones básicas
    if (!Number.isFinite(Number(usuarioId))) {
        throw new Error('ID de usuario inválido');
    }

    if (!field || typeof field !== 'string') {
        throw new Error('Campo inválido');
    }

    if (!Object.prototype.hasOwnProperty.call(allowedFields, field)) {
        throw new Error('Campo no permitido para actualizar');
    }

    try {
        // Coerce value types
        const expected = allowedFields[field];
        let param: any = value;
        if (expected === 'number') {
            const n = Number(value);
            if (!Number.isFinite(n)) throw new Error('Valor no numérico para campo ' + field);
            param = n;
        } else if (expected === 'string') {
            param = value !== null && value !== undefined ? String(value) : null;
        }

        const sql = `UPDATE usuarios SET ${field} = ? WHERE id = ?`;
        const [result] = await pool.query<any>(sql, [param, usuarioId]);

        // Devolver usuario actualizado (sin password)
        const [rows] = await pool.query<any[]>(`SELECT id, nombre, apellido, usr, email, celular, estado, permisos_id, legajo FROM usuarios WHERE id = ?`, [usuarioId]);
        return rows[0] ?? null;
    } catch (err) {
        console.error('❌ Error en updateUsuarioField:', err);
        throw err instanceof Error ? new Error(`Error actualizando usuario: ${err.message}`) : new Error('Error actualizando usuario');
    }
};
