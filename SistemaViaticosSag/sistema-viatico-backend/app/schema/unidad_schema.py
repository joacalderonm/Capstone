from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class UnidadCreate(BaseModel):
    codigo_unidad: Optional[str] = None 
    nombre_unidad: str 
    id_jefe: Optional[int] = None
    id_padre: Optional[int] = None

class UnidadUpdate(BaseModel):
    codigo_unidad: Optional[str] = None
    nombre_unidad: Optional[str] = None
    id_jefe: Optional[int] = None
    activo: Optional[bool] = None

class UnidadResponse(BaseModel):
    id_unidad: int
    codigo_unidad: Optional[str] = None
    nombre_unidad: Optional[str] = None
    id_jefe: Optional[int] = None
    nombre_jefe: Optional[str] = None
    activo: Optional[bool] = None

    class Config:
        from_attributes = True

class UnidadCambiarEstado(BaseModel):
    activo: bool

class RespuestaUnidad(BaseModel):
    exito: bool
    mensaje: str
    id_unidad: Optional[int] = None
