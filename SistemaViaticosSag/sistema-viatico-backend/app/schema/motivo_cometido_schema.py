from pydantic import BaseModel, Field
from typing import Optional

class MotivoCometidoCreate(BaseModel):
    nombre_cometido : str = Field(..., max_length=50)
    descripcion_cometido : str = Field(..., max_length=100) 

class MotivoCometidoUpdate(BaseModel):
    nombre_cometido : Optional[str] = Field(None, max_length=50)
    descripcion_cometido : Optional[str] = Field(None, max_length=100)
    activo : Optional[bool] 

class MotivoCometidoResponse(BaseModel):
    id_motivo_cometido : int
    nombre_cometido : str
    descripcion_cometido : str
    activo: bool

    class Config:
        from_attributes = True

class MotivoCometidoCambiarEstado(BaseModel):
    activo: bool

class RespuestaMotivoCometido(BaseModel):
    exito: bool
    mensaje: str
    id_motivo_cometido: Optional[int]