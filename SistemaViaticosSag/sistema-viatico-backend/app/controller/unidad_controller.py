from venv import logger
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional

from app.model.unidad_model import Unidad
from app.schema.unidad_schema import RespuestaUnidad, UnidadCambiarEstado, UnidadCreate, UnidadUpdate, UnidadResponse

class UnidadController:
    def __init__(self, db: Session):
        self.db = db

    def create_unidad(self, data: UnidadCreate) -> UnidadResponse:
        try:
            params = {
                "codigo_unidad": data.codigo_unidad,
                "nombre_unidad": data.nombre_unidad,
                "id_jefe": data.id_jefe,
                "id_padre": data.id_padre
            }
            unidad = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CrearUnidad
                        @codigo_unidad = :codigo_unidad,
                        @nombre_unidad = :nombre_unidad,
                        @id_jefe = :id_jefe,
                        @id_padre = :id_padre,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;
                    
                    SELECT @resultado AS resultado, @mensaje AS mensaje; 
                    """
                ), params)
            
            row = unidad.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje
            
            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Unidad creada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al crear unidad: {mensaje}")
                return False, mensaje, None
        except IntegrityError as e:
            self.db.rollback()

            raise ValueError(f"Error al crear la unidad: {str(e)}")
    
    def obtener_unidad(self, unidad_id: int) -> UnidadResponse:
        unidad = self.db.query(Unidad).filter(Unidad.id_unidad == unidad_id).first()
        if not unidad:
            raise ValueError(f"Unidad con ID {unidad_id} no encontrada")
        return unidad
    
    def obtener_unidades(self) -> List[UnidadResponse]:
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_ListarUnidades()
                    """
                )
            )

            unidades = result.fetchall()
            if not unidades:
                raise ValueError("No se encontraron unidades")
            return unidades
        except Exception as e:
            raise ValueError(f"Error al obtener unidades: {str(e)}")

    def update_unidad(self, id_unidad: int, data: UnidadUpdate) -> RespuestaUnidad:
        """
        Actualizar una unidad mediante el id_unidad
        """

        try:
            params = {
                "id_unidad": id_unidad,
                "codigo_unidad": data.codigo_unidad,
                "nombre_unidad": data.nombre_unidad,
                "id_jefe": data.id_jefe,
                "activo": data.activo,
            }

            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarUnidad
                        @id_unidad = :id_unidad,
                        @codigo_unidad = :codigo_unidad,
                        @nombre_unidad = :nombre_unidad,
                        @id_jefe = :id_jefe,
                        @activo = :activo,
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
                logger.info(f"Unidad actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar unidad: {mensaje}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error al actualizar unidad: {str(e)}")
            raise ValueError(f"Error al actualizar unidad: {str(e)}")
        
    def cambiar_estado_unidad(self, id_unidad: int, data: UnidadCambiarEstado) -> RespuestaUnidad:
        try:
            params = {
                "id_unidad": id_unidad,
                "activo": data.activo,
            }

            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarEstadoUnidad
                        @id_unidad = :id_unidad,
                        @activo = :activo,
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
                logger.info(f"Unidad actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar unidad: {mensaje}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error al actualizar unidad: {str(e)}")
            raise ValueError(f"Error al actualizar unidad: {str(e)}")