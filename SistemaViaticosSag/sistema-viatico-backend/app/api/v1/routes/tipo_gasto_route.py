from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.controller.tipo_gasto_controller import TipoGastoController
from app.core.database import get_db
from app.schema.tipo_gasto_schema import TipoGastoCreate, TipoGastoUpdate, TipoGastoResponse

router = APIRouter()

@router.post("/", response_model=TipoGastoResponse)
def create_tipo_gasto(data: TipoGastoCreate, db: Session = Depends(get_db)):
    """ Crea un tipo de gasto """
    controller = TipoGastoController(db)
    try:
        tipo_gasto = controller.create_tipo_gasto(data)
        return tipo_gasto
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[TipoGastoResponse])
def obtener_tipo_gastos(db: Session = Depends(get_db)):
    """ Obtiene todos los tipos de gasto """
    controller = TipoGastoController(db)
    try: 
        tipo_gastos = controller.obtener_tipo_gastos()
        return tipo_gastos
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/{id_tipo_gasto}", response_model=TipoGastoResponse)
def obtener_tipo_gasto_por_id(id_tipo_gasto: int, db: Session = Depends(get_db)):
    """ Obtiene un tipo de gasto por su id """
    controller = TipoGastoController(db)
    try: 
        tipo_gasto = controller.obtener_tipo_gasto_por_id(id_tipo_gasto)
        return tipo_gasto
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.put("/{id_tipo_gasto}", response_model=TipoGastoResponse)
def actualizar_tipo_gasto(id_tipo_gasto: int, data: TipoGastoUpdate, db: Session = Depends(get_db)):
    """ Actualiza un tipo de gasto """
    controller = TipoGastoController(db)
    try: 
        tipo_gasto = controller.update_tipo_gasto(id_tipo_gasto, data)
        return tipo_gasto
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.delete("/{id_tipo_gasto}", response_model=TipoGastoResponse)
def eliminar_tipo_gasto(id_tipo_gasto: int, db: Session = Depends(get_db)):
    """ Elimina un tipo de gasto """
    controller = TipoGastoController(db)
    try: 
        tipo_gasto = controller.delete_tipo_gasto(id_tipo_gasto)
        return tipo_gasto
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
