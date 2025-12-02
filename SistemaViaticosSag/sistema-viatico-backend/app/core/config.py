from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):  # ← Cambiar "Setting" a "Settings"
    # Configuración de la aplicación
    APP_NAME: str = "Sistema de Viáticos SAG"  # ← Agregar valores por defecto
    APP_DESCRIPTION: str = "API para gestionar viáticos de la SAG"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    OPENAPI_URL: str = "/api/v1/openapi.json"
    DOCS_URL: str = "/docs"
    REDOC_URL: str = "/redoc"
    
    # Configuración de la base de datos
    DB_HOST: str = "localhost"
    DB_NAME: str = "SistemaViaticos"
    DB_PORT: int = 5053
    DB_USER: str = "sa"
    DB_PASSWORD: str = "12_Sag_201"

    # Configuración de CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:4200"]

    # Configuración de Firebase
    FIREBASE_PROJECT_ID: str = "sag-viaticos"
    FIREBASE_PRIVATE_KEY_ID: str = "d05703277be7ef45f795dfab1b60d818069494ff"
    FIREBASE_PRIVATE_KEY: str = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWtB3hMxRtjKrK\nxQa6ZpftIZ9Z1onNJSO/iq1LmTppW1pgz+p+yJEZO9DTiEXkrTU1IkdBO925sas8\nNvyeka+H2+XD0tJgOs/maxuC8kX61PY5oQvayLB2AJWOJ6DaANbVtrarIIzhNIVa\n8esghvVuQDGPagKQhVFg53MLxe6ElbU4K1fio4VM6+zQ7ReXIoV/1WXvyvyzhjrL\nG4wEUzmGIxqy/YU+fsdg7W2iLIWfLCgydrnPc/bJIhZXGX2kvZYJCujI2/5BstPe\nMBvg1lUrErYm7NyP64h9Oe6E4Yj+d8+50N1Qi+FlWHaOPZ7+/6Mcwa3hxpFk0s/a\n8z5tq/mXAgMBAAECggEAJWZKrifPryWJuriHa4DjhhMNRwDwECQgDgWCGmEeo6ue\nGq8dEeiuHc8lmTNruWHSmubVsq9S+D3SrjKF3rlR8kCDzZCzxL9555FQwYaiWgcu\nvOsovXuoAWYopxKQGml7As9JEpYg9DnJ4QWzB3960TGtcGXu/G28tzyZ9bsMyVtY\n4JxahrNST57EXtrHbuk/sKTmVH/l7lUIJNNaf0xf5sjbRo/EEsYnLccre48GBEF9\nZuMxm+NFWSk0xMlaYE4lpcbMpEIGfqqwkGqM4ftmK1iMUuI0RPxPpmSKCEX4DVhm\n5LqpM0hrPVYYezNEMcRAfixrqPxvdXkZrxDlUd9pgQKBgQD3vCZtdUC4iEdTeI32\niAfpdAjzAp4pk6a7aTKkItyvpxas4KqjrL3JjAUHgzIXjVpWcszSStLP1jhx5lKW\nRLnqhzKXsu00KuU+5o3HKH3/9fok/YHBSjl4eB8/foNlaQ0LtjNjhTzSHMb1N4YV\npBlAMH8Sc9m77AgXxsNL1ZcQzwKBgQDd3dpUBhnxHq0e3sJfz2cQbrkY1m5t++1Y\naV21aRzbmwo64sKWKl7/Lb8b9/4pd16b68g2HV3ZtWlrb+wOzicOoD4pAvJQzQtP\n1GcC0DLV3Qpm7SyEDvdiqVaXxlKmeCpEWPkxuPlXRasHUcoHLdx4CZI37AoQzz+0\nfLfVHF7suQKBgGkyHws5z/rL+6WpOncmOl3apPYz9V9oUFOijxt9pkJ8bDeKy0rn\nTkvoRjZzcnDn2CV/aBQgK7aPm7ZZ/FXM5zl8oXIjS3Bsip4UHr4kJqTrGYZdk5y1\nXQQX1gULPtZwLlb7zoSDDlmWWLHGGwzTetlz/nGieiG/T4xxHXr1PsmnAoGADuAT\nBVMrZhkybkFtMtNLC7UAwAOQf9tGPIlD+SfFAYxRkUUm2r6Yg+9jQtLLvaf9NeMH\nF2m8ox4gpU1pvExiHf7sa/+Ak55Lxdxt06h14BTj36bDN09xkrHb1m07mWGxI8f7\nXTQTs6A+KU14iCaxA3NQ1GMFAb+De+xovucaDjECgYEAnPpj3yWUbkFRc0tAF9a6\nckN8hfqaf83ngGuzg9PUtb0NOyx8TEO+5Y9E706Sy5iPsCJdepIUqrxDhEbzODkJ\nCxubwXCiscj/rz36eIRAgEJXhXh2uMPnRXNtdaivq3SrALH/6poGLnP4yDlutNh4\nzRd+/+/xOOtiSnVu9n1nRAw=\n-----END PRIVATE KEY-----\n"
    FIREBASE_CLIENT_EMAIL: str = "firebase-adminsdk-fbsvc@sag-viaticos.iam.gserviceaccount.com"
    FIREBASE_CLIENT_ID: str = "105360333672958083703"
    FIREBASE_AUTH_URI: str = "https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI: str = "https://oauth2.googleapis.com/token"
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: str = "https://www.googleapis.com/oauth2/v1/certs"
    FIREBASE_CLIENT_X509_CERT_URL: str = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sag-viaticos.iam.gserviceaccount.com"
    
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod  # ← Agregar @classmethod
    def parse_origins(cls, v):
        """
        Permite que ALLOWED_ORIGINS se lea desde .env como
        - JSON: ["http://a","http://b"]
        - Cadena separada por comas: http://a,http://b
        """
        if isinstance(v, str):
            if v.startswith("["):
                import json
                return json.loads(v)
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def database_url(self) -> str:
        """ Construye la URL de la base de datos """
        return (
            f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            "?driver=ODBC+Driver+17+for+SQL+Server"
        )
    
    model_config = {"env_file": ".env"}  # ← Nueva sintaxis para Pydantic v2

# Instancia de la configuración
settings = Settings()