from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware  

from app.core.database import init_db, close_db, get_db
from app.core.config import settings

# Importar rutas
from app.api.v1.routes import region_route
from app.api.v1.routes import plantilla_route
from app.api.v1.routes import viatico_route
from app.api.v1.routes import gastos_reembolsables_route
from app.api.v1.routes import usuario_route
from app.api.v1.routes import unidad_route
from app.api.v1.routes import valor_viatico_route
from app.api.v1.routes import estado_plantilla_route
from app.api.v1.routes import tipo_gasto_route
from app.api.v1.routes import calidad_juridica_route
from app.api.v1.routes import auditoria_sistema_route
from app.api.v1.routes import grado_escala_route
from app.api.v1.routes import motivo_cometido_route
from app.api.v1.routes import producto_subesp_route
from app.api.v1.routes import programa_route
from app.api.v1.routes import cuenta_presupuestaria_route
from app.api.v1.routes import permiso_route
from app.api.v1.routes import anticipo_route
from app.api.v1.routes import pdf_route

# Configuración del ciclo de vida de la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Maneja el ciclo de vida de la aplicación.
    Se ejecuta al inicio y cierre de FastApi.
    """

    print("Inicializando Sistema de Viáticos SAG...")
    await init_db()
    print("Base de datos conectada.")
    
    yield
    
    print("Cerrando sistema de Viáticos SAG...")
    await close_db()
    print("Conexiones cerrada.")

app = FastAPI(
    title= settings.APP_NAME,
    description= settings.APP_DESCRIPTION,
    version= settings.APP_VERSION,
    openapi_url= settings.OPENAPI_URL,
    docs_url= settings.DOCS_URL,
    redoc_url= settings.REDOC_URL,
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","OPTIONS"],
    allow_headers=["*"],
)

# Incluir rutas del módulo PDF
app.include_router(
    pdf_route.router,
    prefix="/api/v1/pdf",
    tags=["pdf"]
)

# Incluir rutas del módulo Regiones
app.include_router(
    region_route.router, 
    prefix="/api/v1/regiones", 
    tags=["regiones"]
)

# Incluir rutas del módulo Plantillas
app.include_router(
    plantilla_route.router, 
    prefix="/api/v1/plantillas", 
    tags=["plantillas"]
)

# Incluir rutas del módulo Viáticos
app.include_router(
    viatico_route.router, 
    prefix="/api/v1/viaticos", 
    tags=["viaticos"]
)

# Incluir rutas del módulo Anticipos
app.include_router(
    anticipo_route.router,
    prefix="/api/v1/anticipos",
    tags=["anticipos"]
)

# Incluir rutas del módulo Gastos Reembolsables
app.include_router(
    gastos_reembolsables_route.router, 
    prefix="/api/v1/gastos_reembolsables", 
    tags=["gastos_reembolsables"]
)

app.include_router(
    usuario_route.router,
    prefix="/api/v1/usuarios",
    tags=["usuarios"]
)

app.include_router(
    valor_viatico_route.router,
    prefix="/api/v1/valor_viatico",
    tags=["valor_viatico"]
)

app.include_router(
    unidad_route.router,
    prefix="/api/v1/unidades",
    tags=["unidades"]
)

app.include_router(
    estado_plantilla_route.router,
    prefix="/api/v1/estado_plantilla",
    tags=["estado_plantilla"]
)

app.include_router(
    tipo_gasto_route.router,
    prefix="/api/v1/tipo_gasto",
    tags=["tipo_gasto"]
)

app.include_router(
    calidad_juridica_route.router,
    prefix="/api/v1/calidad_juridica",
    tags=["calidad_juridica"]
)

app.include_router(
    auditoria_sistema_route.router,
    prefix="/api/v1/auditorias_sistema",
    tags=["auditorias_sistema"]
)

app.include_router(
    grado_escala_route.router,
    prefix="/api/v1/grado_escala",
    tags=["grado_escala"]
)

app.include_router(
    motivo_cometido_route.router,
    prefix="/api/v1/motivo_cometido",
    tags=["motivo_cometido"]
)

app.include_router(
    producto_subesp_route.router,
    prefix="/api/v1/producto_subesp",
    tags=["producto_subesp"]
)

app.include_router(
    programa_route.router,
    prefix="/api/v1/programas",
    tags=["programas"]
)

app.include_router(
    cuenta_presupuestaria_route.router,
    prefix="/api/v1/cuenta_presupuestarias",
    tags=["cuenta_presupuestarias"]
)

app.include_router(
    permiso_route.router,
    prefix="/api/v1/permisos",
    tags=["permisos"]
)

# Ruta de health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sistema de Viáticos SAG",
        "version": "1.0.0"
    }

# Ruta raíz
@app.get("/")
async def root():
    return {
        "message": "Bienvenido al Sistema de Viáticos SAG",
        "docs": "/docs",
        "health": "/health"
    }

# Punto de entrada para desarrollo
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Solo para desarrollo
        log_level="info"
    )