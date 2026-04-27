import logging

logger = logging.getLogger(__name__)

class AuthBridge:
    """
    Camada de compatibilidade que aceita tokens Firebase OU JWT Django
    durante a janela de migração (7-14 dias).
    """
    @staticmethod
    def authenticate(request):
        # 1. Tenta validar como JWT Django (novo padrão)
        # TODO: Implementar lógica de validação JWT do DRF SimpleJWT
        # from rest_framework_simplejwt.authentication import JWTAuthentication
        # jwt_authenticator = JWTAuthentication()
        # auth_tuple = jwt_authenticator.authenticate(request)
        # se auth_tuple não for None, retorna (user, {'needs_migration': False})
        
        # 2. Fallback: valida como Firebase Token (legado)
        # TODO: Implementar lógica de validação do Firebase Token
        # Se for válido:
        # return user, {'needs_migration': True}
        
        logger.info("AuthBridge: Validating token...")
        
        # Placeholder return para manter compatibilidade até implementação completa
        return None, None
