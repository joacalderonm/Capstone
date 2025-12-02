from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.anticipo_controller import AnticipoController
from app.core.database import get_db
from app.schema.anticipo_schema import AnticipoCreate, AnticipoEditForm, AnticipoUpdate, RespuestaAnticipoListado, RespuestaCreacionAnticipo, RespuestaAnticipoDetallado, RespuestaActualizacion

router = APIRouter()

@router.post("/", response_model=RespuestaCreacionAnticipo)
def crear_anticipo(data: AnticipoCreate, db: Session = Depends(get_db)):
    """
    Crea un anticipo
    """
    
    controller = AnticipoController(db)
    
    try:
        return controller.create_anticipo(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id_plantilla}", response_model=List[RespuestaAnticipoListado])
def obtener_anticipos(id_plantilla: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los anticipo de una plantilla
    """
    controller = AnticipoController(db)
    anticipo = controller.obtener_anticipos(id_plantilla)
    if not anticipo:
        raise HTTPException(status_code=404, detail="Anticipos no encontrados")
    return anticipo

@router.get("/{anticipo_id}/editar", response_model=AnticipoEditForm)
def obtener_anticipo_para_editar(anticipo_id: int, db: Session = Depends(get_db)):
    controller = AnticipoController(db)
    try:
        datos_formulario = controller.obtener_anticipo_para_editar(anticipo_id)
        
        return datos_formulario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@router.put("/{anticipo_id}", response_model=RespuestaActualizacion)
def actualizar_anticipo(
    anticipo_id: int, 
    data: AnticipoUpdate, 
    db: Session = Depends(get_db)
):
    """Actualiza un anticipo existente"""
    controller = AnticipoController(db)
    exito, mensaje, resultado_id = controller.actualizar_anticipo(anticipo_id, data)
    
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
        "anticipo_id": resultado_id
    }

@router.delete("/{anticipo_id}")
def eliminar_anticipo(anticipo_id: int,db: Session = Depends(get_db)):
    """Elimina un anticipo"""
    controller = AnticipoController(db)
    exito, mensaje, resultado_id = controller.eliminar_anticipo(anticipo_id)
    
    if not exito:
        status_code = 404 if "no existe" in mensaje.lower() else 400
        raise HTTPException(
            status_code=status_code,
            detail={"message": mensaje, "code": resultado_id}
        )
    
    return {
        "success": True,
        "message": mensaje,
        "anticipo_id": resultado_id
    }

@router.post("/{id_plantilla}/firmar", response_model=RespuestaActualizacion)
def firmar_anticipo(id_plantilla: int, id_usuario_firma: int, db: Session = Depends(get_db)):
    """
    Firmar un anticipo
    """
    controller = AnticipoController(db)
    exito, mensaje, resultado_id = controller.firmar_anticipo(id_plantilla, id_usuario_firma)
    
    if not exito:
        status_code = 404 if "no existe" in mensaje.lower() else 400
        raise HTTPException(
            status_code=status_code,
            detail={"message": mensaje, "code": resultado_id}
        )
    
    return {
        "success": True,
        "message": mensaje,
        "anticipo_id": resultado_id
    }