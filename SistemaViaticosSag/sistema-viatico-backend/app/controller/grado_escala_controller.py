from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional

from app.model.grado_escala_model import GradoEscala
from app.schema.grado_escala_schema import GradoEscalaCreate, ActualizarGradosEscalaRango, GradoEscalaResponse, RespuestaGradoEscala    

import logging

logger = logging.getLogger(__name__)
class GradoEscalaController:
    def __init__(self, db: Session):
        self.db = db
    
    def create_grado_escala(self, data: GradoEscalaCreate) -> GradoEscalaResponse:
        """ Crea un grado escala """
        try:
            result  = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CrearGradoEscala
                        @valor_porcentaje_100 = :valor_porcentaje_100,
                        @valor_porcentaje_60 = :valor_porcentaje_60,
                        @valor_porcentaje_50 = :valor_porcentaje_50,
                        @valor_porcentaje_40 = :valor_porcentaje_40,
                        @fecha_efectiva = :fecha_efectiva,
                        @fecha_vencimiento = :fecha_vencimiento,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {
                    "valor_porcentaje_100": data.valor_porcentaje_100,
                    "valor_porcentaje_60": data.valor_porcentaje_60,
                    "valor_porcentaje_50": data.valor_porcentaje_50,
                    "valor_porcentaje_40": data.valor_porcentaje_40,
                    "fecha_efectiva": data.fecha_efectiva,
                    "fecha_vencimiento": data.fecha_vencimiento,
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
            logger.info(f"Grado escala creado exitosamente con ID: {resultado}")
            
            return RespuestaGradoEscala(
                resultado=resultado,
                mensaje=mensaje,
            )
        except IntegrityError:
            raise ValueError("Ya existe un grado escala con los mismos valores")

    def actualizar_rango_grados_escala(self, data: ActualizarGradosEscalaRango) -> RespuestaGradoEscala:
        """ Actualiza un grado escala """
        try:
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarGradosEscalaRango
                        @id_inicio = :id_inicio,
                        @id_fin = :id_fin,
                        @valor_porcentaje_100 = :valor_porcentaje_100,
                        @valor_porcentaje_60 = :valor_porcentaje_60,
                        @valor_porcentaje_50 = :valor_porcentaje_50,
                        @valor_porcentaje_40 = :valor_porcentaje_40,
                        @fecha_efectiva = :fecha_efectiva,
                        @fecha_vencimiento = :fecha_vencimiento,
                        @resultado = @resultado OUTPUT,
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;
                    """
                ),
                {
                    "id_inicio": data.id_inicio,
                    "id_fin": data.id_fin,
                    "valor_porcentaje_100": data.valor_porcentaje_100,
                    "valor_porcentaje_60": data.valor_porcentaje_60,
                    "valor_porcentaje_50": data.valor_porcentaje_50,
                    "valor_porcentaje_40": data.valor_porcentaje_40,
                    "fecha_efectiva": data.fecha_efectiva,
                    "fecha_vencimiento": data.fecha_vencimiento,
                }
            )
            row = result.fetchone()
            resultado = row.resultado
            mensaje = row.mensaje

            if resultado < 1:
                self.db.rollback()
                logger.warning(f"Error de validación: {mensaje} (Código: {resultado})")
                raise ValueError(mensaje)
            
            self.db.commit()
            logger.info(f"Grado escala actualizado exitosamente con ID: {resultado}")
            
            return RespuestaGradoEscala(
                resultado=resultado,
                mensaje=mensaje,
            )
        except IntegrityError:
            raise ValueError("Ya existe un grado escala con los mismos valores")

    def eliminar_grado_escala(self, id_grado: int) -> None:
        """ Elimina un grado escala """
        grado_escala = self.db.query(GradoEscala).filter(GradoEscala.id_grado == id_grado).first()
        if not grado_escala:
            raise ValueError("Grado escala no encontrado")
        self.db.delete(grado_escala)   
        self.db.commit()   
    
    def obtener_grado_escala_por_id(self, id_grado: int) -> GradoEscalaResponse:
        """ Obtiene un grado escala por su id """
        grado_escala = self.db.query(GradoEscala).filter(GradoEscala.id_grado == id_grado).first()
        if not grado_escala:
            raise ValueError("Grado escala no encontrado")
        return grado_escala
    
    def obtener_grado_escala(self) -> List[GradoEscalaResponse]:
        """ Obtiene todos los grados escala """
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_ObtenerGradosEscalaS();
                    """
                )
            )
            grado_escala = result.fetchall()
            
            if not grado_escala:
                raise ValueError("No se encontraron grados escala")
            return grado_escala
        except Exception as e:
            raise ValueError(f"Error al obtener los grados escala: {str(e)}")