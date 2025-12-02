# app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Construir URL de conexión para SQL Server
DATABASE_URL = (
    f"mssql+pyodbc://{settings.DB_USER}:{settings.DB_PASSWORD}@"
    f"{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}?"
    f"driver=ODBC+Driver+17+for+SQL+Server"
)

# Crear engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Cambiar a False en producción
    pool_pre_ping=True,
    pool_recycle=300
)

# Crear SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()


# Funciones de ciclo de vida
async def init_db():
    """Inicializa la base de datos"""
    print("✅ SQLAlchemy conectado a SQL Server")


async def close_db():
    """Cierra conexiones"""
    engine.dispose()
    print("✅ Conexiones SQLAlchemy cerradas")


def get_db():
    """Dependency para obtener sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()