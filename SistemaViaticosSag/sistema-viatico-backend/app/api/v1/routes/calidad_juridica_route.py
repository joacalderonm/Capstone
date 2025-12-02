from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.calidad_juridica_controller import CalidadJuridicaController
from app.core.database import get_db
from app.schema.calidad_juridica_schema import CalidadJuridicaCreate, CalidadJuridicaUpdate, CalidadJuridicaResponse

router = APIRouter()

@router.post("/", response_model=CalidadJuridicaResponse)
def create_calidad_juridica(data: CalidadJuridicaCreate, db: Session = Depends(get_db)):
    controller = CalidadJuridicaController(db)
    try:
        calidad_juridica = controller.create_calidad_juridica(data)
        return calidad_juridica
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[CalidadJuridicaResponse])
def obtener_calidad_juridica(db: Session = Depends(get_db)):
    controller = CalidadJuridicaController(db)
    try:
        calidad_juridica = controller.obtener_calidad_juridica()
        return calidad_juridica
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id_calidad_juridica}", response_model=CalidadJuridicaResponse)
def obtener_calidad_juridica_por_id(id_calidad_juridica: int, db: Session = Depends(get_db)):
    controller = CalidadJuridicaController(db)
    try:
        calidad_juridica = controller.obtener_calidad_juridica_por_id(id_calidad_juridica)
        return calidad_juridica
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_calidad_juridica}", response_model=CalidadJuridicaResponse)
def actualizar_calidad_juridica(id_calidad_juridica: int, data: CalidadJuridicaUpdate, db: Session = Depends(get_db)):
    controller = CalidadJuridicaController(db)
    try:
        calidad_juridica = controller.actualizar_calidad_juridica(id_calidad_juridica, data)
        return calidad_juridica
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id_calidad_juridica}", response_model=CalidadJuridicaResponse)
def eliminar_calidad_juridica(id_calidad_juridica: int, db: Session = Depends(get_db)):
    controller = CalidadJuridicaController(db)
    try:
        calidad_juridica = controller.eliminar_calidad_juridica(id_calidad_juridica)
        return calidad_juridica
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


