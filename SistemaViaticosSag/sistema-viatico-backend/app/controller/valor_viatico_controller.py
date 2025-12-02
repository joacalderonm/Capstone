from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract
from typing import List, Optional
from fastapi import HTTPException

from app.model.valor_viatico_model import ValorViatico
from app.schema.valor_viatico_schema import ValorViaticoCreate, ValorViaticoUpdate, ValorViaticoResponse

class ValorViaticoController:
    def __init__(self, db: Session):
        self.db = db

    def create_valor_viatico(self, data: ValorViaticoCreate) -> ValorViaticoResponse:
        try:
            new_valor_viatico = ValorViatico(
                valor_base_viatico = data.valor_base_viatico,
                fecha_vigencia_hasta = data.fecha_vigencia_hasta,
                fecha_vigencia_desde = data.fecha_vigencia_desde
            )
            self.db.add(new_valor_viatico)
            self.db.commit()
            return new_valor_viatico
        except IntegrityError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def obtener_valor_viatico(self, valor_viatico_id: int) -> ValorViaticoResponse:
        valor_viatico = self.db.query(ValorViatico).filter(ValorViatico.id_valor_viatico == valor_viatico_id).first()
        if not valor_viatico:
            raise HTTPException(status_code=404, detail="Valor viático no encontrado")
        return valor_viatico
    
    def obtener_valores_viaticos(self) -> List[ValorViaticoResponse]:
        valores_viaticos = self.db.query(ValorViatico).all()
        if not valores_viaticos:
            raise HTTPException(status_code=404, detail="No se encontraron valores viáticos")
        return valores_viaticos