from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class PermisoCreate(BaseModel):
    codigo_permiso : str = Field(..., min_length=1, max_length=50)
    nombre_permiso : str = Field(..., min_length=1, max_length=100)
    descripcion : str = Field(..., min_length=1, max_length=200)
    tipo_operacion : str = Field(..., min_length=1, max_length=20)
    objeto_bd : str = Field(..., min_length=1, max_length=200)
    tipo_objeto : str = Field(..., min_length=1, max_length=20)

class PermisoUpdate(BaseModel):
    codigo_permiso : str = None
    nombre_permiso : str = None
    descripcion : str = None
    tipo_operacion : str = None
    objeto_bd : str = None
    tipo_objeto : str = None

class PermisoResponse(BaseModel):
    id_permiso: int
    codigo_permiso : str
    nombre_permiso : str
    descripcion : str
    tipo_operacion : str
    objeto_bd : str
    tipo_objeto : str

    class Config:
        from_attributes = True
