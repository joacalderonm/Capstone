from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.estado_plantilla_controller import EstadoPlantillaController
from app.core.database import get_db
from app.schema.estado_plantilla_schema import EstadoPlantillaCreateSchema, EstadoPlantillaUpdateSchema, EstadoPlantillaResponseSchema

router = APIRouter()

@router.post("/", response_model=EstadoPlantillaResponseSchema)
def crear_estado_plantilla(data: EstadoPlantillaCreateSchema, db: Session = Depends(get_db)):
    controller = EstadoPlantillaController(db)
    try:
        estado_plantilla = controller.create_estado_plantilla(data)
        return estado_plantilla
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[EstadoPlantillaResponseSchema])
def obtener_estados_plantilla(db: Session = Depends(get_db)):
    controller = EstadoPlantillaController(db)
    estados_plantilla = controller.obtener_estados_plantilla()
    return estados_plantilla

@router.get("/{id_estado_plantilla}", response_model=EstadoPlantillaResponseSchema)
def obtener_estado_plantilla_por_id(id_estado_plantilla: int, db: Session = Depends(get_db)):
    controller = EstadoPlantillaController(db)
    estado_plantilla = controller.obtener_estado_plantilla_por_id(id_estado_plantilla)
    return estado_plantilla

@router.put("/{id_estado_plantilla}", response_model=EstadoPlantillaResponseSchema)
def actualizar_estado_plantilla(id_estado_plantilla: int, data: EstadoPlantillaUpdateSchema, db: Session = Depends(get_db)):
    controller = EstadoPlantillaController(db)
    try:
        estado_plantilla = controller.actualizar_estado_plantilla(id_estado_plantilla, data)
        return estado_plantilla
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
