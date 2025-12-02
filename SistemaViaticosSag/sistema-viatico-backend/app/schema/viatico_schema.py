from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional

class ViaticoCreate(BaseModel):
    id_plantilla: int
    id_unidad: int
    id_programa: int
    id_cuenta_presupuestaria: int
    id_motivo_cometido: int
    id_region: int
    id_producto_subesp: int
    localidad_destino: str = Field(..., min_length=1, max_length=100)
    fecha_desde: date
    fecha_hasta: date
    dias_100: int
    dias_40: int
    descripcion_cometido: Optional[str] = None
    observaciones: Optional[str] = None

class RespuestaCreacionViatico(BaseModel):
    resultado: int
    mensaje: str
    
class ViaticoUpdate(BaseModel):
    id_unidad: Optional[int] = None
    id_programa: Optional[int] = None
    id_cuenta_presupuestaria: Optional[int] = None
    id_motivo_cometido: Optional[int] = None
    id_region: Optional[int] = None
    id_producto_subesp: Optional[int] = None
    localidad_destino: Optional[str] = None 
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    dias_100: Optional[int] = None
    dias_40: Optional[int] = None
    descripcion_cometido: Optional[str] = None
    observaciones: Optional[str] = None

class RespuestaViaticoListado(BaseModel):
    id_viatico: int
    codigo_programa: int
    codigo_unidad: int
    codigo_subesp: str
    codigo_presupuestaria: int
    nombre_region: str
    dias_100: int
    dias_40: int
    total_viatico: float

    class Config:
        from_attributes = True

class ViaticoEditForm(BaseModel):
    id_viatico: int
    id_unidad: int
    id_programa: int
    id_cuenta_presupuestaria: int
    id_motivo_cometido: int
    id_region: int
    id_producto_subesp: int
    localidad_destino: str = Field(..., min_length=1, max_length=100)
    fecha_desde: date
    fecha_hasta: date 
    dias_100: int
    dias_40: int
    descripcion_cometido: str = Field(..., min_length=1, max_length=100)
    observaciones: Optional[str] = None

    # Metadatos para formulario
    titulo_formulario: str = "Editar Viatico"

    class Config:
        from_attributes = True

class RespuestaViaticoDetallado(BaseModel):
    id_viatico: int
    id_programa: int
    codigo_programa: int
    id_unidad: int
    codigo_unidad: int
    id_cuenta_presupuestaria: int
    codigo_presupuestaria: int
    id_motivo_cometido: int
    nombre_cometido: str
    id_region: int
    nombre_region: str
    id_producto_subesp: int
    codigo_subesp: int
    localidad_destino: str 
    fecha_desde: date
    fecha_hasta: date
    dias_100: int
    dias_40: int
    descripcion_cometido: Optional[str] = None
    observaciones: Optional[str] = None
    valor_viatico: float

class RespuestaActualizacion(BaseModel):
    success: bool
    message: str
    id_viatico: int
