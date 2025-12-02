from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class CuentaPresupuestaria(Base):
    __tablename__ = "cuentas_presupuestarias"

    id_cuenta_presupuestaria = Column(Integer, primary_key=True, index=True)
    codigo_presupuestaria = Column(String(30), nullable=False)
    nombre_presupuestaria = Column(String(100), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=func.now())

    # Relaciones (opcional, se pueden agregar cuando tengas las tablas relacionadas)
    viatico = relationship("Viatico", back_populates="cuenta_presupuestaria")

    def __repr__(self):
        return f"<CuentaPresupuestaria(id_cuenta_presupuestaria={self.id_cuenta_presupuestaria}, codigo_presupuestaria='{self.codigo_presupuestaria}', nombre_presupuestaria='{self.nombre_presupuestaria}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"