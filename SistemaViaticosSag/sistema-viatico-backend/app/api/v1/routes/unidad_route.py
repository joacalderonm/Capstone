from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schema.unidad_schema import RespuestaUnidad, UnidadCambiarEstado, UnidadCreate, UnidadUpdate, UnidadResponse
from app.controller.unidad_controller import UnidadController
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=RespuestaUnidad)
def crear_unidad(data: UnidadCreate, db: Session = Depends(get_db)):
    controller = UnidadController(db)
    try:
        exito, mensaje, id_resultado = controller.create_unidad(data)
        return RespuestaUnidad(
            exito=exito,
            mensaje=mensaje,
            id_unidad=id_resultado
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[UnidadResponse])
def listar_unidades(db: Session = Depends(get_db)):
    controller = UnidadController(db)
    try:
        unidades = controller.obtener_unidades()
        return unidades
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{unidad_id}", response_model=UnidadResponse)
def obtener_unidad(unidad_id: int, db: Session = Depends(get_db)):
    controller = UnidadController(db)
    try:
        unidad = controller.obtener_unidad(unidad_id)
        return unidad
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{id_unidad}", response_model=RespuestaUnidad)
def actualizar_unidad(id_unidad: int, data: UnidadUpdate, db: Session = Depends(get_db)):
    controller = UnidadController(db)
    try:
        exito, mensaje, id_resultado = controller.update_unidad(id_unidad, data)
        return RespuestaUnidad(
            exito=exito,
            mensaje=mensaje,
            id_unidad=id_resultado
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/estado/{id_unidad}", response_model=RespuestaUnidad)
def cambiar_estado_unidad(id_unidad: int, data: UnidadCambiarEstado, db: Session = Depends(get_db)):
    controller = UnidadController(db)
    try:
        exito, mensaje, id_resultado = controller.cambiar_estado_unidad(id_unidad, data)
        return RespuestaUnidad(
            exito=exito,
            mensaje=mensaje,
            id_unidad=id_resultado
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
