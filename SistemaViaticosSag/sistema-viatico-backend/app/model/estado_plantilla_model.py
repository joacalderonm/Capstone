from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class EstadoPlantilla(Base):
    __tablename__ = "estados_plantillas"
    
    id_estado_plantilla = Column(Integer, primary_key=True, index=True)
    nombre_estado_plantilla = Column(String(50), nullable=False)
    descripcion = Column(String(100), nullable=False)
    color_hex = Column(String(10), nullable=False)
    orden = Column(Integer, nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now)

    plantilla = relationship("Plantilla", back_populates="estado_plantilla")

    def __repr__(self):
        return f"<EstadoPlantilla(id_estado_plantilla={self.id_estado_plantilla}, nombre_estado_plantilla='{self.nombre_estado_plantilla}', descripcion='{self.descripcion}', color_hex='{self.color_hex}', orden={self.orden}, activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"