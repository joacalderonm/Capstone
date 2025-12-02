from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RespuestaUsuarioPdf(BaseModel):
    fecha_creacion: datetime
    numero_plantilla: int
    nombre_usuario: str
    rut_completo: str
    codigo_unidad: int
    nombre_unidad: str
    nombre_calidad: str
    id_grado: int
    nombre_region: str
    valor_viatico: int
    director: str
    total_anticipo: int
    total_viatico: int
    total_gastos: int
    total_general: int
    total_liquidacion:int
    
    class Config:
        from_attributes = True

class RespuestaAnticipoPdf(BaseModel):
    dias_100: int
    dias_40: int
    total_viatico: int
    fecha_desde: datetime
    fecha_hasta: datetime
    nombre_region: str
    localidad_destino: str
    nombre_cometido: str
    nombre_programa: str
    registro_cuenta_presupuestaria: str
    codigo_programa: int
    codigo_subesp: str
    descripcion_cometido: str
    encargado_anticipo: Optional[str]
    total_dias_100: int
    total_dias_40: int

    class Config:
        from_attributes = True

class RespuestaViaticoPdf(BaseModel):
    codigo_unidad: int
    dias_100: int
    dias_40: int
    total_viatico: int
    fecha_desde: datetime
    fecha_hasta: datetime
    nombre_region: str
    localidad_destino: str
    nombre_cometido: str
    nombre_programa: str
    registro_cuenta_presupuestaria: str
    meses_rendicion: str
    codigo_subesp: str
    valor_porcentaje_100: int
    valor_porcentaje_40: int
    total_dias_100: int
    total_dias_40: int

    class Config:
        from_attributes = True