from venv import logger
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, extract, text
from typing import List, Optional

from app.model.cuenta_presupuestaria_model import CuentaPresupuestaria
from app.schema.cuenta_presupuestaria_schema import RespuestaCuentaPresupuestaria, CuentaPresupuestariaCambiarEstado, CuentaPresupuestariaCreate, CuentaPresupuestariaUpdate, CuentaPresupuestariaResponse

class CuentaPresupuestariaController:
    def __init__(self, db: Session):
        self.db = db
    
    def create_cuenta_presupuestaria(self, data: CuentaPresupuestariaCreate) -> CuentaPresupuestariaResponse:
        """ Crea una cuenta presupuestaria """
        try:
            new_cuenta_presupuestaria = CuentaPresupuestaria(
                codigo_presupuestaria=data.codigo_presupuestaria,
                nombre_presupuestaria=data.nombre_presupuestaria,
                activo=data.activo
            )
            self.db.add(new_cuenta_presupuestaria)
            self.db.commit()
            return CuentaPresupuestariaResponse.from_orm(new_cuenta_presupuestaria)
        except IntegrityError:
            raise ValueError("Ya existe una cuenta presupuestaria con el mismo código o nombre")
        
    def actualizar_cuenta_presupuestaria(self, id_cuenta_presupuestaria: int, data: CuentaPresupuestariaUpdate) -> CuentaPresupuestariaResponse:
        """ 
        Actualiza una cuenta presupuestaria 
        """
        try:
            params = {
                "id_cuenta_presupuestaria": id_cuenta_presupuestaria,
                "codigo_presupuestaria": data.codigo_presupuestaria,
                "nombre_presupuestaria": data.nombre_presupuestaria,
                "activo": data.activo
            }
            
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarCuentasPresupuestarias
                        @id_cuenta_presupuestaria = :id_cuenta_presupuestaria,
                        @codigo_presupuestaria = :codigo_presupuestaria,
                        @nombre_presupuestaria = :nombre_presupuestaria,
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
                logger.info(f"Cuenta presupuestaria actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar cuenta presupuestaria: {mensaje}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            raise ValueError(str(e))
        
    def delete_cuenta_presupuestaria(self, id_cuenta_presupuestaria: int) -> None:
        """ Elimina una cuenta presupuestaria """
        cuenta_presupuestaria = self.db.query(CuentaPresupuestaria).filter(CuentaPresupuestaria.id_cuenta_presupuestaria == id_cuenta_presupuestaria).first()
        if not cuenta_presupuestaria:
            raise ValueError
    
        self.db.delete(cuenta_presupuestaria)
        self.db.commit()    

    def obtener_cuenta_presupuestaria(self) -> List[CuentaPresupuestariaResponse]:
        """ 
        Obtiene todas las cuentas presupuestarias 
        """
        try:
            result = self.db.execute(
                text("""
                    SELECT * FROM fn_ObtenerCuentasPresupuestarias();
                """)
            )
            cuentas_presupuestarias = result.fetchall()
            
            if not cuentas_presupuestarias:
                raise ValueError("No se encontraron cuentas presupuestarias")
            return cuentas_presupuestarias
        except Exception as e:
            raise ValueError(f"Error al obtener las cuentas presupuestarias: {str(e)}")

    def obtener_cuenta_presupuestaria_por_id(self, id_cuenta_presupuestaria: int) -> CuentaPresupuestariaResponse:
        """ Obtiene una cuenta presupuestaria por su ID """
        cuenta_presupuestaria = self.db.query(CuentaPresupuestaria).filter(CuentaPresupuestaria.id_cuenta_presupuestaria == id_cuenta_presupuestaria).first()
        if not cuenta_presupuestaria:
            raise ValueError("Cuenta presupuestaria no encontrada")
        return CuentaPresupuestariaResponse.from_orm(cuenta_presupuestaria)
    
    def cambiar_estado_cuenta_presupuestaria(self, id_cuenta_presupuestaria: int, data: CuentaPresupuestariaCambiarEstado) -> RespuestaCuentaPresupuestaria:
        """ Cambia el estado de una cuenta presupuestaria """
        try:
            result = self.db.execute(
                text("""
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarEstadoCuentaPresupuestaria 
                        @id_cuenta_presupuestaria = :id_cuenta_presupuestaria, 
                        @activo = :activo, 
                        @resultado = @resultado OUTPUT, 
                        @mensaje = @mensaje OUTPUT;

                    SELECT @resultado AS resultado, @mensaje AS mensaje;

                """), 
                {"id_cuenta_presupuestaria": id_cuenta_presupuestaria, "activo": data.activo}
            )

            cuenta_presupuestaria = result.fetchone()
            resultado = cuenta_presupuestaria.resultado
            mensaje = cuenta_presupuestaria.mensaje

            if resultado > 0:
                # Éxito: hacer commit
                self.db.commit()
                logger.info(f"Cuenta presupuestaria actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar cuenta presupuestaria: {mensaje}")
                return False, mensaje, None
                       
        except Exception as e:
            self.db.rollback()
            raise ValueError(str(e))
