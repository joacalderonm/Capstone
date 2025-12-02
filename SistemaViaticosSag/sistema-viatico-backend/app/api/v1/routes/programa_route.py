from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.programa_controller import ProgramaController
from app.core.database import get_db
from app.schema.programa_schema import ProgramaCambiarEstado, ProgramaCreate, ProgramaUpdate, ProgramaResponse, RespuestaPrograma 

router = APIRouter()

@router.post("/", response_model=ProgramaResponse)
def create_programa(data: ProgramaCreate, db: Session = Depends(get_db)):
    controller = ProgramaController(db)
    try:
        programa = controller.create_programa(data)
        return programa
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", response_model=List[ProgramaResponse])
def listar_programas(db: Session = Depends(get_db)):
    controller = ProgramaController(db)
    try:
        programas = controller.obtener_programas()
        return programas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{id_programa}", response_model=ProgramaResponse)
def obtener_programa_por_id(id_programa: int, db: Session = Depends(get_db)):
    controller = ProgramaController(db)
    try:
        programa = controller.obtener_programa_por_id(id_programa)
        return programa
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/estado/{id_programa}", response_model=RespuestaPrograma)
def cambiar_estado_programa(id_programa: int, data: ProgramaCambiarEstado, db: Session = Depends(get_db)):
    controller = ProgramaController(db)
    try:
        exito, mensaje, id_resultado = controller.cambiar_estado_programa(id_programa, data)
        
        if not exito:
            raise HTTPException(status_code=400, detail=mensaje)
        
        return RespuestaPrograma(
            exito=exito,
            mensaje=mensaje,
            id_programa=id_resultado
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_programa}", response_model=RespuestaPrograma)
def actualizar_programa(id_programa: int, data: ProgramaUpdate, db: Session = Depends(get_db)):
    controller = ProgramaController(db)
    try:
        exito, mensaje, id_resultado = controller.actualizar_programa(id_programa, data)
        
        if not exito:
            raise HTTPException(status_code=400, detail=mensaje)
        
        return RespuestaPrograma(
            exito=exito,
            mensaje=mensaje,
            id_programa=id_resultado
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
