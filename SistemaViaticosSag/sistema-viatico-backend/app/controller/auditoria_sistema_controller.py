from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract
from typing import List, Optional

from app.model.auditoria_sistema_model import AuditoriaSistema
from app.schema.auditoria_sistema_schema import AuditoriaSistemaResponse

class AuditoriaSistemaController:
    def __init__(self, db: Session):
        self.db = db
    
    def obtener_auditorias_sistema(self) -> List[AuditoriaSistemaResponse]:
        """ Obtiene todas las auditorias del sistema """
        auditoria_sistema = self.db.query(AuditoriaSistema).all()

        if not auditoria_sistema:
            raise ValueError("No se encontraron auditorias con los filtros proporcionados")

        return [AuditoriaSistemaResponse.from_orm(auditoria) for auditoria in auditoria_sistema]