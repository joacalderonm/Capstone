from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey, CHAR
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_autenticador_firebase = Column(Integer, ForeignKey('autenticador_firebase.id_autenticador_firebase'), nullable=False)
    id_rol = Column(Integer, ForeignKey('roles.id_rol'), nullable=False)
    id_unidad = Column(Integer, ForeignKey('unidades.id_unidad'), nullable=False)
    id_region = Column(Integer, ForeignKey('regiones.id_region'), nullable=False)
    id_calidad_juridica = Column(Integer, ForeignKey('calidades_juridicas.id_calidad_juridica'), nullable=False)
    id_grado = Column(Integer, ForeignKey('grados_escalas.id_grado'), nullable=False)
    nombre_usuario = Column(String(50), nullable=False)
    apellido_paterno = Column(String(50), nullable=False)
    apellido_materno = Column(String(50), nullable=False)
    
    # --- RUT Corregido ---
    rut_numero = Column(Integer, nullable=False)
    rut_dv = Column(CHAR(1), nullable=False)
    
    correo = Column(String(100), nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)

    # --- Definición de Relaciones ---
    
    autenticador_firebase = relationship("AutenticadorFirebase", back_populates="usuario")
    auditoria_sistema = relationship("AuditoriaSistema", back_populates="usuario")
    rol = relationship("Rol", back_populates="usuario")
    
    # Relación: A qué unidad pertenece este usuario
    unidad = relationship("Unidad", 
                          foreign_keys=[id_unidad], 
                          back_populates="usuario")
    
    region = relationship("Region", back_populates="usuario")
    calidad_juridica = relationship("CalidadJuridica", back_populates="usuario")
    grado = relationship("GradoEscala", back_populates="usuario")
    plantillas_solicitadas = relationship("Plantilla", foreign_keys="[Plantilla.id_usuario]", back_populates="usuario_solicitante")
    plantillas_supervisadas = relationship("Plantilla", foreign_keys="[Plantilla.id_usuario_supervisor]", back_populates="usuario_supervisor")
    
    # Relación: De qué unidades es jefe este usuario
    unidades_jefeadas = relationship("Unidad", 
                                   foreign_keys="[Unidad.id_jefe]", 
                                   back_populates="jefe")

    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, nombre_usuario='{self.nombre_usuario}')>"