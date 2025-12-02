from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract
from typing import List, Optional

from app.model.calidad_juridica_model import CalidadJuridica
from app.schema.calidad_juridica_schema import CalidadJuridicaCreate, CalidadJuridicaUpdate, CalidadJuridicaResponse

class CalidadJuridicaController:
    def __init__(self, db: Session):
        self.db = db
    
    def create_calidad_juridica(self, data: CalidadJuridicaCreate) -> CalidadJuridicaResponse:
        """ Crea una calidad juridica """
        try:
            new_calidad_juridica = CalidadJuridica(
                tipo=data.tipo,
                descripcion=data.descripcion
            )
            self.db.add(new_calidad_juridica)
            self.db.commit()
            return CalidadJuridicaResponse.from_orm(new_calidad_juridica)
        except IntegrityError:
            raise ValueError("Ya existe una calidad juridica con el mismo tipo")
        
    def update_calidad_juridica(self, id_calidad_juridica: int, data: CalidadJuridicaUpdate) -> CalidadJuridicaResponse:
        """ Actualiza una calidad juridica """
        calidad_juridica = self.db.query(CalidadJuridica).filter(CalidadJuridica.id_calidad_juridica == id_calidad_juridica).first()
        if not calidad_juridica:
            raise ValueError("Calidad juridica no encontrada")
        try:
            calidad_juridica.tipo = data.tipo
            calidad_juridica.descripcion = data.descripcion
            self.db.commit()
            return CalidadJuridicaResponse.from_orm(calidad_juridica)
        except IntegrityError:
            raise ValueError("Ya existe una calidad juridica con el mismo tipo")
        
    def delete_calidad_juridica(self, id_calidad_juridica: int) -> None:
        """ Elimina una calidad juridica """
        calidad_juridica = self.db.query(CalidadJuridica).filter(CalidadJuridica.id_calidad_juridica == id_calidad_juridica).first()
        if not calidad_juridica:
            raise ValueError("Calidad juridica no encontrada")
        self.db.delete(calidad_juridica)
        self.db.commit()
    
    def obtener_calidad_juridica_por_id(self, id_calidad_juridica: int) -> CalidadJuridicaResponse:
        """ Obtiene una calidad juridica por su id """
        calidad_juridica = self.db.query(CalidadJuridica).filter(CalidadJuridica.id_calidad_juridica == id_calidad_juridica).first()
        if not calidad_juridica:
            raise ValueError("Calidad juridica no encontrada")
        return calidad_juridica
    
    def obtener_calidad_juridica(self) -> List[CalidadJuridicaResponse]:
        """ Obtiene todas las calidades juridicas """
        calidad_juridica = self.db.query(CalidadJuridica).all()
        if not calidad_juridica:
            raise ValueError("Calidad juridica no encontrada")
        return calidad_juridica