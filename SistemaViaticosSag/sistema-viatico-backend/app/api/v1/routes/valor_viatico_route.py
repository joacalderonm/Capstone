from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.valor_viatico_controller import ValorViaticoController
from app.core.database import get_db
from app.schema.valor_viatico_schema import ValorViaticoCreate, ValorViaticoUpdate, ValorViaticoResponse

router = APIRouter()

@router.post("/", response_model=ValorViaticoResponse)
def crear_valor_viatico(data: ValorViaticoCreate, db: Session = Depends(get_db)):
    controller = ValorViaticoController(db)
    try:
        valor_viatico = controller.create_valor_viatico(data)
        return valor_viatico
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{valor_viatico_id}", response_model=ValorViaticoResponse)
def obtener_valor_viatico(valor_viatico_id: int, db: Session = Depends(get_db)):
    controller = ValorViaticoController(db)
    valor_viatico = controller.obtener_valor_viatico(valor_viatico_id)
    if not valor_viatico:
        raise HTTPException(status_code=404, detail="Valor viático no encontrado")
    return valor_viatico

@router.get("/", response_model=List[ValorViaticoResponse])
def obtener_valores_viaticos(db: Session = Depends(get_db)):
    controller = ValorViaticoController(db)
    valores_viaticos = controller.obtener_valores_viaticos()
    if not valores_viaticos:
        raise HTTPException(status_code=404, detail="No se encontraron valores viáticos")
    return valores_viaticos
