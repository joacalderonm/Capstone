export interface BackendUser {
  id_usuario: number;
  id_autenticador_firebase?: number;
  id_rol?: number;
  id_unidad?: number;
  id_region?: number;
  id_calidad_juridica?: number;
  id_grado?: number;
  nombre_usuario: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  rut_completo?: string;
  correo: string;
  nombre_rol: string;
  nombre_unidad: string;
  nombre_region: string;
  nombre_calidad_juridica: string | null;
  tipo?: string | null;
  activo: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string | null;
}

export interface UsuarioEditForm {
  id_usuario?: number;
  id_rol: number;
  id_unidad: number;
  id_region: number;
  id_calidad_juridica: number;
  id_grado: number;
  nombre_usuario: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut?: number;
  correo?: string;
  activo: boolean;
  titulo_formulario: string;
  puede_eliminar: boolean;
}
