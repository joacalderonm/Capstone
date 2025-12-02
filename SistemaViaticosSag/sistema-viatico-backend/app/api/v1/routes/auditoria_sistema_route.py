from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.auditoria_sistema_controller import AuditoriaSistemaController
from app.core.database import get_db
from app.schema.auditoria_sistema_schema import AuditoriaSistemaResponse

router = APIRouter()

@router.get("/", response_model=List[AuditoriaSistemaResponse])
def obtener_auditorias_sistema(db: Session = Depends(get_db)):
    controller = AuditoriaSistemaController(db)
    try:
        auditorias = controller.obtener_auditorias_sistema()
        return auditorias
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))