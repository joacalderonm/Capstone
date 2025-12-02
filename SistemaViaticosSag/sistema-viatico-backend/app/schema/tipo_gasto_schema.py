from pydantic import BaseModel

class TipoGastoCreate(BaseModel):
    codigo_gasto: str
    descripcion_gasto: str

class TipoGastoUpdate(BaseModel):
    codigo_gasto: str = None
    descripcion_gasto: str = None

class TipoGastoResponse(BaseModel):
    id_tipo_gasto: int
    codigo_gasto: str
    descripcion_gasto: str

    class Config:
        from_attributes = True