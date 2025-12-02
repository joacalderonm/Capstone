from venv import logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, text
from typing import List, Optional

from app.model.producto_subesp_model import ProductoSubesp
from app.schema.producto_subesp_schema import ProductoSubespCambiarEstado, ProductoSubespCreate, ProductoSubespUpdate, ProductoSubespResponse, RespuestaProductoSubesp

class ProductoSubespController:

    def __init__(self, db: Session):
        self.db = db

    def create_producto_subesp(self, data: ProductoSubespCreate) -> ProductoSubespResponse:
        """Crea un producto subespecifica"""
        try:
            new_producto = ProductoSubesp(
                codigo_subesp= data.codigo_subesp,
                descripcion = data.descripcion
            )
            self.db.add(new_producto)
            self.db.commit()
            self.db.refresh(new_producto)
            return new_producto

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Error al crear el producto subespecifica: {str(e)}")
        
    
    def obtener_productos_subesp(self) -> List[ProductoSubespResponse]:
        """ Obtiene todas los productos subespecifica"""
        try:
            result = self.db.execute(
                text(
                    """
                    SELECT * FROM fn_ListarProductosSubesp();
                    """
                )
            )
            productos_subespecificos = result.fetchall()
            
            if not productos_subespecificos:
                raise ValueError("No se encontraron productos subespecificos")
            return productos_subespecificos
        except Exception as e:
            raise ValueError(f"Error al obtener los productos subespecificos: {str(e)}")

    def obtener_producto_subesp_por_id(self, id_producto: int) -> ProductoSubespResponse:
        """ Obtiene un producto subespecifica por su id"""
        producto = self.db.query(ProductoSubesp).filter(ProductoSubesp.id_producto_subesp == id_producto).first()
        if not producto:
            raise ValueError("Producto subespecifica no encontrado")
        return producto

    def actualizar_producto_subesp(self, id_producto: int, data: ProductoSubespUpdate) -> RespuestaProductoSubesp:
        """ Actualiza un producto subespecifica """
        try:
            params = {
                "id_producto_subesp": id_producto,
                "codigo_subesp": data.codigo_subesp,
                "descripcion": data.descripcion,
                "activo": data.activo
            }
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_ActualizarProductoSubesp
                        @id_producto_subesp = :id_producto_subesp,
                        @codigo_subesp = :codigo_subesp,
                        @descripcion = :descripcion,
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
                logger.info(f"Producto subespecifica actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar producto subespecifica: {mensaje}")
                return False, mensaje, None

        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al actualizar el producto subespecifica: {str(e)}")    
    
    def cambiar_estado_producto_subesp(self, id_producto_subesp: int, data: ProductoSubespCambiarEstado) -> RespuestaProductoSubesp:
        """ Cambia el estado de un producto subespecifica """
        try:
            params = {
                "id_producto_subesp": id_producto_subesp,
                "activo": data.activo
            }
            
            result = self.db.execute(
                text(
                    """
                    DECLARE @resultado INT, @mensaje NVARCHAR(500);

                    EXEC sp_CambiarEstadoProductoSubesp
                        @id_producto_subesp = :id_producto_subesp,
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
                logger.info(f"Producto subespecifica actualizada exitosamente con ID: {resultado}")
                return True, mensaje, resultado
            else:
                # Error: hacer rollback
                self.db.rollback()
                logger.error(f"Error al actualizar producto subespecifica: {mensaje}")
                return False, mensaje, None
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al cambiar el estado del producto subespecifica: {str(e)}")