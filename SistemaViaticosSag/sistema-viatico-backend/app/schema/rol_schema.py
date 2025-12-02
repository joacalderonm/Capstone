from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class RolCreate(BaseModel):
    nombre_rol: str
    descripcion: str

class RolUpdate(BaseModel):
    nombre_rol: str = None
    descripcion: str = None
    activo: bool = None

class RolResponse(BaseModel):
    id_rol: int
    nombre_rol: str
    descripcion : str
    activo: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True
