from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from typing import List, Optional

from app.model.rol_model import Rol
from app.schema.rol_schema import RolCreate, RolUpdate, RolResponse

class RolController:
    def __init__(self, db: Session):
        self.db = db

    def create_rol(self, data: RolCreate) -> RolResponse:
        """Crea un rol"""
        try:
            new_rol = Rol(
                nombre_rol = data.nombre_rol,
                descripcion = data.descripcion,
            )
            self.db.add(new_rol)
            self.db.commit()
            self.db.refresh(new_rol)
            return new_rol
        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Error al crear el rol: {str(e)}")
    
    def obtener_roles(self) -> List[RolResponse]:
        """ Obtiene todos los roles"""
        roles = self.db.query(Rol).all()
        if not roles:
            raise ValueError("No se encontraron roles")
        return roles

    def obtener_rol(self, rol_id: int) -> RolResponse:
        """ Obtiene un rol por su ID"""
        rol = self.db.query(Rol).filter(Rol.id_rol == rol_id).first()
        if not rol:
            raise ValueError(f"Rol con ID {rol_id} no encontrado")
        return rol

    def update_rol(self, rol_id: int, data: RolUpdate) -> RolResponse:
        """ Actualiza un rol por su ID"""
        rol = self.db.query(Rol).filter(Rol.id_rol == rol_id).first()
        if not rol:
            raise ValueError(f"Rol con ID {rol_id} no encontrado")
        rol.nombre_rol = data.nombre_rol
        rol.descripcion = data.descripcion
        self.db.commit()
        self.db.refresh(rol)
        return rol