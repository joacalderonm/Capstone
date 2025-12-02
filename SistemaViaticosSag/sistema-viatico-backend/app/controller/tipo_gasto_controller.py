from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from typing import List, Optional

from app.model.tipo_gasto_model import TipoGasto
from app.schema.tipo_gasto_schema import TipoGastoCreate, TipoGastoUpdate, TipoGastoResponse

class TipoGastoController:
    def __init__(self, db: Session):
        self.db = db
    
    def create_tipo_gasto(self, data: TipoGastoCreate) -> TipoGastoResponse:
        """Crea un tipo de gasto"""
        try:
            tipo_gasto = TipoGasto(
                codigo_gasto=data.codigo_gasto,
                descripcion_gasto=data.descripcion_gasto
            )
            self.db.add(tipo_gasto)
            self.db.commit()
            return TipoGastoResponse.from_orm(tipo_gasto)
        except IntegrityError:
            raise ValueError("Ya existe un tipo de gasto con el mismo codigo")
    
    def update_tipo_gasto(self, id_tipo_gasto: int, data: TipoGastoUpdate) -> TipoGastoResponse:
        """Actualiza un tipo de gasto"""
        tipo_gasto = self.db.query(TipoGasto).filter(TipoGasto.id_tipo_gasto == id_tipo_gasto).first()
        if not tipo_gasto:
            raise ValueError("Tipo de gasto no encontrado")
        try:
            tipo_gasto.codigo_gasto = data.codigo_gasto
            tipo_gasto.descripcion_gasto = data.descripcion_gasto
            self.db.commit()
            return TipoGastoResponse.from_orm(tipo_gasto)
        except IntegrityError:
            raise ValueError("Ya existe un tipo de gasto con el mismo codigo")
    
    def delete_tipo_gasto(self, id_tipo_gasto: int) -> None:
        """Elimina un tipo de gasto"""
        tipo_gasto = self.db.query(TipoGasto).filter(TipoGasto.id_tipo_gasto == id_tipo_gasto).first()
        if not tipo_gasto:
            raise ValueError("Tipo de gasto no encontrado")
        self.db.delete(tipo_gasto)
        self.db.commit()
    
    def obtener_tipo_gastos(self) -> List[TipoGastoResponse]:
        """Obtiene todos los tipos de gasto"""
        return self.db.query(TipoGasto).all()
    
    def obtener_tipo_gasto_por_id(self, id_tipo_gasto: int) -> TipoGastoResponse:
        """Obtiene un tipo de gasto por su codigo"""
        return self.db.query(TipoGasto).filter(TipoGasto.id_tipo_gasto == id_tipo_gasto).first()