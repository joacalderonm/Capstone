from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class GradoEscala(Base):
    __tablename__ = "grados_escalas"

    id_grado = Column(Integer, primary_key=True, index=True)
    valor_porcentaje_100 = Column(DECIMAL(10,2), nullable=False)
    valor_porcentaje_60 = Column(DECIMAL(10,2), nullable=False)
    valor_porcentaje_50 = Column(DECIMAL(10,2), nullable=False)
    valor_porcentaje_40 = Column(DECIMAL(10,2), nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=func.now())

    usuario = relationship("Usuario", back_populates="grado")

    def __repr__(self):
        return f"<GradoEscala(id_grado={self.id_grado}, valor_porcentaje_100={self.valor_porcentaje_100}, valor_porcentaje_60={self.valor_porcentaje_60}, valor_porcentaje_50={self.valor_porcentaje_50}, valor_porcentaje_40={self.valor_porcentaje_40}, activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"