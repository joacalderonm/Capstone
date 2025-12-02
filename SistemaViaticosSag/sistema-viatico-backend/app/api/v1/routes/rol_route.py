from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.rol_controller import RolController
from app.core.database import get_db
from app.schema.rol_schema import RolCreate, RolUpdate, RolResponse

router = APIRouter()

@router.post("/", response_model=RolResponse)
def crear_rol(data: RolCreate, db: Session = Depends(get_db)):
    controller = RolController(db)
    try:
        rol = controller.create_rol(data)
        return rol
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[RolResponse])
def listar_roles(db: Session = Depends(get_db)):
    controller = RolController(db)
    try:
        roles = controller.obtener_roles()
        return roles
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{rol_id}", response_model=RolResponse)
def obtener_rol(rol_id: int, db: Session = Depends(get_db)):
    controller = RolController(db)
    try:
        rol = controller.obtener_rol(rol_id)
        return rol
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e)) 

@router.put("/{rol_id}", response_model=RolResponse)
def actualizar_rol(rol_id: int, data: RolUpdate, db: Session = Depends(get_db)):
    controller = RolController(db)
    try:
        rol = controller.update_rol(rol_id, data)
        return rol
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))     