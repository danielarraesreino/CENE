import logging
from django.http import JsonResponse
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)

class GlobalExceptionMiddleware:
    """
    Middleware global para garantir que falhas não tratadas (ex: erro 500 interno)
    não retornem uma página HTML, e sim um payload JSON compatível com a UI.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            # Identifica o tipo de erro para o log
            error_type = e.__class__.__name__
            logger.error(f"[{error_type}] Erro não tratado: {str(e)}", exc_info=True)
            
            response_data = {
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "type": error_type,
                    "message": "Ocorreu um erro interno no servidor. Nossa equipe técnica foi notificada."
                }
            }
            
            # Adiciona detalhes apenas em ambiente de desenvolvimento
            if settings.DEBUG:
                response_data["error"]["debug"] = {
                    "message": str(e),
                    "path": request.path,
                    "method": request.method
                }
                
            return JsonResponse(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserIdentifierMiddleware:
    """
    Middleware para injetar o header X-User-ID na resposta, 
    permitindo que o frontend identifique o usuário de forma determinística
    para lógica de Feature Flags (rollout por porcentagem).
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Usa o ID do usuário ou o e-mail como identificador
            user_id = str(request.user.id)
            response['X-User-ID'] = user_id
            
        return response
