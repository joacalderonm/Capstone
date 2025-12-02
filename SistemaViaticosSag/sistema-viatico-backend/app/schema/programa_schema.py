from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class ProgramaCreate(BaseModel):
    codigo_programa: int
    nombre_programa: Optional[str] = Field(..., max_length=50)

class ProgramaUpdate(BaseModel):
    codigo_programa: Optional[int] = None
    nombre_programa: Optional[str] = Field(..., max_length=50)
    activo: Optional[bool] = None

class ProgramaResponse(BaseModel):
    id_programa: int
    codigo_programa: int
    nombre_programa: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True

class ProgramaCambiarEstado(BaseModel):
    activo: bool

class RespuestaPrograma(BaseModel):
    exito: int
    mensaje: str
    id_programa: Optional[int] = None