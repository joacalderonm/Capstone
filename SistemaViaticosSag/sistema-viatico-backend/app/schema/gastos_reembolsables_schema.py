from datetime import date
from typing import Optional
from pydantic import BaseModel

class CrearGastoReembolsable(BaseModel):
    id_plantilla: int
    id_tipo_gasto: int
    id_programa: int
    id_producto_subesp: int
    numero_documento: str
    fecha: date
    valor: float
    descripcion: str

class ActualizarGastoReembolsable(BaseModel):
    id_tipo_gasto: Optional[int] = None
    id_programa: Optional[int] = None
    id_producto_subesp: Optional[int] = None
    numero_documento: Optional[str] = None
    fecha: Optional[date] = None
    valor: Optional[float] = None
    descripcion: Optional[str] = None

class GastoReembolsableResponse(BaseModel):
    id_tipo_gasto: int
    id_programa: int
    id_producto_subesp: int
    numero_documento: str
    valor: float
    descripcion: str

class GastoReembolsableSimple(BaseModel):
    id_gasto_reembolsable: int
    id_tipo_gasto: int
    id_programa: int
    id_producto_subesp: int
    numero_documento: str
    fecha: date
    valor: float
    descripcion: str

    # Metadatos para formulario
    titulo_formulario: str = "Editar Gasto Reembolsable"

    class Config:
        from_attributes = True

class RespuestaCreacionGastoReembolsable(BaseModel):
    resultado: int
    mensaje: str

class GastoReembolsableDetallado(BaseModel):
    id_gasto_reembolsable: int
    descripcion_gasto: str
    codigo_programa: int
    codigo_subesp: str
    numero_documento: str
    fecha: date
    valor: float
    descripcion: str