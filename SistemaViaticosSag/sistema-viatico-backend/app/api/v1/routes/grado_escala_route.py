from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.grado_escala_controller import GradoEscalaController
from app.core.database import get_db
from app.schema.grado_escala_schema import GradoEscalaCreate, ActualizarGradosEscalaRango, GradoEscalaResponse, RespuestaGradoEscala

router = APIRouter()

@router.post("/", response_model=RespuestaGradoEscala)
def create_grado_escala(data: GradoEscalaCreate, db: Session = Depends(get_db)):
    controller = GradoEscalaController(db)
    try:
        grado_escala = controller.create_grado_escala(data)
        return grado_escala
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[GradoEscalaResponse])
def obtener_grado_escala(db: Session = Depends(get_db)):
    controller = GradoEscalaController(db)
    try:
        grado_escala = controller.obtener_grado_escala()
        return grado_escala
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id_grado}", response_model=GradoEscalaResponse)
def obtener_grado_escala_por_id(id_grado: int, db: Session = Depends(get_db)):
    controller = GradoEscalaController(db)
    try:
        grado_escala = controller.obtener_grado_escala_por_id(id_grado)
        return grado_escala
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/", response_model=RespuestaGradoEscala)
def actualizar_rango_grados_escala(data: ActualizarGradosEscalaRango, db: Session = Depends(get_db)):
    controller = GradoEscalaController(db)
    try:
        grado_escala = controller.actualizar_rango_grados_escala(data)
        return grado_escala
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))