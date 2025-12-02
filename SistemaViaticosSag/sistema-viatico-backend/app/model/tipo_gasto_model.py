from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship

class TipoGasto(Base):
    __tablename__ = "tipos_gastos"

    id_tipo_gasto = Column(Integer, primary_key=True, index=True)
    codigo_gasto = Column(String(10), nullable=False, unique=True)
    descripcion_gasto = Column(String(50), nullable=False)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, server_default=func.getdate())

    gastos_reembolsable = relationship("GastoReembolsable", back_populates="tipo_gasto")

    def __repr__(self):
        return f"<TipoGasto(id_tipo_gasto={self.id_tipo_gasto}, codigo_gasto={self.codigo_gasto}, descripcion_gasto={self.descripcion_gasto}, activo={self.activo}, fecha_creacion={self.fecha_creacion})>"
