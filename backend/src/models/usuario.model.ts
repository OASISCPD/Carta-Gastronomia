export interface Usuario {
    id?: number;
    nombre: string;
    usr: string;
    email?: string;
    password: string;
    celular?: string;
    estado: number;
    permisos_id: number;
    fecha_registro: string;
    legajo: number;
}
