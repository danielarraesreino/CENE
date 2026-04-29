import json
import logging
from pywebpush import webpush, WebPushException
from django.conf import settings
from .models import PushSubscription

logger = logging.getLogger('reibb.push')

def send_push_notification(user, title, body, url="/", tag="reibb-default"):
    """
    Envia uma notificação push para todas as subscrições ativas de um usuário.
    """
    subscriptions = PushSubscription.objects.filter(user=user, is_active=True)
    payload = json.dumps({
        "title": title,
        "body": body,
        "icon": "/icons/icon-192x192.png",
        "data": {"url": url, "tag": tag}
    })
    
    success_count = 0
    for sub in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth}
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": f"mailto:{settings.VAPID_ADMIN_EMAIL}"},
                ttl=600
            )
            success_count += 1
        except WebPushException as e:
            if e.response is not None and e.response.status_code in [404, 410]:
                sub.is_active = False
                sub.save(update_fields=['is_active'])
                logger.warning(f"Push token expirado para {user.username}: {e}")
            else:
                logger.error(f"Falha ao enviar push para {user.username}: {e}")
        except Exception as e:
            logger.error(f"Erro inesperado no envio de push: {e}")
            
    return success_count
