from sqlalchemy import Boolean, Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Viatico(Base):
    __tablename__ = "viaticos"

    id_viatico = Column(Integer, primary_key=True, index=True)
    id_plantilla = Column(Integer, ForeignKey('plantillas.id_plantilla'), nullable=False)
    id_unidad = Column(Integer, ForeignKey('unidades.id_unidad'), nullable=False)
    id_programa = Column(Integer, ForeignKey('programas.id_programa'), nullable=False)
    id_cuenta_presupuestaria = Column(Integer, ForeignKey('cuentas_presupuestarias.id_cuenta_presupuestaria'), nullable=False)
    id_motivo_cometido = Column(Integer, ForeignKey('motivos_cometido.id_motivo_cometido'), nullable=False)
    id_region = Column(Integer, ForeignKey('regiones.id_region'), nullable=False)
    id_producto_subesp = Column(Integer, ForeignKey('productos_subesp.id_producto_subesp'), nullable=False)
    id_valor_viatico = Column(Integer, ForeignKey('valores_viaticos.id_valor_viatico'), nullable=False)
    localidad_destino = Column(String(100), nullable=False)
    fecha_desde = Column(DateTime, nullable=False) # Cambiar fecha_salida
    fecha_hasta = Column(DateTime, nullable=False) # Cambiar fecha_regreso
    cantidad_dias = Column(Integer, nullable=False)
    descripcion_cometido = Column(String(100), nullable=False)
    porcentaje_40 = Column(Boolean, nullable=False, default=False)
    total_viatico = Column(DECIMAL(10, 2), nullable=False, default=0)
    observaciones = Column(String(100), nullable=False)

    # Relaciones (opcional, se pueden agregar cuando tengas las tablas relacionadas)
    plantilla = relationship("Plantilla", back_populates="viatico")
    unidad = relationship("Unidad", back_populates="viatico")
    programa = relationship("Programa", back_populates="viatico")
    cuenta_presupuestaria = relationship("CuentaPresupuestaria", back_populates="viatico")
    motivo_cometido = relationship("MotivoCometido", back_populates="viatico")
    region = relationship("Region", back_populates="viatico")
    producto_subesp = relationship("ProductoSubesp", back_populates="viatico")
    valor_viatico = relationship("ValorViatico", back_populates="viatico")

    def __repr__(self):
        return f"<Viatico(id_viatico={self.id_viatico}, localidad_destino='{self.localidad_destino}', fecha_desde='{self.fecha_desde}', fecha_hasta='{self.fecha_hasta}', cantidad_dias={self.cantidad_dias}, descripcion_cometido='{self.descripcion_cometido}', porcentaje_40={self.porcentaje_40}, total_viatico={self.total_viatico}, observaciones='{self.observaciones}')"