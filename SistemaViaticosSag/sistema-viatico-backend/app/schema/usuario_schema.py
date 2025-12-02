from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class UsuarioCreateFirebase(BaseModel):
    """
    Schema para creación de usuario con información de Firebase
    """
    password: str = Field(..., min_length=6, max_length=128)  # Password temporal para Firebase
    id_rol: int
    id_unidad: int
    id_region: int
    id_calidad_juridica: int
    id_grado: int
    nombre_usuario : str = Field(..., min_length=1, max_length=50)
    apellido_paterno : str = Field(..., min_length=1, max_length=50)
    apellido_materno : str = Field(..., min_length=1, max_length=50)
    rut_numero : int
    rut_dv : str
    correo : str = Field(..., min_length=5, max_length=100)

class UsuarioResponseFirebase(BaseModel):
    """
    Schema para respuesta de usuario con información de Firebase
    """
    id_usuario: int
    nombre_usuario: str
    apellido_paterno: str
    apellido_materno: str
    rut_completo : str
    correo: str
    nombre_rol: Optional[str] = None
    nombre_unidad: Optional[str] = None
    nombre_region: Optional[str] = None
    tipo: Optional[str] = None
    id_unidad: Optional[int] = None
    codigo_unidad: Optional[str] = None

class UsuarioUpdate(BaseModel):
    """
    Schema para actualizar Usuario
    Todos los campos son opcionales - Solo se actualizan los que se envían
    """
    id_rol: Optional[int] = Field(None, gt=0)
    id_unidad: Optional[int] = Field(None, gt=0)
    id_region: Optional[int] = Field(None, gt=0)
    id_calidad_juridica: Optional[int] = Field(None, gt=0)
    id_grado: Optional[int] = Field(None, gt=0)
    nombre_usuario : Optional[str] = Field(None, min_length=1, max_length=50, nullable=True)
    apellido_paterno : Optional[str] = Field(None, min_length=1, max_length=50, nullable=True)
    apellido_materno : Optional[str] = Field(None, min_length=1, max_length=50, nullable=True)

class UsuarioEditForm(BaseModel):
    """
    Schema para editar formulario con edición con datos pre-cargados
    """
    id_rol: int
    id_unidad: int
    id_region: int
    id_calidad_juridica: int
    id_grado: int
    nombre_usuario: str
    apellido_paterno: str
    apellido_materno: str
    titulo_formulario: str = "Editar Usuario"
    puede_eliminar: bool = True
    
    class Config:
        from_attributes = True

class UsuarioCambiarEstado(BaseModel):
    """
    Schema para activar/desactivar el usuario
    """
    activo: bool

class CambiarEstadoResponse(BaseModel):
    """
    Schema para la respuesta del cambio de estado
    """
    exito: bool
    mensaje: str
    id_usuario: Optional[int] = None
    
class UsuarioResponseSimple(BaseModel):
    """
    Schema para respuesta de usuario
    """
    id_usuario: int
    nombre_usuario : str
    apellido_paterno : str
    apellido_materno : str
    id_rol: int
    id_unidad: int
    id_region: int
    id_calidad_juridica: int
    id_grado: int

    class Config:
        from_attributes = True

class RespuestaUsuarioDetallado(BaseModel):
    """
    Schema para respuesta de usuario
    """
    id_usuario: int
    nombre_usuario : str
    apellido_paterno : str
    apellido_materno : str
    rut_completo: str
    correo : str
    nombre_rol: Optional[str] = None
    nombre_unidad: Optional[str] = None
    nombre_region: Optional[str] = None
    tipo: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True

class CambiarSubrogante(BaseModel):
    es_subrogante: bool
    
class RespuestaCambioSubrogante(BaseModel):
    exito: bool
    mensaje: str
    resultado: int

class ObtenerUsuarioUnidad(BaseModel):
    id_usuario: int
    nombre_usuario: str
    es_subrogante: bool
    rut_completo: str