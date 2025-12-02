from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional

from app.schema.pdf_schema import RespuestaUsuarioPdf, RespuestaAnticipoPdf, RespuestaViaticoPdf    

class PdfController:
    def __init__(self, db: Session):
        self.db = db
    
    def obtener_pdf_usuario(self, id_plantilla: int) -> list[RespuestaUsuarioPdf]:
        """ Genera un PDF """
        params = {
            "id_plantilla": id_plantilla
        }
        result = self.db.execute(
            text(
                """
                    SELECT * FROM fn_ListarUsuarioPDF(:id_plantilla);
                    """
                ),
                params
            )
        plantillas = result.fetchall()

        if not plantillas:
            raise ValueError(f"Plantilla con ID {id_plantilla} no encontrado")
        
        return plantillas   

    def obtener_pdf_anticipo(self, id_plantilla: int) -> list[RespuestaAnticipoPdf]:
        """ Genera un PDF """
        params = {
            "id_plantilla": id_plantilla
        }
        result = self.db.execute(
            text(
                """
                    SELECT * FROM fn_ListarAnticipoPDF(:id_plantilla);
                    """
                ),
                params
            )
        plantillas = result.fetchall()

        if not plantillas:
            raise ValueError(f"Plantilla con ID {id_plantilla} no encontrado")
        
        return plantillas

    def obtener_pdf_viatico(self, id_plantilla: int) -> list[RespuestaViaticoPdf]:
        """ Genera un PDF """
        params = {
            "id_plantilla": id_plantilla
        }
        result = self.db.execute(
            text(
                """
                    SELECT * FROM fn_ListarViaticoPDF(:id_plantilla);
                    """
                ),
                params
            )
        plantillas = result.fetchall()

        if not plantillas:
            raise ValueError(f"Plantilla con ID {id_plantilla} no encontrado")
        
        return plantillas