from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EstadoPlantillaSchema(BaseModel):
    nombre_estado_plantilla: str
    descripcion: str
    color_hex: str
    orden: int
    activo: bool

class EstadoPlantillaCreateSchema(EstadoPlantillaSchema):
    pass

class EstadoPlantillaUpdateSchema(BaseModel):
    nombre_estado_plantilla: Optional[str] = None
    descripcion: Optional[str] = None
    color_hex: Optional[str] = None
    orden: Optional[int] = None
    activo: Optional[bool] = None

class EstadoPlantillaResponseSchema(EstadoPlantillaSchema):
    id_estado_plantilla: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True