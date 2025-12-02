from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class RolPermiso(Base):
    __tablename__ = "roles_permisos"

    id_rol_permiso = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    id_permiso = Column(Integer, ForeignKey("permisos.id_permiso"), nullable=False)
    #activo = Column(Boolean, nullable=False) Añadir en la BD
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    rol = relationship("Rol", back_populates="roles_permisos")
    permiso = relationship("Permiso", back_populates="roles_permisos")

    def __repr__(self):
        return f"Rol_Permiso(id={self.id_rol_permiso}, id_rol={self.id_rol}, id_permiso={self.id_permiso})"