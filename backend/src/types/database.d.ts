import { RowDataPacket } from 'mysql2';

export interface Usuario extends RowDataPacket {
    id: number;
    nombre: string;
    apellido: string;
    usr: string;
    email: string;
    password: string;
    celular?: string;
    estado: number;
    permisos_id: number;
    fecha_registro?: Date;
    legajo: string;
}

export interface EmpleadoMetabase {
    empresa: string;
    description?: string;
    working_day?: string;
    [key: string]: unknown;
}

// Exportar tipos de viajes
export * from './trip';
