from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship

class Region(Base):
    __tablename__ = "regiones"

    id_region = Column(Integer, primary_key=True, index=True)
    codigo_region = Column(String(20), nullable=False, unique=True)
    nombre_region = Column(String(100), nullable=False)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, server_default=func.getdate())

    viatico = relationship("Viatico", back_populates="region")
    usuario = relationship("Usuario", back_populates="region")

    def __repr__(self):
        return f"<Region(id_region={self.id_region}, codigo_region='{self.codigo_region}', nombre_region='{self.nombre_region}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"