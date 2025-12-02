from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract
from typing import List, Optional

from app.model.estado_plantilla_model import EstadoPlantilla
from app.schema.estado_plantilla_schema import EstadoPlantillaCreateSchema, EstadoPlantillaUpdateSchema, EstadoPlantillaResponseSchema

class EstadoPlantillaController:
    def __init__(self, db: Session):
        self.db = db

    def create_estado_plantilla(self, data: EstadoPlantillaCreateSchema) -> EstadoPlantillaResponseSchema:
        try:
            new_estado_plantilla = EstadoPlantilla(
                nombre_estado_plantilla = data.nombre_estado_plantilla,
                descripcion = data.descripcion,
                color_hex = data.color_hex,
                orden = data.orden,
                activo = data.activo
            )
            self.db.add(new_estado_plantilla)
            self.db.commit()
            self.db.refresh(new_estado_plantilla)
            return new_estado_plantilla
        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Error al crear el estado de plantilla: {str(e)}")
    
    def obtener_estados_plantilla(self) -> List[EstadoPlantillaResponseSchema]:
        estados_plantilla = self.db.query(EstadoPlantilla).all()
        return estados_plantilla

    def obtener_estado_plantilla_por_id(self, id_estado_plantilla: int) -> EstadoPlantillaResponseSchema:
        estado_plantilla = self.db.query(EstadoPlantilla).filter(EstadoPlantilla.id_estado_plantilla == id_estado_plantilla).first()
        return estado_plantilla
    
    def actualizar_estado_plantilla(self, id_estado_plantilla: int, data: EstadoPlantillaUpdateSchema) -> EstadoPlantillaResponseSchema:
        estado_plantilla = self.db.query(EstadoPlantilla).filter(EstadoPlantilla.id_estado_plantilla == id_estado_plantilla).first()
        if not estado_plantilla:
            raise ValueError(f"Estado de plantilla con ID {id_estado_plantilla} no encontrado")
        estado_plantilla.nombre_estado_plantilla = data.nombre_estado_plantilla
        estado_plantilla.descripcion = data.descripcion
        estado_plantilla.color_hex = data.color_hex
        estado_plantilla.orden = data.orden
        estado_plantilla.activo = data.activo
        self.db.add(estado_plantilla)
        self.db.commit()
        self.db.refresh(estado_plantilla)
        return estado_plantilla