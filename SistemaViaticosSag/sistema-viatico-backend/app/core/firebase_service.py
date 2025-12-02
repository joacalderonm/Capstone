import firebase_admin
from firebase_admin import auth, credentials
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self._initialize_firebase_app()

    def _initialize_firebase_app(self):
        """Inicializa la aplicación Firebase con las credenciales de service account"""
        try:
            # Verificar si ya está inicializada
            firebase_admin.get_app()
        except ValueError:
            # Crear credenciales desde las variables de entorno
            service_account_info = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "client_id": settings.FIREBASE_CLIENT_ID,
                "auth_uri": settings.FIREBASE_AUTH_URI,
                "token_uri": settings.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": settings.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL
            }

            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase app initialized successfully")

    def create_user(self, email: str, password: str) -> str:
        """
        Crea un usuario en Firebase Auth
        Retorna el UID del usuario creado
        """
        try:
            user = auth.create_user(
                email=email,
                password=password
            )
            logger.info(f"Usuario creado en Firebase Auth: {user.uid}")
            return user.uid
        except Exception as e:
            logger.error(f"Error creando usuario en Firebase: {str(e)}")
            raise e

    def set_custom_claims(self, uid: str, claims: dict):
        """
        Asigna custom claims a un usuario
        """
        try:
            auth.set_custom_user_claims(uid, claims)
            logger.info(f"Custom claims asignados al usuario {uid}: {claims}")
        except Exception as e:
            logger.error(f"Error asignando custom claims: {str(e)}")
            raise e

    def delete_user(self, uid: str):
        """
        Elimina un usuario de Firebase Auth
        """
        try:
            auth.delete_user(uid)
            logger.info(f"Usuario eliminado de Firebase Auth: {uid}")
        except Exception as e:
            logger.error(f"Error eliminando usuario de Firebase: {str(e)}")
            raise e

# Instancia singleton del servicio
firebase_service = FirebaseService()