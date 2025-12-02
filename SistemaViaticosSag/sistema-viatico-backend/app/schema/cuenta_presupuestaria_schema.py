from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class CuentaPresupuestariaCreate(BaseModel):
    codigo_presupuestaria: str = Field(..., min_length=1, max_length=30)
    nombre_presupuestaria: str = Field(..., min_length=1, max_length=50)
    activo: bool = True

class CuentaPresupuestariaUpdate(BaseModel):
    codigo_presupuestaria: Optional[str] = Field(None, min_length=1, max_length=30)
    nombre_presupuestaria: Optional[str] = Field(None, min_length=1, max_length=50)
    activo: Optional[bool] = None

class CuentaPresupuestariaResponse(BaseModel):
    id_cuenta_presupuestaria: int
    codigo_presupuestaria: str
    nombre_presupuestaria: str
    activo: bool

    class Config:
        from_attributes = True

class CuentaPresupuestariaCambiarEstado(BaseModel):
    """
    Schema para activar/desactivar la cuenta presupuestaria
    """
    activo: bool

class RespuestaCuentaPresupuestaria(BaseModel):
    """
    Schema para la respuesta del cambio de estado
    """
    exito: bool
    mensaje: str
    id_cuenta_presupuestaria: Optional[int] = None