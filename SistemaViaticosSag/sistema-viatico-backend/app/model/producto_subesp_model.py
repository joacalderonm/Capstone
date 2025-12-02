from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class ProductoSubesp(Base):
    __tablename__ = "productos_subesp"

    id_producto_subesp = Column(Integer, primary_key=True, index=True)
    codigo_subesp = Column(String(20), nullable=False)
    descripcion = Column(String(50), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    viatico = relationship("Viatico", back_populates="producto_subesp")
    gastos_reembolsable = relationship("GastoReembolsable", back_populates="producto_subesp")

    def __repr__(self):
        return f"<ProductoSubesp(id_producto_subesp={self.id_producto_subesp}, codigo_subesp='{self.codigo_subesp}', descripcion='{self.descripcion}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"