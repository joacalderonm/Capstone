from datetime import datetime
from pydantic import BaseModel, Field 
from typing import Optional

class PlantillaCreate(BaseModel):
    id_usuario: int

class RespuestaCreacionPlantilla(BaseModel):
    resultado: int
    mensaje: str
    id_plantilla: Optional[int] = None
    
class PlantillaUpdate(BaseModel):
    total_viatico: float = None
    total_gastos: float = None
    total_general: float = None
    total_anticipo: float = None
    id_supervisor: Optional[int] = None

class ListadoPlantillaUsuario(BaseModel):
    id_usuario: int

class RespuestaPlantillaListadoUsuario(BaseModel):
    id_usuario: int
    numero_plantilla: int
    id_plantilla: int
    mes: int 
    ano: int 
    nombre_estado_plantilla: str 
    color_hex: str
    total_general: Optional[float] = None

    class Config:
        from_attributes = True

class PlantillaResponse(BaseModel):
    id_plantilla: int
    id_usuario: int
    id_usuario_supervisor: Optional[int] = None
    id_estado_plantilla: int
    numero_plantilla: int
    ano: int
    mes: int
    total_viatico: float
    total_gastos: float
    total_anticipo: float
    total_general: float
    fecha_cierre: Optional[datetime] = None 
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

class PlantillaUsuario(BaseModel):
    id_plantilla: int

class RespuestaPlantillaUsuario(BaseModel):
    numero_plantilla: int
    id_estado_plantilla: int
    fecha_creacion: datetime
    id_unidad: int
    codigo_unidad: int
    nombre_unidad: str
    nombre_usuario_completo: str
    nombre_supervisor_completo: str
    rut_completo: str
    nombre_region: str
    tipo: str
    id_grado: int
    total_viatico: float
    total_gastos: float
    total_anticipo: float
    total_general: float
    encargado_anticipo: str
    
    class Config:
        from_attributes = True

class RespuestaListadoPlantillaUnidad(BaseModel):
    id_plantilla: int
    ano: int
    mes: int
    nombre_creador: str
    numero_plantilla: int
    total_general: float

    class Config:
        from_attributes = True
class RespuestaFirmantesUnidad(BaseModel):
    """
    Schema para respuesta de firmantes de unidad
    """
    id_usuario: int
    nombre_completo: str

class RespuestaCierrePlantilla(BaseModel):
    """
    Schema para respuesta de cierre de plantilla
    """
    id_plantilla: int
    id_usuario_supervisor: int
    resultado: int
    mensaje: str

class RespuestaKPITotal(BaseModel):
    monto_total: Optional[float] = 0.0

    class Config:
        from_attributes = True

class RespuestaKPIPorProducto(RespuestaKPITotal):
    codigo_subesp: str
    
    class Config:
        from_attributes = True

class RespuestaKPIConteoPlantilla(BaseModel):
    total_plantillas: Optional[int] = 0
    total_plantillas_cerradas: Optional[int] = 0

    class Config:
        from_attributes = True