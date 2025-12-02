from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Programa(Base):
    __tablename__ = "programas"
    id_programa = Column(Integer, primary_key=True, index=True)
    codigo_programa = Column(Integer, nullable=False)
    nombre_programa = Column(String(50), nullable=True)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=datetime.now)
    
    viatico = relationship("Viatico", back_populates="programa")
    gastos_reembolsable = relationship("GastoReembolsable", back_populates="programa")

    def __repr__(self):
        return f"<Programa(id_programa={self.id_programa}, codigo_programa={self.codigo_programa}, nombre_programa='{self.nombre_programa}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"