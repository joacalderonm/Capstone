from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.controller.permiso_controller import PermisoController
from app.core.database import get_db
from app.schema.permiso_schema import PermisoResponse

router = APIRouter()

@router.get("/", response_model=List[PermisoResponse])
def obtener_permisos(db: Session = Depends(get_db)):
    """ Obtiene todos los permisos """
    controller = PermisoController(db)
    try: 
        permisos = controller.obtener_permisos()
        return permisos
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
