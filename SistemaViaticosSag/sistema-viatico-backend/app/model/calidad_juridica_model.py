from sqlalchemy import Boolean, Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class CalidadJuridica(Base):
    __tablename__ = "calidades_juridicas"

    id_calidad_juridica = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(40), nullable=False)
    descripcion = Column(String(100), nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    usuario = relationship("Usuario", back_populates="calidad_juridica")

    def __repr__(self):
        return f"<CalidadJuridica(id_calidad_juridica={self.id_calidad_juridica}, tipo='{self.tipo}', descripcion='{self.descripcion}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"