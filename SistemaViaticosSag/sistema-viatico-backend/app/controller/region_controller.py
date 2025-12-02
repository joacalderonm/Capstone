from sqlalchemy.orm import Session
from app.model.region_model import Region
from app.schema.region_schema import RegionCreate, RegionUpdate

class RegionController:
    def __init__(self, db: Session):
        self.db = db

    def crear_region(self, data: RegionCreate):
        # Crear nueva región
        existing = self.db.query(Region).filter(Region.codigo_region == data.codigo_region.upper()).first()
        if existing:
            raise ValueError(f"Ya existe una región con el código '{data.codigo_region}'")
        
        try: 
            region = Region(
                codigo_region=data.codigo_region.upper(),
                nombre_region=data.nombre_region
            )
            self.db.add(region)
            self.db.commit()
            self.db.refresh(region)
            return region
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al crear la región: {str(e)}")

    def obtener_regiones(self):
        return self.db.query(Region).filter(Region.activo == True).all()

    def obtener_region(self, region_id: int):
        return self.db.query(Region).filter(Region.id_region == region_id).first()

    def actualizar_region(self, region_id: int, data: RegionUpdate):
        region = self.db.query(Region).filter(Region.id_region == region_id).first()
        if not region:
            return None
        
        try: 
            if data.codigo_region:
                region.codigo_region = data.codigo_region.upper()
            if data.nombre_region:
                region.nombre_region = data.nombre_region
            if data.activo is not None:
                region.activo = data.activo
            
            self.db.commit()
            self.db.refresh(region)
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al actualizar la región: {str(e)}")
        return region

    def obtener_region_para_editar(self, region_id: int):
        """
        Obtiene una región con todos sus datos actuales para formulario de edición.
        Incluye información adicional útil para el formulario.
        """
        region = self.db.query(Region).filter(Region.id_region == region_id).first()
        
        if not region:
            raise ValueError(f"Región con ID {region_id} no encontrada")    
        
        return region

    def eliminar_region(self, region_id: int):
        region = self.db.query(Region).filter(Region.id_region == region_id).first()
        if not region:
            return False
        
        try: 
            region.activo = False
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error al eliminar la región: {str(e)}")