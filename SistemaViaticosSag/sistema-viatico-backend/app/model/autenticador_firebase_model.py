from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class AutenticadorFirebase(Base):
    __tablename__ = "autenticador_firebase"

    id_autenticador_firebase = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(128), nullable=False)
    ultima_conexion = Column(DateTime, nullable=False)
    activo = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now())

    usuario = relationship("Usuario", back_populates="autenticador_firebase")

    def __repr__(self):
        return f"<AutenticadorFirebase(id_autenticador_firebase={self.id_autenticador_firebase}, firebase_uid='{self.firebase_uid}', ultima_conexion='{self.ultima_conexion}', activo={self.activo}, fecha_creacion='{self.fecha_creacion}')"