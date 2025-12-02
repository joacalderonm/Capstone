from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schema.region_schema import RegionCreate, RegionUpdate, RegionResponse, RegionEditForm
from app.controller.region_controller import RegionController
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=RegionResponse)
def crear_region(data: RegionCreate, db: Session = Depends(get_db)):
    controller = RegionController(db)
    try:
        region = controller.crear_region(data)
        return region
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[RegionResponse])
def listar_regiones(db: Session = Depends(get_db)):
    controller = RegionController(db)
    return controller.obtener_regiones()


@router.get("/{region_id}", response_model=RegionResponse)
def obtener_region(region_id: int, db: Session = Depends(get_db)):
    controller = RegionController(db)
    region = controller.obtener_region(region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    return region

@router.get("/{region_id}/editar", response_model=RegionEditForm)
def obtener_region_para_editar(region_id: int, db: Session = Depends(get_db)):
    """
    🔥 ENDPOINT CLAVE: Obtiene una región con datos reales para formulario de edición
    
    Este endpoint retorna todos los datos actuales de la región para pre-poblar 
    el formulario de edición, junto con información adicional útil.
    
    Ejemplo de respuesta:
    {
      "id_region": 5,
      "codigo_region": "VAL",                    // ← Datos reales actuales
      "nombre_region": "Valparaíso",             // ← Datos reales actuales  
      "activo": true,                            // ← Datos reales actuales
      "titulo_formulario": "Editar Región Valparaíso",
      "fecha_creacion": "2024-01-10T10:30:00",
    }
    """
    controller = RegionController(db)
    try:
        region = controller.obtener_region_para_editar(region_id)
        
        # Convertir a RegionEditForm con todos los datos reales
        form_data = RegionEditForm(
            id_region=region.id_region,
            codigo_region=region.codigo_region,           # ← Datos reales
            nombre_region=region.nombre_region,           # ← Datos reales
            activo=region.activo,                         # ← Datos reales
            fecha_creacion=region.fecha_creacion,
            titulo_formulario=f"Editar Región {region.nombre_region}",
        )
        
        return form_data
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Exponer detalle para depuración
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{region_id}", response_model=RegionResponse)
def actualizar_region(region_id: int, data: RegionUpdate, db: Session = Depends(get_db)):
    controller = RegionController(db)
    region = controller.actualizar_region(region_id, data)
    if not region:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    return region


@router.delete("/{region_id}")
def eliminar_region(region_id: int, db: Session = Depends(get_db)):
    controller = RegionController(db)
    if not controller.eliminar_region(region_id):
        raise HTTPException(status_code=404, detail="Región no encontrada")
    return {"message": "Región eliminada"}