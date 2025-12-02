from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional, Tuple

from app.model.gasto_reembolsable_model import GastoReembolsable
from app.schema.gastos_reembolsables_schema import CrearGastoReembolsable, ActualizarGastoReembolsable, GastoReembolsableDetallado, GastoReembolsableSimple, RespuestaCreacionGastoReembolsable

import logging

logger = logging.getLogger(__name__)

class GastoReembolsableController:
    
    def __init__(self, db: Session):
        self.db = db

    def create_gasto_reembolsable(self, data: CrearGastoReembolsable) ->  Tuple[bool, str, Optional[int]]:
        """ 
        Crea un gasto reembolsable 
        Retorna: (éxito, mensaje, id_gasto_reembolsable)
        """
        
        try:
            params = {
                "id_plantilla": data.id_plantilla,
                "id_tipo_gasto": data.id_tipo_gasto,
                "id_programa": data.id_programa,
                "id_producto_subesp": data.id_producto_subesp,
                "numero_documento": data.numero_documento,
                "fecha": data.fecha,
                "valor": data.valor,
                "descripcion": data.descripcion
            }
            
            result = self.db.execute(
                text(
                """
                DECLARE @resultado INT, @mensaje NVARCHAR(500);

                EXEC sp_CrearGastosReembolsables
                    @id_plantilla = :id_plantilla,
                    @id_tipo_gasto = :id_tipo_gasto,
                    @id_programa = :id_programa,
                    @id_producto_subesp = :id_producto_subesp,
                    @numero_documento = :numero_documento,
                    @fecha = :fecha,
                    @valor = :valor,
                    @descripcion = :descripcion,
                    @resultado = @resultado OUTPUT,
                    @mensaje = @mensaje OUTPUT;

                SELECT @resultado AS resultado, @mensaje AS mensaje;
                
                """
            ), params)
            
            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado <= 0:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                raise ValueError(mensaje)
            
            self.db.commit()
            logger.info(f"Gasto reembolsable creado exitosamente con ID: {resultado}")
            
            return RespuestaCreacionGastoReembolsable(
                resultado=resultado,
                mensaje=mensaje,
            )
        except ValueError as e:
            raise
        except IntegrityError as e:
            self.db.rollback()
            raise
    
    def obtener_gastos_reembolsables(self, id_plantilla: int) -> List[GastoReembolsableDetallado]:
        """ Obtiene todos los gastos reembolsables de una plantilla """
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerListadoGastoReembolsable @id_plantilla = :id_plantilla
                """
            ),
            {'id_plantilla': id_plantilla}
        )
        
        gastos_reembolsables = result.fetchall()
        
        return gastos_reembolsables

    def obtener_gasto_reembolsable_para_editar(self, id_gasto_reembolsable: int) -> GastoReembolsableSimple:
        """ Obtiene un gasto reembolsable con todos sus datos actuales para formulario de edición """
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerGastoReembolsableSimple @id_gasto_reembolsable = :id_gasto_reembolsable
                """
            ),
            {'id_gasto_reembolsable': id_gasto_reembolsable}
        )
        
        gasto_reembolsable = result.fetchone()
        
        if not gasto_reembolsable:
            raise ValueError(f"Gasto reembolsable con ID {id_gasto_reembolsable} no encontrado")
        
        return gasto_reembolsable

    def actualizar_gasto_reembolsable(self, id_gasto_reembolsable: int, data: ActualizarGastoReembolsable) -> tuple[bool, str, int]:
        """ Actualiza un gasto reembolsable existente """
        try:
            params = {
                "id_gasto_reembolsable": id_gasto_reembolsable,
                "id_tipo_gasto": data.id_tipo_gasto,
                "id_programa": data.id_programa,
                "id_producto_subesp": data.id_producto_subesp,
                "numero_documento": data.numero_documento,
                "fecha": data.fecha,
                "valor": data.valor,
                "descripcion": data.descripcion
            }

            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarGastoReembolsable
                        @id_gasto_reembolsable = :id_gasto_reembolsable,
                        @id_tipo_gasto = :id_tipo_gasto,
                        @id_programa = :id_programa,
                        @id_producto_subesp = :id_producto_subesp,
                        @numero_documento = :numero_documento,
                        @fecha = :fecha,
                        @valor = :valor,
                        @descripcion = :descripcion,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                params
            )

            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado > 0:
                self.db.commit()
                logger.info(f"Gasto reembolsable actualizado exitosamente con ID: {id_gasto_reembolsable}")
                return True, mensaje, id_gasto_reembolsable
            else:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, resultado
            
        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al actualizar el gasto reembolsable: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, -1    

    def eliminar_gasto_reembolsable(self, id_gasto_reembolsable: int) -> tuple[bool, str]:
        """
        Elimina un Gasto Reembolsable
        """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_EliminarGastoReembolsable
                        @id_gasto_reembolsable = :id_gasto_reembolsable,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {"id_gasto_reembolsable": id_gasto_reembolsable}
            )
            
            row = result.fetchone()
            
            resultado = row.resultado
            mensaje = row.mensaje
            
            if resultado > 0:
                self.db.commit()
                logger.info(f"Gasto reembolsable eliminado exitosamente con ID: {id_gasto_reembolsable}")
                return True, mensaje
            else:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje
            
        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al eliminar el gasto reembolsable: {str(e)}"
            logger.error(error_msg)
            return False, error_msg