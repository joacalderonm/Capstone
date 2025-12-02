from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Permiso(Base):
    __tablename__ = "permisos"

    id_permiso = Column(Integer, primary_key=True, index=True)
    codigo_permiso = Column(String(50), nullable=False)
    nombre_permiso = Column(String(100), nullable=False)
    descripcion = Column(String(200), nullable=True)
    tipo_operacion = Column(String(20), nullable=False)
    objeto_bd = Column(String(200), nullable=False)
    tipo_objeto = Column(String(20), nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    roles_permisos = relationship("RolPermiso", back_populates="permiso")

    def __repr__(self):
        return f"Permiso(id={self.id_permiso}, nombre={self.nombre_permiso})"
