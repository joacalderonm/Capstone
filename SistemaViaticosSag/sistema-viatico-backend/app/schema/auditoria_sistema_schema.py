from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class AuditoriaSistemaResponse(BaseModel):
    id_usuario: str
    tabla_afectada: str
    operacion: str
    id_registro: Optional[int] = None
    datos_anteriores: Optional[str] = None
    datos_nuevos: Optional[str] = None
    fecha_operacion: datetime

    class Config:
        from_attributes = True