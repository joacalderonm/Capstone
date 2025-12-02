from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.gastos_reembolsables_controller import GastoReembolsableController
from app.core.database import get_db
from app.schema.gastos_reembolsables_schema import CrearGastoReembolsable, ActualizarGastoReembolsable, GastoReembolsableSimple, GastoReembolsableResponse, RespuestaCreacionGastoReembolsable, GastoReembolsableDetallado

router = APIRouter()

@router.post("/", response_model=RespuestaCreacionGastoReembolsable)
def crear_gasto_reembolsable(data: CrearGastoReembolsable, db: Session = Depends(get_db)):
    """
    Crea un gasto reembolsable
    """

    controller = GastoReembolsableController(db)
    
    try:
        gasto_reembolsable = controller.create_gasto_reembolsable(data)
        return gasto_reembolsable
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id_plantilla}", response_model=List[GastoReembolsableDetallado])
def obtener_gastos_reembolsables(id_plantilla: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los gastos reembolsables de una plantilla
    """

    controller = GastoReembolsableController(db)
    gastos_reembolsables = controller.obtener_gastos_reembolsables(id_plantilla)
    if not gastos_reembolsables:
        raise HTTPException(status_code=404, detail="Gastos reembolsables no encontrados")
    return gastos_reembolsables

@router.get("/{id_gasto_reembolsable}/editar", response_model=GastoReembolsableSimple)
def obtener_gasto_reembolsable_para_editar(id_gasto_reembolsable: int, db: Session = Depends(get_db)):
    controller = GastoReembolsableController(db)
    try:
        gasto_reembolsable = controller.obtener_gasto_reembolsable_para_editar(id_gasto_reembolsable)
        return gasto_reembolsable
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{id_gasto_reembolsable}", response_model=RespuestaCreacionGastoReembolsable)
def actualizar_gasto_reembolsable(id_gasto_reembolsable: int, data: ActualizarGastoReembolsable, db: Session = Depends(get_db)):
    controller = GastoReembolsableController(db)
    exito, mensaje, id_gasto_reembolsable = controller.actualizar_gasto_reembolsable(id_gasto_reembolsable, data)
    if not exito:
        raise HTTPException(status_code=400, detail=mensaje)
    
    return {
        "resultado": id_gasto_reembolsable,
        "mensaje": mensaje
    }

@router.delete("/{id_gasto_reembolsable}")
def eliminar_gasto_reembolsable(id_gasto_reembolsable: int, db: Session = Depends(get_db)):
    """
    Elimina un gasto reembolsable
    """
    controller = GastoReembolsableController(db)
    exito, mensaje = controller.eliminar_gasto_reembolsable(id_gasto_reembolsable)
    if not exito:
        status_code = 404 if "no existe" in mensaje.lower() else 400
        raise HTTPException(
            status_code=status_code, 
            detail={"message": mensaje, "code": id_gasto_reembolsable})
    
    return {
        "success": True,
        "message": mensaje
    }
