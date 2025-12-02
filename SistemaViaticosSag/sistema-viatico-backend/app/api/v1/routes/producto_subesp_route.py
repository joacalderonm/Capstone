from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.producto_subesp_controller import ProductoSubespController
from app.core.database import get_db
from app.schema.producto_subesp_schema import ProductoSubespCambiarEstado, ProductoSubespCreate, ProductoSubespUpdate, ProductoSubespResponse, RespuestaProductoSubesp

router = APIRouter()

@router.post("/", response_model=ProductoSubespResponse)
def create_producto_subesp(data: ProductoSubespCreate, db: Session = Depends(get_db)):
    controller = ProductoSubespController(db)
    try:
        producto_subesp = controller.create_producto_subesp(data)
        return producto_subesp
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ProductoSubespResponse])
def listar_productos_subesp(db: Session = Depends(get_db)):
    controller = ProductoSubespController(db)
    try:
        productos_subesp = controller.obtener_productos_subesp()
        return productos_subesp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id_producto}", response_model=ProductoSubespResponse)
def obtener_producto_subesp_por_id(id_producto: int, db: Session = Depends(get_db)):
    controller = ProductoSubespController(db)
    try:
        producto_subesp = controller.obtener_producto_subesp_por_id(id_producto)
        return producto_subesp
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/{id_producto}", response_model=RespuestaProductoSubesp)
def actualizar_producto_subesp(id_producto: int, data: ProductoSubespUpdate, db: Session = Depends(get_db)):
    controller = ProductoSubespController(db)
    try:
        exito, mensaje, id_resultado = controller.actualizar_producto_subesp(id_producto, data)
        return RespuestaProductoSubesp(
            exito=exito,
            mensaje=mensaje,
            id_producto_subesp=id_resultado
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/estado/{id_producto}", response_model=RespuestaProductoSubesp)
def cambiar_estado_producto_subesp(id_producto: int, data: ProductoSubespCambiarEstado, db: Session = Depends(get_db)):
    controller = ProductoSubespController(db)
    try:
        exito, mensaje, id_resultado = controller.cambiar_estado_producto_subesp(id_producto, data)
        return RespuestaProductoSubesp(
            exito=exito,
            mensaje=mensaje,
            id_producto_subesp=id_resultado
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))