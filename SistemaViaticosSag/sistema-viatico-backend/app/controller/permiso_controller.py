from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime

from app.model.permiso_model import Permiso
from app.schema.permiso_schema import PermisoResponse

class PermisoController:
    def __init__(self, db: Session):
        self.db = db
    
    def obtener_permisos(self) -> List[PermisoResponse]:
        """ Obtiene todos los permisos"""
        permisos = self.db.query(Permiso).all()
        return [PermisoResponse.from_orm(permiso) for permiso in permisos]