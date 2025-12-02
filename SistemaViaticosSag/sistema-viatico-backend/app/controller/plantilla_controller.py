from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from typing import List, Optional, Tuple
from datetime import datetime

from app.model.plantilla_model import Plantilla
from app.schema.plantilla_schema import PlantillaCreate, PlantillaResponse, RespuestaCierrePlantilla, RespuestaCreacionPlantilla, ListadoPlantillaUsuario, PlantillaUsuario, RespuestaFirmantesUnidad, RespuestaKPITotal, RespuestaKPIPorProducto, RespuestaListadoPlantillaUnidad

from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)
class PlantillaController:

    def __init__(self, db: Session):
        self.db = db

    def create_plantilla(self, data: PlantillaCreate) -> Tuple[bool, str, Optional[int]]:
        """
        Crea una plantilla
        Retorna: (éxito, mensaje, id_plantilla)
        """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CrearPlantilla
                        @id_usuario = :id_usuario,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                """),
                {
                    "id_usuario": data.id_usuario,
                }
            )
            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje
            
             # Manejar resultados negativos como errores de validación
            if resultado == -2:
                self.db.rollback()
                logger.warning(f"Validación fallida: {mensaje}")
                raise ValueError(mensaje)
            elif resultado == -1:
                self.db.rollback()
                logger.warning(f"Plantilla ya existe: {mensaje}")
                raise ValueError(mensaje)
            elif resultado == -99:
                self.db.rollback()
                logger.error(f"Error en SP: {mensaje}")
                raise Exception(mensaje)
            elif resultado > 0:
                # Éxito - resultado contiene el ID de la plantilla
                self.db.commit()
                logger.info(f"Plantilla creada exitosamente con ID: {resultado}")
                return RespuestaCreacionPlantilla(
                    resultado=resultado,
                    mensaje=mensaje,
                    id_plantilla=resultado
                )
            else:
                # Cualquier otro código inesperado
                self.db.rollback()
                logger.error(f"Código de resultado inesperado: {resultado}")
                raise Exception(f"Error inesperado: {mensaje}")
            
        except ValueError:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error interno al crear plantilla: {str(e)}")
            raise Exception(f"Error interno: {str(e)}")
        
    def obtener_plantillas(self ) -> List[PlantillaResponse]:
        """ Obtiene todas las plantillas"""
        try:
            result = self.db.execute(
                text(
                    """
                    EXEC sp_ObtenerListadoPlantilla;
                    """
                )
            )
            plantillas = result.fetchall()

            if not plantillas:
                raise ValueError("No se encontraron plantillas")
            return plantillas
        except Exception as e:
            raise ValueError(f"Error al obtener el listado de plantillas: {str(e)}")
            

    def obtener_plantilla_por_usuario(self, id_usuario: int) -> ListadoPlantillaUsuario:
        """ Obtiene una plantilla por su id"""
        try:
            result = self.db.execute(
                text(
                    """
                    EXEC sp_ObtenerListadoPlantillaUsuario
                        @id_usuario = :id_usuario;
                    """
                    ),
                {
                    "id_usuario": id_usuario,
                }
            )
            plantillas = result.fetchall()

            if not plantillas:
                raise ValueError(f"No se encontraron plantillas para el usuario con id {id_usuario}")
            return plantillas
        except Exception as e:
            raise ValueError(f"Error al obtener el listado de plantillas: {str(e)}")
    
    def obtener_plantilla_por_id(self, id_plantilla: int) -> PlantillaUsuario:
        """ Obtiene una plantilla por su id"""
        try:
            result = self.db.execute(
                text(
                    """
                    EXEC sp_ObtenerPlantillaUsuario
                        @id_plantilla = :id_plantilla;
                    """
                ),
                {
                    "id_plantilla": id_plantilla,
                }
            )
            plantilla = result.fetchone()

            if not plantilla:
                raise ValueError(f"No se encontró la plantilla con id {id_plantilla}")
            return plantilla
        except Exception as e:
            raise ValueError(f"Error al obtener la plantilla: {str(e)}")
    
    def obtener_plantilla_por_numero(self, numero_plantilla: int) -> PlantillaResponse:
        """ Obtiene una plantilla por su numero"""
        return self.db.query(Plantilla).filter(
            and_(
                Plantilla.numero_plantilla == numero_plantilla,
                Plantilla.ano == datetime.now().year,
                Plantilla.mes == datetime.now().month
            )
        ).first()

    def obtener_usuarios_firmantes(self, id_unidad: int) -> List[RespuestaFirmantesUnidad]:
        """ Obtiene todos los usuarios firmantes de una unidad """
        result = self.db.execute(text("EXEC sp_ObtenerFirmantesUnidad @id_unidad = :id_unidad"), {'id_unidad': id_unidad})
        usuarios = result.fetchall()
        
        if not usuarios:
            raise ValueError(f"No se encontraron usuarios firmantes para la unidad con id {id_unidad}")
        return usuarios

    
    def cerrar_plantilla(self, id_plantilla: int, id_usuario_supervisor: int) -> RespuestaCierrePlantilla:
        """Cierra una plantilla"""
        try:
            # Ejecutar el stored procedure
            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CerrarPlantilla 
                        @id_plantilla = :id_plantilla, 
                        @id_usuario_supervisor = :id_usuario_supervisor,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                """),
                {
                    "id_plantilla": id_plantilla,
                    "id_usuario_supervisor": id_usuario_supervisor,
                }
            )
            
            # Obtener los resultados (el SP debe hacer SELECT de resultado y mensaje)
            row = result.fetchone()
            
            if row is None:
                self.db.rollback()
                raise ValueError("El procedimiento no retornó resultados")
            
            resultado = row[0]  # o row.resultado si usas Row mapping
            mensaje = row[1]    # o row.mensaje
            
            # Si el resultado no es exitoso, hacer rollback
            if resultado < 0:
                self.db.rollback()
                raise ValueError(f"Error al cerrar la plantilla: {mensaje}")
            
            # Commit exitoso
            self.db.commit()
            
            return RespuestaCierrePlantilla(
                id_plantilla=resultado,
                id_usuario_supervisor=id_usuario_supervisor,
                resultado=resultado,
                mensaje=mensaje
            )
            
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al cerrar la plantilla: {str(e)}")

    def obtener_listado_unidad(self, id_unidad: int) -> List[RespuestaListadoPlantillaUnidad]:
        """ Obtiene el listado de plantillas por unidad """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_ObtenerPlanillasPorUnidad(:id_unidad);
                """
                ),
                {"id_unidad": id_unidad}
            )
            plantillas = result.fetchall()
            
            if not plantillas:
                raise ValueError("No se encontraron plantillas para la unidad")
            return plantillas
        except Exception as e:
            raise ValueError(f"Error al obtener el listado de plantillas: {str(e)}")

    # KPIs Plantillas

    def obtener_kpi_monto_total_ano(self, id_usuario: int) -> RespuestaKPITotal:
        """ 
        Obtiene el KPI de monto total por año 
        Llama a la FN: fn_KPI_MontoTotalAno
        """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_KPI_MontoTotalAno(:id_usuario);
                """
                ),
                {"id_usuario": id_usuario}
            )
            kpi = result.fetchone()
            
            if not kpi:
                raise ValueError("No se encontró el KPI")
            return kpi
        except Exception as e:
            logger.error(f"Error al obtener KPI Monto Total Año: {str(e)}")
            raise ValueError(f"Error al obtener KPI Monto Total Año: {str(e)}")

    def obtener_kpi_monto_total_mes(self, id_usuario: int) -> RespuestaKPITotal:
        """ 
        Obtiene el KPI de monto total por mes 
        Llama a la FN: fn_KPI_MontoTotalMes
        """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_KPI_MontoTotalMes(:id_usuario);
                """
                ),
                {"id_usuario": id_usuario}
            )
            kpi = result.fetchone()
            
            if not kpi:
                raise ValueError("No se encontró el KPI")
            return kpi
        except Exception as e:
            logger.error(f"Error al obtener KPI Monto Total Mes: {str(e)}")
            raise ValueError(f"Error al obtener KPI Monto Total Mes: {str(e)}")
    
    def obtener_kpi_monto_total_producto_mes(self, id_usuario: int) -> List[RespuestaKPIPorProducto]:
        """ 
        Obtiene el KPI de monto total por producto y mes 
        Llama a la FN: fn_KPI_MontoPorProductoMes
        """
        try:
            result = self.db.execute(
                text("""
                SELECT codigo_subesp, monto_total 
                FROM dbo.fn_KPI_MontoPorProductoMes(:id_usuario);
                """),
                {"id_usuario": id_usuario}
            )
            kpi_rows = result.fetchall()
            
            kpi_list = [RespuestaKPIPorProducto.model_validate(row) for row in kpi_rows]
            return kpi_list
                
        except Exception as e:
            logger.error(f"Error al obtener KPI Monto Total Producto Mes: {str(e)}")
            raise ValueError(f"Error al obtener KPI Monto Total Producto Mes: {str(e)}")

    def obtener_kpi_monto_total_mes_unidad(self, id_unidad: int) -> RespuestaKPITotal:
        """ 
        Obtiene el KPI de monto total por mes y unidad 
        Llama a la FN: fn_KPI_MontoTotalMesUnidad
        """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_KPI_MontoTotalMes_PorUnidad(:id_unidad);
                """
                ),
                {"id_unidad": id_unidad}
            )
            kpi = result.fetchone()
            
            if not kpi:
                raise ValueError("No se encontró el KPI")
            return kpi
        except Exception as e:
            logger.error(f"Error al obtener KPI Monto Total Mes Unidad: {str(e)}")
            raise ValueError(f"Error al obtener KPI Monto Total Mes Unidad: {str(e)}")

    def obtener_kpi_monto_total_producto_mes_unidad(self, id_unidad: int) -> List[RespuestaKPIPorProducto]:
        """ 
        Obtiene el KPI de monto total por producto y mes 
        Llama a la FN: fn_KPI_MontoPorProductoMesUnidad
        """
        try:
            result = self.db.execute(
                text("""
                SELECT codigo_subesp, monto_total 
                FROM dbo.fn_KPI_MontoPorProductoMes_PorUnidad(:id_unidad);
                """),
                {"id_unidad": id_unidad}
            )
            kpi_rows = result.fetchall()
            
            kpi_list = [RespuestaKPIPorProducto.model_validate(row) for row in kpi_rows]
            return kpi_list
                
        except Exception as e:
            logger.error(f"Error al obtener KPI Monto Total Producto Mes Unidad: {str(e)}")
            raise ValueError(f"Error al obtener KPI Monto Total Producto Mes Unidad: {str(e)}")

    def obtener_kpi_conteo_plantilla(self, id_unidad: int) -> RespuestaKPITotal:
        """ 
        Obtiene el KPI de conteo de plantillas 
        Llama a la FN: fn_KPI_ConteoPlanillas
        """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT total_plantillas_cerradas, total_plantillas 
                    FROM fn_KPI_ConteoPlanillas(:id_unidad);
                """
                ),
                {"id_unidad": id_unidad}
            )
            kpi = result.fetchone()
            
            if not kpi:
                raise ValueError("No se encontró el KPI")
            return kpi
        except Exception as e:
            logger.error(f"Error al obtener KPI Conteo Plantilla: {str(e)}")
            raise ValueError(f"Error al obtener KPI Conteo Plantilla: {str(e)}")