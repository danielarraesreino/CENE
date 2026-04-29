"""
Testes para o app push — PushSubscription (subscribe/unsubscribe).
Agente E — Guarda de Testes.
"""
import pytest
from unittest.mock import patch
from model_bakery import baker
from push.models import PushSubscription

SUBSCRIBE_URL = "/api/push/subscribe/"
FAKE_ENDPOINT = "https://fcm.googleapis.com/fcm/send/fake-token-123"
FAKE_KEYS = {"p256dh": "fake-p256dh", "auth": "fake-auth"}


@pytest.mark.django_db
def test_subscribe_creates_subscription(auth_client, test_user):
    """POST com dados válidos cria uma PushSubscription."""
    payload = {"endpoint": FAKE_ENDPOINT, "keys": FAKE_KEYS}
    response = auth_client.post(SUBSCRIBE_URL, payload, format="json")
    assert response.status_code in (200, 201)
    assert PushSubscription.objects.filter(
        user=test_user, endpoint=FAKE_ENDPOINT, is_active=True
    ).exists()


@pytest.mark.django_db
def test_subscribe_duplicate_endpoint_does_not_create_second(auth_client, test_user):
    """
    POST para o mesmo endpoint deve usar update_or_create — sem duplicatas.
    """
    payload = {"endpoint": FAKE_ENDPOINT, "keys": FAKE_KEYS}
    auth_client.post(SUBSCRIBE_URL, payload, format="json")
    auth_client.post(SUBSCRIBE_URL, payload, format="json")
    assert PushSubscription.objects.filter(endpoint=FAKE_ENDPOINT).count() == 1


@pytest.mark.django_db
def test_subscribe_missing_endpoint_returns_400(auth_client):
    """POST sem endpoint deve retornar 400."""
    response = auth_client.post(SUBSCRIBE_URL, {"keys": FAKE_KEYS}, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_subscribe_missing_keys_returns_400(auth_client):
    """POST sem keys deve retornar 400."""
    response = auth_client.post(SUBSCRIBE_URL, {"endpoint": FAKE_ENDPOINT}, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_unsubscribe_soft_deletes(auth_client, test_user):
    """DELETE deve marcar is_active=False (soft delete), não remover o registro."""
    baker.make(
        PushSubscription,
        user=test_user,
        endpoint=FAKE_ENDPOINT,
        is_active=True,
    )
    response = auth_client.delete(
        SUBSCRIBE_URL, {"endpoint": FAKE_ENDPOINT}, format="json"
    )
    assert response.status_code == 204
    sub = PushSubscription.objects.get(endpoint=FAKE_ENDPOINT)
    assert sub.is_active is False


@pytest.mark.django_db
def test_push_unauthenticated_returns_401(api_client):
    """Endpoint de push sem autenticação retorna 401."""
    response = api_client.post(SUBSCRIBE_URL, {}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_webpush_exception_does_not_crash_signal(test_user):
    """
    WebPushException no signal de progresso não deve propagar
    e o LessonProgress deve ser salvo mesmo assim.
    (Integração com test_progress.py — teste isolado aqui do handler de push)
    """
    from push.utils import send_push_notification
    from unittest.mock import patch

    with patch("push.utils.webpush", side_effect=Exception("token expirado")):
        # send_push_notification não deve lançar exceção para o chamador
        try:
            send_push_notification(
                user=test_user,
                title="Teste",
                body="Mensagem de teste",
                url="/teste"
            )
        except Exception:
            pytest.fail("send_push_notification não deve propagar exceções de WebPush")
