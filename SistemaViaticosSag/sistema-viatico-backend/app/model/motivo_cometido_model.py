from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MotivoCometido(Base):
    __tablename__ = "motivos_cometido"

    id_motivo_cometido = Column(Integer, primary_key=True, index=True)
    nombre_cometido = Column(String(50), nullable=False)
    descripcion_cometido= Column(String(100), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=func.now())

    # Relaciones (opcional, se pueden agregar cuando tengas las tablas relacionadas)
    viatico = relationship("Viatico", back_populates="motivo_cometido")