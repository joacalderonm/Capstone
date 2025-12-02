from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class CalidadJuridicaCreate(BaseModel):
    tipo: str
    descripcion: Optional[str] = None

class CalidadJuridicaUpdate(BaseModel):
    tipo: Optional[str] = None
    descripcion: Optional[str] = None

class CalidadJuridicaResponse(BaseModel):
    id_calidad_juridica: int
    tipo: str
    descripcion: Optional[str] = None
    fecha_creacion: datetime

    class Config:
        from_attributes = True



    
