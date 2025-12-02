from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Unidad(Base):
    __tablename__ = "unidades"

    id_unidad = Column(Integer, primary_key=True, index=True)
    codigo_unidad = Column(String(20), nullable=True)
    nombre_unidad = Column(String(50), nullable=False)
    
    # --- Relación Padre/Hija (Autoevaluación) ---
    id_padre = Column(Integer, ForeignKey('unidades.id_unidad'), nullable=True)
    
    # --- Relación Jefe (Apunta a Usuarios) ---
    id_jefe = Column(Integer, ForeignKey('usuarios.id_usuario'), nullable=True) 

    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)

    # Relación: Qué usuarios pertenecen a esta unidad
    usuario = relationship("Usuario", 
                           foreign_keys="[Usuario.id_unidad]", 
                           back_populates="unidad")
    
    # Relación: Qué viáticos se asignaron a esta unidad
    viatico = relationship("Viatico", back_populates="unidad")

    # 2. Esta es la RELACIÓN que usa la columna id_jefe
    jefe = relationship("Usuario", 
                        foreign_keys=[id_jefe], 
                        back_populates="unidades_jefeadas")

    # Relación de autoevaluación (Padre/Hijas)
    unidades_hijas = relationship("Unidad", back_populates="unidad_padre")
    unidad_padre = relationship("Unidad", 
                                remote_side=[id_unidad], 
                                back_populates="unidades_hijas")

    def __repr__(self):
        return f"<Unidad(id_unidad={self.id_unidad}, nombre_unidad='{self.nombre_unidad}')>"