from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.pdf_controller import PdfController
from app.core.database import get_db
from app.schema.pdf_schema import RespuestaUsuarioPdf, RespuestaAnticipoPdf, RespuestaViaticoPdf

router = APIRouter()

@router.get("/usuario", response_model=List[RespuestaUsuarioPdf])
def obtener_pdf_usuario(id_plantilla: int, db: Session = Depends(get_db)):
    controller = PdfController(db)
    try:
        return controller.obtener_pdf_usuario(id_plantilla)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/anticipo", response_model=List[RespuestaAnticipoPdf])
def obtener_pdf_anticipo(id_plantilla: int, db: Session = Depends(get_db)):
    controller = PdfController(db)
    try:
        return controller.obtener_pdf_anticipo(id_plantilla)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/viatico", response_model=List[RespuestaViaticoPdf])
def obtener_pdf_viatico(id_plantilla: int, db: Session = Depends(get_db)):
    controller = PdfController(db)
    try:
        return controller.obtener_pdf_viatico(id_plantilla)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
