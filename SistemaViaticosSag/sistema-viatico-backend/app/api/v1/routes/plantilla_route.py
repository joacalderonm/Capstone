from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.plantilla_controller import PlantillaController
from app.core.database import get_db
from app.schema.plantilla_schema import PlantillaCreate, PlantillaUpdate, PlantillaResponse, RespuestaCierrePlantilla, RespuestaCreacionPlantilla, RespuestaFirmantesUnidad, RespuestaKPIConteoPlantilla, RespuestaKPIPorProducto, RespuestaKPITotal, RespuestaListadoPlantillaUnidad, RespuestaPlantillaUsuario, RespuestaPlantillaListadoUsuario

router = APIRouter()

@router.post("/", response_model=RespuestaCreacionPlantilla)
def create_plantilla(data: PlantillaCreate, db: Session = Depends(get_db)):
    """ Crea una nueva plantilla """
    controller = PlantillaController(db)
    
    try:
        return controller.create_plantilla(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[PlantillaResponse])
def obtener_plantillas(db: Session = Depends(get_db)):
    """ Obtiene todas las plantillas """
    controller = PlantillaController(db)
    try: 
        plantillas = controller.obtener_plantillas()
        return plantillas
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/{id_usuario}", response_model=List[RespuestaPlantillaListadoUsuario])
def obtener_plantilla_por_usuario(id_usuario: int, db: Session = Depends(get_db)):
    """ Obtiene el listado de las plantillas del usuario"""
    controller = PlantillaController(db)
    try: 
        plantillas = controller.obtener_plantilla_por_usuario(id_usuario)
        if not plantillas:
            raise HTTPException(status_code=404, detail="No se encontraron plantillas para el usuario")
        return plantillas
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/formulario/{id_plantilla}", response_model=RespuestaPlantillaUsuario)
def obtener_plantilla_por_id(id_plantilla: int, db: Session = Depends(get_db)):
    """ Obtiene una plantilla por su id"""
    controller = PlantillaController(db)
    try: 
        plantilla = controller.obtener_plantilla_por_id(id_plantilla)
        if not plantilla:
            raise HTTPException(status_code=404, detail="No se encontró la plantilla")
        return plantilla
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("plantilla/{id_unidad}/firmantes", response_model=List[RespuestaFirmantesUnidad])
def obtener_usuarios_firmantes(id_unidad: int, db: Session = Depends(get_db)):
    controller = PlantillaController(db)
    usuarios = controller.obtener_usuarios_firmantes(id_unidad)
    if not usuarios:
        raise HTTPException(status_code=404, detail="Usuarios no encontrados")
    return usuarios

@router.put("/{id_plantilla}/cerrar", response_model=RespuestaCierrePlantilla)
def cerrar_plantilla(id_plantilla: int, id_usuario_supervisor: int, db: Session = Depends(get_db)):
    """ Cierra una plantilla"""
    controller = PlantillaController(db)
    try: 
        resultado = controller.cerrar_plantilla(id_plantilla, id_usuario_supervisor)
        return resultado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/{id_unidad}/listado", response_model=List[RespuestaListadoPlantillaUnidad])
def obtener_listado_unidad(id_unidad: int, db: Session = Depends(get_db)):
    """ Obtiene el listado de plantillas por unidad """
    controller = PlantillaController(db)
    try: 
        plantillas = controller.obtener_listado_unidad(id_unidad)
        if not plantillas:
            raise HTTPException(status_code=404, detail="No se encontraron plantillas para la unidad")
        return plantillas
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/monto_total_ano/{id_usuario}", response_model=RespuestaKPITotal)
def obtener_kpi_monto_total_ano(id_usuario: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de monto total por año """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_monto_total_ano(id_usuario)
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return kpi
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/monto_total_mes/{id_usuario}", response_model=RespuestaKPITotal)
def obtener_kpi_monto_total_mes(id_usuario: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de monto total por mes """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_monto_total_mes(id_usuario)
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return kpi
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/monto_total_producto_mes/{id_usuario}", response_model=List[RespuestaKPIPorProducto])
def obtener_kpi_monto_total_producto_mes(id_usuario: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de monto total por producto mes """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_monto_total_producto_mes(id_usuario)
        
        return kpi
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/monto_total_mes_unidad/{id_unidad}", response_model=RespuestaKPITotal)
def obtener_kpi_monto_total_mes_unidad(id_unidad: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de monto total por mes unidad """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_monto_total_mes_unidad(id_unidad)
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return kpi
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/monto_total_producto_mes_unidad/{id_unidad}", response_model=List[RespuestaKPIPorProducto])
def obtener_kpi_monto_total_producto_mes_unidad(id_unidad: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de monto total por producto mes unidad """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_monto_total_producto_mes_unidad(id_unidad)
        return kpi
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/kpi/conteo_plantilla/{id_unidad}", response_model=RespuestaKPIConteoPlantilla)
def obtener_kpi_conteo_plantilla(id_unidad: int, db: Session = Depends(get_db)):
    """ Obtiene el KPI de conteo de plantillas """
    controller = PlantillaController(db)
    try: 
        kpi = controller.obtener_kpi_conteo_plantilla(id_unidad)
        return kpi
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")