from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.model.plantilla_model import Plantilla
from app.model.programa_model import Programa
from app.model.tipo_gasto_model import TipoGasto
from app.model.producto_subesp_model import ProductoSubesp

class GastoReembolsable(Base):
    __tablename__ = "gastos_reembolsables"

    id_gasto_reembolsable = Column(Integer, primary_key=True, index=True)
    id_plantilla = Column(Integer, ForeignKey('plantillas.id_plantilla'), nullable=False)
    id_tipo_gasto = Column(Integer, ForeignKey('tipos_gastos.id_tipo_gasto'), nullable=False)
    id_programa = Column(Integer, ForeignKey('programas.id_programa'), nullable=False)
    id_producto_subesp = Column(Integer, ForeignKey('productos_subesp.id_producto_subesp'), nullable=False)
    numero_documento = Column(Integer, nullable=False)
    valor = Column(DECIMAL(10, 2), nullable=False)
    descripcion = Column(String(50), nullable=False)

    # Relaciones (opcional, se pueden agregar cuando tengas las tablas relacionadas)
    plantilla = relationship("Plantilla", back_populates="gastos_reembolsable")
    tipo_gasto = relationship("TipoGasto", back_populates="gastos_reembolsable")
    programa = relationship("Programa", back_populates="gastos_reembolsable")
    producto_subesp = relationship("ProductoSubesp", back_populates="gastos_reembolsable")

    def __repr__(self):
        return f"<GastoReembolsable(id={self.id_gasto_reembolsable}, numero_documento={self.numero_documento}, valor={self.valor}, descripcion={self.descripcion})>"