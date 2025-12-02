from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract
from typing import List, Optional, Tuple

from app.model.usuario_model import Usuario
from app.schema.usuario_schema import CambiarSubrogante, ObtenerUsuarioUnidad, RespuestaCambioSubrogante, UsuarioCreateFirebase, UsuarioUpdate, UsuarioResponseFirebase, RespuestaUsuarioDetallado, UsuarioCambiarEstado
from app.core.firebase_service import firebase_service

from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)

class UsuarioController:
    def __init__(self, db: Session):
        self.db = db

    def create_usuario_firebase(self, data: UsuarioCreateFirebase) -> Tuple[bool, str, Optional[int]]:
        """
        Crea un usuario completo: primero en Firebase Auth, luego en DB local
        Retorna: (éxito, mensaje, id_usuario)
        """
        firebase_uid = None
        try:
            # 1. Crear usuario en Firebase Auth
            firebase_uid = firebase_service.create_user(data.correo, data.password)
            logger.info(f"Usuario creado en Firebase con UID: {firebase_uid}")

            # 2. Asignar custom claims si es administrador (rol=1)
            if data.id_rol == 1:
                firebase_service.set_custom_claims(firebase_uid, {"admin": True, "rol": 1})
                logger.info(f"Custom claims asignados para admin al usuario {firebase_uid}")

            # 3. Crear usuario en base de datos local usando el stored procedure
            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CrearUsuarioFirebase
                        @firebase_uid = :firebase_uid,
                        @id_rol = :id_rol,
                        @id_unidad = :id_unidad,
                        @id_region = :id_region,
                        @id_calidad_juridica = :id_calidad_juridica,
                        @id_grado = :id_grado,
                        @nombre_usuario = :nombre_usuario,
                        @apellido_paterno = :apellido_paterno,
                        @apellido_materno = :apellido_materno,
                        @rut_numero = :rut_numero,
                        @rut_dv = :rut_dv,
                        @correo = :correo,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                """),
                {
                    "firebase_uid": firebase_uid,
                    "id_rol": data.id_rol,
                    "id_unidad": data.id_unidad,
                    "id_region": data.id_region,
                    "id_calidad_juridica": data.id_calidad_juridica,
                    "id_grado": data.id_grado,
                    "nombre_usuario": data.nombre_usuario,
                    "apellido_paterno": data.apellido_paterno,
                    "apellido_materno": data.apellido_materno,
                    "rut_numero": data.rut_numero,
                    "rut_dv": data.rut_dv,
                    "correo": data.correo,
                }
            )

            # Obtener el resultado
            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Usuario creado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error de validación en DB: hacer rollback y eliminar usuario de Firebase
                self.db.rollback()
                if firebase_uid:
                    try:
                        firebase_service.delete_user(firebase_uid)
                        logger.info(f"Usuario eliminado de Firebase debido a error en DB: {firebase_uid}")
                    except Exception as firebase_error:
                        logger.error(f"Error eliminando usuario de Firebase: {str(firebase_error)}")

                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, None

        except Exception as e:
            # Error inesperado: hacer rollback de DB y eliminar usuario de Firebase si fue creado
            self.db.rollback()
            if firebase_uid:
                try:
                    firebase_service.delete_user(firebase_uid)
                    logger.info(f"Usuario eliminado de Firebase debido a error: {firebase_uid}")
                except Exception as firebase_error:
                    logger.error(f"Error eliminando usuario de Firebase: {str(firebase_error)}")

            error_msg = f"Error interno al crear usuario: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, None

    def obtener_usuario_por_firebase_uid(self, firebase_uid: str) -> Optional[UsuarioResponseFirebase]:
        """
        Obtiene un usuario por su Firebase UID usando el procedimiento almacenado
        Retorna: UsuarioResponseFirebase o None
        """
        try:
            result = self.db.execute(
                text("EXEC sp_ObtenerUsuarioPorFirebaseUID @firebase_uid = :firebase_uid"),
                {'firebase_uid': firebase_uid}
            )
            
            usuario = result.fetchone()
            
            if not usuario:
                logger.info(f"Usuario no encontrado con Firebase UID: {firebase_uid}")
                return None
            
            return usuario
            
        except Exception as e:
            logger.error(f"Error al obtener usuario por Firebase UID {firebase_uid}: {str(e)}", exc_info=True)
            return None
    
    def actualizar_usuario(self, id_usuario: int, data: UsuarioUpdate) -> Tuple[bool, str, Optional[str]]:
        """
        Actualiza los datos de un usuario
        Retorna: (éxito, mensaje, id_usuario)
        """
        try:
            params = {
                "id_usuario": id_usuario,
                "id_rol": data.id_rol,
                "id_unidad": data.id_unidad,
                "id_region": data.id_region,
                "id_calidad_juridica": data.id_calidad_juridica,
                "id_grado": data.id_grado,
                "nombre_usuario": data.nombre_usuario,
                "apellido_paterno": data.apellido_paterno,
                "apellido_materno": data.apellido_materno,
            }

            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarUsuario
                        @id_usuario = :id_usuario,
                        @id_rol = :id_rol,
                        @id_unidad = :id_unidad,
                        @id_region = :id_region,
                        @id_calidad_juridica = :id_calidad_juridica,
                        @id_grado = :id_grado,
                        @nombre_usuario = :nombre_usuario,
                        @apellido_paterno = :apellido_paterno,
                        @apellido_materno = :apellido_materno,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;
                    
                    SELECT @resultado AS resultado, @mensaje AS mensaje; 
                """),
                params
            )

            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje
            
            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Usuario actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error de validación: hacer rollback
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, None
            
        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al actualizar usuario: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, None
        
    def obtener_usuario_para_editar(self, id_usuario: int) -> dict:
        """ 
        Obtiene datos reales y los prepara para el formulario de edición.
        """
        result = self.db.execute(
            text("EXEC sp_ObtenerUsuarioSimple @id_usuario = :id_usuario"), 
            {'id_usuario': id_usuario}
        )
        usuario = result.fetchone()

        if not usuario:
            raise ValueError(f"Usuario con ID {id_usuario} no encontrado")
        
        return usuario
        

    def obtener_usuario(self, id_usuario: int) -> RespuestaUsuarioDetallado:
        """ Obtiene un usuario por su ID """
        result = self.db.execute(text("EXEC sp_ObtenerUsuarioDetallada @id_usuario = :id_usuario"), {'id_usuario': id_usuario})
        usuario = result.fetchone()
        
        if not usuario:
            raise ValueError(f"Usuario con ID {id_usuario} no encontrado")
        
        return usuario

    def obtener_usuarios(self) -> List[RespuestaUsuarioDetallado]:
        """ Obtiene todos los usuarios """
        result = self.db.execute(text("EXEC sp_ObtenerUsuarios"))
        usuarios = result.fetchall()
        
        if not usuarios:
            raise ValueError("No se encontraron usuarios")
        return usuarios

    def obtener_usuarios_por_rol(self, id_rol: int) -> List[RespuestaUsuarioDetallado]:
        """ Obtiene todos los usuarios de un rol """
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerListadoUsuariosRol @id_rol = :id_rol
                """
            ),
            {'id_rol': id_rol}
        )
        
        usuarios = result.fetchall()
        
        if not usuarios:
            raise ValueError(f"No se encontraron usuarios para el rol con id {id_rol}")
        return usuarios

    def cambiar_estado_usuario(self, id_usuario: int, data: UsuarioCambiarEstado) -> Tuple[bool, str, Optional[str]]:
        """
        Cambia el estado de un usuario
        """
        try: 
            params = {
                'id_usuario': id_usuario, 
                'activo': data.activo
            }
            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarEstadoUsuario 
                        @id_usuario = :id_usuario, 
                        @activo = :activo, 
                        @resultado = @resultado OUTPUT, 
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                """), 
                params
                )

            usuario = result.fetchone()
            resultado = usuario.resultado
            mensaje = usuario.mensaje
        
            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Usuario actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error de validación: hacer rollback
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, None

        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al cambiar el estado del usuario: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, None

    def obtener_usuarios_por_estado(self, activo: bool) -> List[RespuestaUsuarioDetallado]:
        """ Obtiene todos los usuarios por estado """
        result = self.db.execute(text("EXEC sp_ObtenerUsuariosEstado @activo = :activo"), {'activo': activo})
        usuarios = result.fetchall()
        
        if not usuarios:
            raise ValueError(f"No se encontraron usuarios para el estado {activo}")
        return usuarios
    
    def cambiar_subrogante_usuario(self, id_usuario: int, es_subrogante: bool) -> Tuple[bool, str, Optional[str]]:
        """
        Cambia el subrogante de un usuario
        """
        try: 
            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarSubrogante   
                        @id_usuario = :id_usuario, 
                        @es_subrogante = :es_subrogante,
                        @resultado = @resultado OUTPUT, 
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                """), 
                {'id_usuario': id_usuario, 
                'es_subrogante': es_subrogante}
            )

            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Subrogante actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error de validación: hacer rollback
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, None

        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al cambiar el subrogante del usuario: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, None

    def obtener_usuario_unidad(self, id_unidad: int) -> List[ObtenerUsuarioUnidad]:
        """ Obtiene todos los usuarios de una unidad """
        result = self.db.execute(
            text(
                """
                SELECT * FROM fn_ObtenerUsuariosPorUnidad(:id_unidad)
                """), 
            {'id_unidad': id_unidad}
        )
        usuarios = result.fetchall()
        
        if not usuarios:
            raise ValueError(f"No se encontraron usuarios para la unidad con id {id_unidad}")
        return usuarios