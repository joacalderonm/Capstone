from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class RegionCreate(BaseModel):
    codigo_region: str
    nombre_region: str

class RegionUpdate(BaseModel):
    codigo_region: str = None
    nombre_region: str = None
    activo: bool = None

class RegionResponse(BaseModel):
    id_region: int
    codigo_region: str
    nombre_region: str
    activo: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class RegionEditForm(BaseModel):
    id_region: int
    codigo_region: str = Field(..., min_length=1, max_length=100)
    nombre_region: str = Field(..., min_length=1, max_length=100)
    activo: Optional[bool] = None
    fecha_creacion: Optional[datetime] = None

    titulo_formulario: Optional[str] = None