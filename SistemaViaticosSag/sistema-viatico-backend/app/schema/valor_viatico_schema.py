from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class ValorViaticoCreate(BaseModel):
    valor_base_viatico : int
    fecha_vigencia_hasta : datetime
    fecha_vigencia_desde : datetime

class ValorViaticoUpdate(BaseModel):
    valor_base_viatico : int = None
    fecha_vigencia_hasta : datetime = None
    fecha_vigencia_desde : datetime = None

class ValorViaticoResponse(BaseModel):
    id_valor_viatico : int
    valor_base_viatico : int
    fecha_vigencia_hasta : datetime
    fecha_vigencia_desde : datetime
