from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.motivo_cometido_controller import MotivoCometidoController
from app.core.database import get_db
from app.schema.motivo_cometido_schema import MotivoCometidoCambiarEstado, MotivoCometidoCreate, MotivoCometidoUpdate, MotivoCometidoResponse, RespuestaMotivoCometido    

router = APIRouter()

@router.post("/", response_model=MotivoCometidoResponse)
def create_motivo_cometido(data: MotivoCometidoCreate, db: Session = Depends(get_db)):
    controller = MotivoCometidoController(db)
    try:
        motivo_cometido = controller.create_motivo_cometido(data)
        return motivo_cometido
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", response_model=List[MotivoCometidoResponse])
def listar_motivos_cometido(db: Session = Depends(get_db)):
    controller = MotivoCometidoController(db)
    try:
        motivos_cometido = controller.listar_motivos_cometido()
        return motivos_cometido
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{id_motivo}", response_model=MotivoCometidoResponse)
def obtener_motivo_cometido_por_id(id_motivo: int, db: Session = Depends(get_db)):
    controller = MotivoCometidoController(db)
    try:
        motivo_cometido = controller.obtener_motivo_cometido_por_id(id_motivo)
        return motivo_cometido
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_motivo_cometido}", response_model=RespuestaMotivoCometido)
def actualizar_motivo_cometido(id_motivo_cometido: int, data: MotivoCometidoUpdate, db: Session = Depends(get_db)):
    controller = MotivoCometidoController(db)
    try:
        exito, mensaje, id_resultado = controller.actualizar_motivo_cometido(id_motivo_cometido, data)
        return RespuestaMotivoCometido(
            exito=exito,
            mensaje=mensaje,
            id_motivo_cometido=id_resultado
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/estado/{id_motivo_cometido}", response_model=RespuestaMotivoCometido)
def cambiar_estado_motivo_cometido(id_motivo_cometido: int, data: MotivoCometidoCambiarEstado, db: Session = Depends(get_db)):
    controller = MotivoCometidoController(db)
    exito, mensaje, id_resultado = controller.cambiar_estado_motivo_cometido(id_motivo_cometido, data)
        
    if not exito:
        raise HTTPException(status_code=400, detail=mensaje)
    
    return RespuestaMotivoCometido(
        exito=exito,
        mensaje=mensaje,
        id_motivo_cometido=id_resultado
    )