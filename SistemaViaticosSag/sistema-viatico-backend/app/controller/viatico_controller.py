from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional, Tuple

from app.model.viatico_model import Viatico
from app.schema.viatico_schema import ViaticoCreate, ViaticoUpdate, RespuestaViaticoListado, RespuestaCreacionViatico, RespuestaViaticoDetallado

import logging

logger = logging.getLogger(__name__)
class ViaticoController:
    
    def __init__(self, db: Session):
        self.db = db

    def create_viatico(self, data: ViaticoCreate) -> Tuple[bool, str, Optional[int]]:
        """ 
        Crea un viatico 
        Retorna: (éxito, mensaje, id_viatico)
        """

        try: 
            result = self.db.execute(
                text(
                    """
                    DECLARE  @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CrearViatico
                        @id_plantilla = :id_plantilla,
                        @id_unidad = :id_unidad,
                        @id_programa = :id_programa,
                        @id_cuenta_presupuestaria = :id_cuenta_presupuestaria,
                        @id_motivo_cometido = :id_motivo_cometido,
                        @id_region = :id_region,
                        @id_producto_subesp = :id_producto_subesp,
                        @localidad_destino = :localidad_destino,
                        @fecha_desde = :fecha_desde,
                        @fecha_hasta = :fecha_hasta,
                        @dias_100 = :dias_100,
                        @dias_40 = :dias_40,
                        @descripcion_cometido = :descripcion_cometido,
                        @observaciones = :observaciones,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                    """
                ),
                {
                    "id_plantilla": data.id_plantilla,
                    "id_unidad": data.id_unidad,
                    "id_programa": data.id_programa,
                    "id_cuenta_presupuestaria": data.id_cuenta_presupuestaria,
                    "id_motivo_cometido": data.id_motivo_cometido,
                    "id_region": data.id_region,
                    "id_producto_subesp": data.id_producto_subesp,
                    "localidad_destino": data.localidad_destino,
                    "fecha_desde": data.fecha_desde,
                    "fecha_hasta": data.fecha_hasta,
                    "dias_100": data.dias_100,
                    "dias_40": data.dias_40,
                    "descripcion_cometido": data.descripcion_cometido,
                    "observaciones": data.observaciones
                }
            )
            
            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado <= 0:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                raise ValueError(mensaje)
            
            
            self.db.commit()
            logger.info(f"Viatico creado exitosamente con ID: {resultado}")
            
            return RespuestaCreacionViatico(
                resultado=resultado,
                mensaje=mensaje,
            )

        except ValueError as e:
            raise
        except IntegrityError as e:
            self.db.rollback()

            if "plantillas" in str(e):
                raise ValueError("La plantilla no existe")
            elif "programas" in str(e):
                raise ValueError("El programa no existe")
            elif "cuentas_presupuestarias" in str(e):
                raise ValueError("La cuenta presupuestaria no existe")
            elif "motivos_cometidos" in str(e):
                raise ValueError("El motivo de cometido no existe")
            elif "regiones" in str(e):
                raise ValueError("La region no existe")
            elif "producto_subesp" in str(e):
                raise ValueError("El producto subesp no existe")
            elif "valor_viatico" in str(e):
                raise ValueError("El valor viatico no existe")
            else:
                raise ValueError(f"Error al crear el viatico: {str(e)}")

    def obtener_viaticos(self, id_plantilla: int) -> List[RespuestaViaticoListado]:
        """ Obtiene todos los viaticos de una plantilla """
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerListadoViatico @id_plantilla = :id_plantilla
                """
            ),
            {'id_plantilla': id_plantilla}
        )
        
        viaticos = result.fetchall()
        
        return viaticos
    
    def obtener_viatico_para_editar(self, id_viatico: int) -> dict:
        """
        Obtiene un viático con todos sus datos actuales para formulario de edición.
        Incluye información de tablas relacionadas para mostrar en el formulario.
        """
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerViaticoSimple @id_viatico = :id_viatico
                """
            ),
            {'id_viatico': id_viatico}
        )
        
        viatico = result.fetchone()
        
        if not viatico:
            raise ValueError(f"Viático con ID {id_viatico} no encontrado")
        
        return viatico
    
    def actualizar_viatico(self, id_viatico: int, data: ViaticoUpdate) -> tuple[bool, str, int]:
        """Actualiza un viático existente"""
        try:
            # SQLAlchemy con pyodbc requiere esta sintaxis para OUTPUT params
            query = text("""
                DECLARE @resultado INT, @mensaje NVARCHAR(500);
                
                EXEC sp_ActualizarViatico
                    @id_viatico = :id_viatico,
                    @id_unidad = :id_unidad,
                    @id_programa = :id_programa,
                    @id_cuenta_presupuestaria = :id_cuenta_presupuestaria,
                    @id_motivo_cometido = :id_motivo_cometido,
                    @id_region = :id_region,
                    @id_producto_subesp = :id_producto_subesp,
                    @localidad_destino = :localidad_destino,
                    @fecha_desde = :fecha_desde,
                    @fecha_hasta = :fecha_hasta,
                    @dias_100 = :dias_100,
                    @dias_40 = :dias_40,
                    @descripcion_cometido = :descripcion_cometido,
                    @observaciones = :observaciones,
                    @resultado = @resultado OUTPUT,
                    @mensaje = @mensaje OUTPUT;
                
                SELECT @resultado AS resultado, @mensaje AS mensaje;
            """)
            
            params = {
                "id_viatico": id_viatico,
                "id_unidad": data.id_unidad,
                "id_programa": data.id_programa,
                "id_cuenta_presupuestaria": data.id_cuenta_presupuestaria,
                "id_motivo_cometido": data.id_motivo_cometido,
                "id_region": data.id_region,
                "id_producto_subesp": data.id_producto_subesp,
                "localidad_destino": data.localidad_destino,
                "fecha_desde": data.fecha_desde,
                "fecha_hasta": data.fecha_hasta,
                "dias_100": data.dias_100,
                "dias_40": data.dias_40,
                "descripcion_cometido": data.descripcion_cometido,
                "observaciones": data.observaciones
            }
            
            result = self.db.execute(query, params)
            row = result.fetchone()
            
            resultado = row.resultado
            mensaje = row.mensaje
            
            if resultado > 0:
                self.db.commit()
                logger.info(f"Viático actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado                 
            else:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                return False, mensaje, resultado

        except Exception as e:
            self.db.rollback()
            error_msg = f"Error interno al actualizar viático: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, -1             

    def obtener_viatico_id(self, id_viatico: int) -> RespuestaViaticoDetallado:
        result = self.db.execute(
            text(
                """
                EXEC sp_ObtenerViaticoDetallada @id_viatico = :id_viatico
                """
            ),
            {'id_viatico': id_viatico}
        )

        viatico = result.fetchone()
        if not viatico:
            raise ValueError(f"Viático con ID {id_viatico} no encontrado")
        return viatico

    def eliminar_viatico(self, viatico_id: int) -> tuple[bool, str, int]:
        """Elimina un viático"""
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);
                    
                    EXEC dbo.sp_EliminarViatico
                        @id_viatico = :id_viatico,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;
                    
                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                """),
                {"id_viatico": viatico_id}
                )
            
            row = result.fetchone()
            
            resultado = row.resultado
            mensaje = row.mensaje
            
            if resultado > 0:
                self.db.commit()
                logger.info(f"Viático eliminado: {resultado}")
                return True, mensaje, resultado
            else:
                self.db.rollback()
                logger.warning(f"Error al eliminar: {mensaje}")
                return False, mensaje, resultado
                
        except Exception as e:
            self.db.rollback()
            error_msg = f"Error al eliminar viático: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, -1