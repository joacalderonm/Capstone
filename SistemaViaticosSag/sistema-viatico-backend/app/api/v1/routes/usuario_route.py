from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.controller.usuario_controller import UsuarioController
from app.core.database import get_db
from app.schema.usuario_schema import CambiarSubrogante, ObtenerUsuarioUnidad, RespuestaCambioSubrogante, UsuarioCreateFirebase, UsuarioUpdate, UsuarioResponseFirebase, UsuarioCambiarEstado, UsuarioEditForm, RespuestaUsuarioDetallado, CambiarEstadoResponse
router = APIRouter()

@router.post("/firebase", response_model=dict)
def crear_usuario_firebase(data: UsuarioCreateFirebase, db: Session = Depends(get_db)):
    """
    Crea un usuario completo: Firebase Auth + base de datos local
    """
    controller = UsuarioController(db)

    exito, mensaje, id_usuario = controller.create_usuario_firebase(data)

    if exito:
        # Obtener el firebase_uid del usuario recién creado
        from app.model.usuario_model import Usuario
        usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
        firebase_uid = usuario.autenticador_firebase.firebase_uid if usuario and usuario.autenticador_firebase else None

        return {
            "success": True,
            "message": mensaje,
            "data": {
                "id_usuario": id_usuario,
                "firebase_uid": firebase_uid
            }
        }
    else:
        # Determinar el código de estado HTTP basado en el mensaje
        status_code = 400
        if "ya existe" in mensaje.lower():
            status_code = 409  # Conflict
        elif "no existe" in mensaje.lower():
            status_code = 422  # Unprocessable Entity

        raise HTTPException(
            status_code=status_code,
            detail={
                "success": False,
                "message": mensaje,
                "error_type": "validation_error" if status_code == 422 else "conflict_error"
            }
        )

@router.get("/firebase/{firebase_uid}", response_model=UsuarioResponseFirebase)
def obtener_usuario_por_firebase(firebase_uid: str, db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    try:
        usuario = controller.obtener_usuario_por_firebase_uid(firebase_uid)

        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{id_usuario}", response_model=RespuestaUsuarioDetallado)
def obtener_usuario(id_usuario: int, db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    usuario = controller.obtener_usuario(id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.get("/", response_model=List[RespuestaUsuarioDetallado])
def obtener_usuarios(db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    usuarios = controller.obtener_usuarios()
    if not usuarios:
        raise HTTPException(status_code=404, detail="Usuarios no encontrados")
    return usuarios

@router.get("/rol/{id_rol}", response_model=List[RespuestaUsuarioDetallado])
def obtener_usuarios_por_rol(id_rol: int, db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    usuarios = controller.obtener_usuarios_por_rol(id_rol)
    if not usuarios:
        raise HTTPException(status_code=404, detail="Usuarios no encontrados")
    return usuarios

@router.get("/estado/{activo}", response_model=List[RespuestaUsuarioDetallado])
def obtener_usuarios_por_estado(activo: bool, db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    usuarios = controller.obtener_usuarios_por_estado(activo)
    if not usuarios:
        raise HTTPException(status_code=404, detail="Usuarios no encontrados")
    return usuarios

@router.put("/estado/{id_usuario}", response_model=CambiarEstadoResponse)
def cambiar_estado_usuario(id_usuario: int, data: UsuarioCambiarEstado, db: Session = Depends(get_db)):
    """
    Cambia el estado (activo/inactivo) de un usuario
    """
    controller = UsuarioController(db)
    exito, mensaje, id_resultado = controller.cambiar_estado_usuario(id_usuario, data)
    
    if not exito:
        raise HTTPException(status_code=400, detail=mensaje)
    
    return CambiarEstadoResponse(
        exito=exito,
        mensaje=mensaje,
        id_usuario=id_resultado
    )

@router.get("/{id_usuario}/editar", response_model=UsuarioEditForm)
def obtener_usuario_para_editar(id_usuario: int, db: Session = Depends(get_db)):
    """
    Obtiene datos para formulario de edición
    """
    controller = UsuarioController(db)
    try:
        datos_formulario = controller.obtener_usuario_para_editar(id_usuario)
        
        return datos_formulario
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.put("/{id_usuario}", response_model=RespuestaUsuarioDetallado)
def actualizar_usuario(id_usuario: int, data: UsuarioUpdate, db: Session = Depends(get_db)):
    """
    Actualiza un usuario con Firebase usando procedimiento almacenado

    Args:
        id_usuario (int): ID del usuario a actualizar
        data (UsuarioUpdate): Datos del usuario a actualizar
        db (Session): Sessión de la base de datos

    Returns:
        UsuarioResponseLista: Usuario actualizado
    """
    controller = UsuarioController(db)
    exito, mensaje, resultado_id = controller.actualizar_usuario(id_usuario, data)
    
    if not exito:
        # Determinar código de error
        error_type = "unknown_error"
        
        mensaje_lower = mensaje.lower()
        
        if "no existe" in mensaje_lower and "usuario" in mensaje_lower:
            error_type = "not_found"
        elif "duplicado" in mensaje_lower or "ya existe" in mensaje_lower:
            error_type = "conflict_error"
        elif "no existe" in mensaje_lower:
            error_type = "validation_error"
        
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": mensaje,
                "error_type": error_type
            }
        )
    
    return controller.obtener_usuario(resultado_id)

@router.put("/{id_usuario}/subrogante", response_model=RespuestaCambioSubrogante)
def cambiar_subrogante_usuario(id_usuario: int, data: CambiarSubrogante, db: Session = Depends(get_db)):
    """
    Cambia el subrogante de un usuario
    """
    controller = UsuarioController(db)
    exito, mensaje, id_resultado = controller.cambiar_subrogante_usuario(id_usuario, data.es_subrogante)
    
    if not exito:
        raise HTTPException(status_code=400, detail=mensaje)
    
    return RespuestaCambioSubrogante(
        exito=exito,
        mensaje=mensaje,
        resultado=id_resultado
    )

@router.get("/{id_unidad}/unidad", response_model=List[ObtenerUsuarioUnidad])
def obtener_usuario_unidad(id_unidad: int, db: Session = Depends(get_db)):
    controller = UsuarioController(db)
    try:
        usuarios = controller.obtener_usuario_unidad(id_unidad)
        
        return usuarios
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")