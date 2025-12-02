from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.viatico_controller import ViaticoController
from app.core.database import get_db
from app.schema.viatico_schema import ViaticoCreate, ViaticoEditForm, ViaticoUpdate, RespuestaViaticoListado, RespuestaCreacionViatico, RespuestaViaticoDetallado, RespuestaActualizacion

router = APIRouter()

@router.post("/", response_model=RespuestaCreacionViatico)
def crear_viatico(data: ViaticoCreate, db: Session = Depends(get_db)):
    """
    Crea un viatico
    """
    
    controller = ViaticoController(db)
    
    try:
        return controller.create_viatico(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id_plantilla}", response_model=List[RespuestaViaticoListado])
def obtener_viaticos(id_plantilla: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los viaticos de una plantilla
    """
    controller = ViaticoController(db)
    viaticos = controller.obtener_viaticos(id_plantilla)
    if not viaticos:
        raise HTTPException(status_code=404, detail="Viaticos no encontrados")
    return viaticos

@router.get("/{id_viatico}/editar", response_model=ViaticoEditForm)
def obtener_viatico_para_editar(id_viatico: int, db: Session = Depends(get_db)):
    controller = ViaticoController(db)
    try:
        datos_formulario = controller.obtener_viatico_para_editar(id_viatico)
        
        return datos_formulario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@router.put("/{id_viatico}", response_model=RespuestaActualizacion)
def actualizar_viatico(id_viatico: int, data: ViaticoUpdate, db: Session = Depends(get_db)
):
    """Actualiza un viático existente"""
    controller = ViaticoController(db)
    exito, mensaje, resultado_id = controller.actualizar_viatico(id_viatico, data)
    
    if not exito:
        # Mapeo de errores basado en el mensaje
        status_code = 400
        error_type = "validation_error"
        
        mensaje_lower = mensaje.lower()
        
        if "no existe" in mensaje_lower and "viático" in mensaje_lower:
            status_code = 404
            error_type = "not_found"
        elif "duplicado" in mensaje_lower or "ya existe" in mensaje_lower:
            status_code = 409
            error_type = "conflict_error"
        
        raise HTTPException(
            status_code=status_code,
            detail={
                "type": error_type,
                "message": mensaje,
                "code": resultado_id
            }
        )
    
    # Retornar solo confirmación, sin consultar nuevamente
    return {
        "success": True,
        "message": mensaje,
        "id_viatico": resultado_id
    }

@router.delete("/{id_viatico}")
def eliminar_viatico(id_viatico: int,db: Session = Depends(get_db)):
    """Elimina un viático"""
    controller = ViaticoController(db)
    exito, mensaje, resultado_id = controller.eliminar_viatico(id_viatico)
    
    if not exito:
        status_code = 404 if "no existe" in mensaje.lower() else 400
        raise HTTPException(
            status_code=status_code,
            detail={"message": mensaje, "code": resultado_id}
        )
    
    return {
        "success": True,
        "message": mensaje,
        "id_viatico": resultado_id
    }