from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class AuditoriaSistema(Base):
    __tablename__ = "auditorias_sistema"

    id_auditoria_sistema = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    tabla_afectada =  Column(String(40), nullable=False)
    operacion = Column(String(30), nullable=False)
    id_registro = Column(Integer, nullable=False)
    datos_anteriores = Column(String)
    datos_nuevos = Column(String)
    fecha_operacion = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    usuario = relationship("Usuario", back_populates="auditoria_sistema")

    def __repr__(self):
        return f"<AuditoriaSistema(id_auditoria_sistema={self.id_auditoria_sistema}, id_usuario={self.id_usuario}, tabla_afectada='{self.tabla_afectada}', operacion='{self.operacion}', id_registro={self.id_registro}, datos_anteriores='{self.datos_anteriores}', datos_nuevos='{self.datos_nuevos}', fecha_operacion='{self.fecha_operacion}')"