from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional

class GradoEscalaCreate(BaseModel):
    valor_porcentaje_100 : float
    valor_porcentaje_60 : float
    valor_porcentaje_50 : float
    valor_porcentaje_40 : float
    fecha_efectiva: date
    fecha_vencimiento: date

class ActualizarGradosEscalaRango(BaseModel):
    id_inicio: int
    id_fin: int
    valor_porcentaje_100 : Optional[float] = None
    valor_porcentaje_60 : Optional[float] = None
    valor_porcentaje_50 : Optional[float] = None
    valor_porcentaje_40 : Optional[float] = None
    fecha_efectiva: Optional[date] = None
    fecha_vencimiento: Optional[date] = None 

class GradoEscalaResponse(BaseModel):
    id_grado : int
    valor_porcentaje_100 : float
    valor_porcentaje_60 : float
    valor_porcentaje_50 : float
    valor_porcentaje_40 : float
    fecha_efectiva: date
    fecha_vencimiento: date
    activo: bool

class RespuestaGradoEscala(BaseModel):
    resultado: int
    mensaje: str