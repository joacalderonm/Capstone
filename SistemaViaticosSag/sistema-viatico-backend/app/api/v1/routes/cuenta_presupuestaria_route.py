from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.cuenta_presupuestaria_controller import CuentaPresupuestariaController
from app.core.database import get_db
from app.schema.cuenta_presupuestaria_schema import CuentaPresupuestariaCambiarEstado, CuentaPresupuestariaCreate, CuentaPresupuestariaUpdate, CuentaPresupuestariaResponse, RespuestaCuentaPresupuestaria    

router = APIRouter()

@router.post("/", response_model=CuentaPresupuestariaResponse)
def create_cuenta_presupuestaria(data: CuentaPresupuestariaCreate, db: Session = Depends(get_db)):
    
    controller = CuentaPresupuestariaController(db)
    try:
        cuenta_presupuestaria = controller.create_cuenta_presupuestaria(data)
        return cuenta_presupuestaria
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", response_model=List[CuentaPresupuestariaResponse])
def obtener_cuenta_presupuestaria(db: Session = Depends(get_db)):
    controller = CuentaPresupuestariaController(db)
    try:
        cuenta_presupuestaria = controller.obtener_cuenta_presupuestaria()
        return cuenta_presupuestaria
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{id_cuenta_presupuestaria}", response_model=CuentaPresupuestariaResponse)
def obtener_cuenta_presupuestaria_por_id(id_cuenta_presupuestaria: int, db: Session = Depends(get_db)):
    controller = CuentaPresupuestariaController(db)
    try:
        cuenta_presupuestaria = controller.obtener_cuenta_presupuestaria_por_id(id_cuenta_presupuestaria)
        return cuenta_presupuestaria
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_cuenta_presupuestaria}", response_model=RespuestaCuentaPresupuestaria)
def actualizar_cuenta_presupuestaria(id_cuenta_presupuestaria: int, data: CuentaPresupuestariaUpdate, db: Session = Depends(get_db)):
    controller = CuentaPresupuestariaController(db)
    try:
        exito, mensaje, id_resultado = controller.actualizar_cuenta_presupuestaria(id_cuenta_presupuestaria, data)
        return RespuestaCuentaPresupuestaria(
            exito=exito,
            mensaje=mensaje,
            id_cuenta_presupuestaria=id_resultado
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/estado/{id_cuenta_presupuestaria}", response_model=RespuestaCuentaPresupuestaria)
def cambiar_estado_cuenta_presupuestaria(id_cuenta_presupuestaria: int, data: CuentaPresupuestariaCambiarEstado, db: Session = Depends(get_db)):
    """
    Cambia el estado (activo/inactivo) de una cuenta presupuestaria
    """
    controller = CuentaPresupuestariaController(db)
    exito, mensaje, id_resultado = controller.cambiar_estado_cuenta_presupuestaria(id_cuenta_presupuestaria, data)
        
    if not exito:
        raise HTTPException(status_code=400, detail=mensaje)
        
    return RespuestaCuentaPresupuestaria(
            exito=exito,
            mensaje=mensaje,
            id_cuenta_presupuestaria=id_resultado
        )