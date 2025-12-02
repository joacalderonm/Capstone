from venv import logger
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional

from app.model.motivo_cometido_model import MotivoCometido
from app.schema.motivo_cometido_schema import MotivoCometidoCambiarEstado, MotivoCometidoCreate, MotivoCometidoUpdate, MotivoCometidoResponse, RespuestaMotivoCometido    

class MotivoCometidoController:
    def __init__(self, db: Session):
        self.db = db
    
    def create_motivo_cometido(self, data: MotivoCometidoCreate) -> MotivoCometidoResponse:
        """ Crea un motivo cometido """
        try:
            new_motivo_cometido = MotivoCometido(
                nombre_cometido=data.nombre_cometido,
                descripcion_cometido=data.descripcion_cometido
            )
            self.db.add(new_motivo_cometido)
            self.db.commit()
            return MotivoCometidoResponse.from_orm(new_motivo_cometido)
        except IntegrityError:
            raise ValueError("Ya existe un motivo cometido con el mismo nombre")
    
    def actualizar_motivo_cometido(self, id_motivo_cometido: int, data: MotivoCometidoUpdate) -> MotivoCometidoResponse:
        """ Actualiza un motivo cometido """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarMotivosCometidos
                        @id_motivo_cometido = :id_motivo_cometido,
                        @nombre_cometido = :nombre_cometido,
                        @descripcion_cometido = :descripcion_cometido,
                        @activo  = :activo,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {"id_motivo_cometido": id_motivo_cometido,
                "nombre_cometido": data.nombre_cometido,
                "activo": data.activo,
                "descripcion_cometido": data.descripcion_cometido}
            )
            motivo_cometido = result.fetchone()
            resultado = motivo_cometido.resultado
            mensaje = motivo_cometido.mensaje

            if resultado > 0:
                self.db.commit()
                logger.info(f"Motivo cometido actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                self.db.rollback()
                logger.info(f"Motivo cometido no actualizado exitosamente con ID: {resultado}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al actualizar el motivo cometido: {str(e)}")    
    
    def cambiar_estado_motivo_cometido(self, id_motivo_cometido: int, data: MotivoCometidoCambiarEstado) -> RespuestaMotivoCometido:
        """ Cambia el estado de un motivo cometido """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);
 
                    EXEC sp_CambiarEstadoMotivosCometidos
                        @id_motivo_cometido = :id_motivo_cometido,
                        @activo = :activo,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;
 
                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {"id_motivo_cometido": id_motivo_cometido, 
                "activo": data.activo}
            )
            motivo_cometido = result.fetchone()
            resultado = motivo_cometido.resultado
            mensaje = motivo_cometido.mensaje

            if resultado > 0:
                self.db.commit()
                logger.info(f"Motivo cometido actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                self.db.rollback()
                logger.info(f"Motivo cometido no actualizado exitosamente con ID: {resultado}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al cambiar el estado del motivo cometido: {str(e)}")
    
    def obtener_motivo_cometido_por_id(self, id_motivo: int) -> MotivoCometidoResponse:
        """ Obtiene un motivo cometido por su id """
        motivo_cometido = self.db.query(MotivoCometido).filter(MotivoCometido.id_motivo_cometido == id_motivo).first()
        if not motivo_cometido:
            raise ValueError("Motivo cometido no encontrado")
        return MotivoCometidoResponse.from_orm(motivo_cometido)
    
    def listar_motivos_cometido(self) -> List[MotivoCometidoResponse]:
        """ Lista todos los motivos cometido """
        try:
            result = self.db.execute(
                text("""
                    SELECT * FROM fn_ObtenerMotivosCometidos();
                """)
            )
            motivo_cometido = result.fetchall()
            
            if not motivo_cometido:
                raise ValueError("No se encontraron motivos cometido")
            return motivo_cometido
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al obtener los motivos cometido: {str(e)}")