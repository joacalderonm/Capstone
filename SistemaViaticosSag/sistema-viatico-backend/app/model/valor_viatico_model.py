from sqlalchemy import Column, Integer, DECIMAL, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class ValorViatico(Base):
    __tablename__ = "valores_viaticos"

    id_valor_viatico = Column(Integer, primary_key=True, index=True)
    valor_base_viatico = Column(DECIMAL(10, 2), nullable=False)
    fecha_vigencia_desde = Column(DateTime, nullable=False)
    fecha_vigencia_hasta = Column(DateTime, nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    viatico = relationship("Viatico", back_populates="valor_viatico")

    def __repr__(self):
        return f"<ValorViatico(id_valor_viatico={self.id_valor_viatico}, valor_base_viatico={self.valor_base_viatico}, fecha_vigencia_desde='{self.fecha_vigencia_desde}', fecha_vigencia_hasta='{self.fecha_vigencia_hasta}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"