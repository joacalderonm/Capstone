from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(50), nullable=False)
    descripcion = Column(String(100), nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    usuario = relationship("Usuario", back_populates="rol")
    roles_permisos = relationship("RolPermiso", back_populates="rol")

    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, nombre_rol='{self.nombre_rol}', descripcion='{self.descripcion}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"