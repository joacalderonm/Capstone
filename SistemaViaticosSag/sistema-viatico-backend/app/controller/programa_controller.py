from venv import logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, text
from typing import List, Optional
from datetime import datetime

from app.model.programa_model import Programa
from app.schema.programa_schema import ProgramaCambiarEstado, ProgramaCreate, ProgramaUpdate, ProgramaResponse, RespuestaPrograma

class ProgramaController:
    
    def __init__(self, db: Session):
        self.db = db

    def create_programa(self, data: ProgramaCreate) -> ProgramaResponse:
        """Crea un programa"""
        try:
            new_programa = Programa(
                codigo_programa= data.codigo_programa,
                nombre_programa = data.nombre_programa
            )
            self.db.add(new_programa)
            self.db.commit()
            self.db.refresh(new_programa)
            return new_programa

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Error al crear el programa: {str(e)}")
        
    
    def obtener_programas(self) -> List[ProgramaResponse]:
        """ Obtiene todas los programas"""
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_ListarProgramas()
                    """
                )
            )
            
            programa = result.fetchall()

            if not programa:
                raise ValueError("No se encontraron programas")
            return programa
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al obtener los programas: {str(e)}")

    def obtener_programa_por_id(self, id_programa: int) -> ProgramaResponse:
        """ Obtiene un programa por su id"""
        programa = self.db.query(Programa).filter(Programa.id_programa == id_programa).first()
        if not programa:
            raise ValueError("Programa no encontrado")
        return programa

    def actualizar_programa(self, id_programa: int, data: ProgramaUpdate) -> ProgramaResponse:
        """ Actualiza un programa """
        try:
            params = {
                "id_programa": id_programa,
                "codigo_programa": data.codigo_programa,
                "nombre_programa": data.nombre_programa,
                "activo": data.activo
            }

            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarPrograma
                        @id_programa = :id_programa,
                        @codigo_programa = :codigo_programa,
                        @nombre_programa = :nombre_programa,
                        @activo = :activo,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                params
            )
            programa = result.fetchone()
            resultado = programa.resultado
            mensaje = programa.mensaje

            if resultado > 0:
                self.db.commit()
                logger.info(f"Programa actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                self.db.rollback()
                logger.info(f"Programa no actualizado exitosamente con ID: {resultado}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al actualizar el programa: {str(e)}")

    def cambiar_estado_programa(self, id_programa: int, data:ProgramaCambiarEstado) -> RespuestaPrograma:
        """
        Cambia el estado de un programa
        """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarEstadoPrograma
                        @id_programa = :id_programa,
                        @activo = :activo,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {"id_programa": id_programa,
                "activo": data.activo}
            )
            programa = result.fetchone()
            resultado = programa.resultado
            mensaje = programa.mensaje

            if resultado > 0:
                self.db.commit()
                logger.info(f"Programa actualizado exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                self.db.rollback()
                logger.info(f"Programa no actualizado exitosamente con ID: {resultado}")
                return False, mensaje, None

        except Exception as e:
            self.db.rollback()
            return False, str(e), None