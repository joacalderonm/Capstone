from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Plantilla(Base):
    __tablename__ = "plantillas"

    id_plantilla = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id_usuario'), nullable=True)
    id_usuario_supervisor = Column(Integer, ForeignKey('usuarios.id_usuario'), nullable=True)
    id_estado_plantilla = Column(Integer, ForeignKey('estados_plantillas.id_estado_plantilla'), nullable=True)
    numero_plantilla = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    total_viatico = Column(DECIMAL(10, 2), nullable=False, default=0)
    total_gastos = Column(DECIMAL(10, 2), nullable=False, default=0)
    total_anticipos = Column(DECIMAL(10, 2), nullable=False, default=0)
    total_general = Column(DECIMAL(10, 2), nullable=False, default=0)
    fecha_cierre = Column(DateTime, nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.getdate(), nullable=False)

    # Relaciones (opcional, se pueden agregar cuando tengas las tablas relacionadas)
    usuario_solicitante = relationship("Usuario", foreign_keys=[id_usuario], back_populates="plantillas_solicitadas")
    usuario_supervisor = relationship("Usuario", foreign_keys=[id_usuario_supervisor], back_populates="plantillas_supervisadas")
    estado_plantilla = relationship("EstadoPlantilla", back_populates="plantilla")
    viatico = relationship("Viatico", back_populates="plantilla")
    gastos_reembolsable = relationship("GastoReembolsable", back_populates="plantilla")
    
    def __repr__(self):
        return f"<Plantilla(id={self.id_plantilla}, numero={self.numero_plantilla}, año={self.ano}, mes={self.mes})>"