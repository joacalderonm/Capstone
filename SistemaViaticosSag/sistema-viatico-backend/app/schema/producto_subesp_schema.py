from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class ProductoSubespCreate(BaseModel):
    codigo_subesp: str = Field(..., max_length=20)
    descripcion: Optional[str] = Field(..., max_length=50)

class ProductoSubespUpdate(BaseModel):
    codigo_subesp: Optional[str] = Field(..., max_length=20)
    descripcion: Optional[str] = Field(..., max_length=50)
    activo: Optional[bool] = None

class ProductoSubespResponse(BaseModel):
    id_producto_subesp: int
    codigo_subesp: Optional[str] = None
    descripcion: Optional[str] = None
    activo : Optional[bool] = None

    class Config:
        from_attributes = True

class ProductoSubespCambiarEstado(BaseModel):
    activo: bool

class RespuestaProductoSubesp(BaseModel):
    exito: bool
    mensaje: str
    id_producto_subesp: Optional[int] = None