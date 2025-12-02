export interface PlantillaCreate {
  id_usuario: number;
}

export interface RespuestaCreacionPlantilla {
  resultado: number;
  mensaje: string;
  id_plantilla?: number;
}

export interface PlantillaUpdate {
  total_viatico?: number;
  total_gastos?: number;
  total_general?: number;
  id_supervisor?: number;
}

export interface RespuestaPlantillaListadoUsuario {
  id_usuario: number;
  id_plantilla: number;
  mes: number;
  ano: number;
  nombre_estado_plantilla: string;
  color_hex: string;
  total_general?: number;
  nombre_creador?: string;
}

export interface ViaticoCreate {
  id_plantilla: number;
  id_unidad: number;
  id_programa: number;
  id_cuenta_presupuestaria: number;
  id_motivo_cometido: number;
  id_region: number;
  id_producto_subesp: number;
  id_valor_viatico: number;
  localidad_destino: string;
  fecha_desde: string;
  fecha_hasta: string;
  dias_100: number;
  dias_40: number;
  descripcion_cometido?: string;
  observaciones?: string;
}

export interface AnticipoCreate {
  id_plantilla: number;
  id_unidad: number;
  id_programa: number;
  id_cuenta_presupuestaria: number;
  id_motivo_cometido: number;
  id_region: number;
  id_producto_subesp: number;
  id_valor_viatico: number;
  localidad_destino: string;
  fecha_desde: string;
  fecha_hasta: string;
  dias_100: number;
  dias_40: number;
  descripcion_cometido?: string;
  observaciones?: string;
}

export interface RespuestaPlantillaUsuario {
  id_plantilla: number;
  numero_plantilla: number;
  id_estado_plantilla: number;
  fecha_creacion: string;
  id_unidad: number;
  nombre_unidad: string;
  codigo_unidad: string;
  nombre_supervisor_completo: string;
  encargado_anticipo: string;
  nombre_usuario_completo: string;
  rut_completo: string;
  nombre_region: string;
  tipo: string;
  id_grado: number;
  total_viatico: number;
  total_gastos: number;
  total_general: number;
  total_anticipo: number;
}