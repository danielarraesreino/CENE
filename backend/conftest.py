import pytest
import base64
import secrets
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from model_bakery import baker

User = get_user_model()

# Chave AES de teste (32 bytes aleatórios em base64) — usada por todos os testes clínicos
TEST_CLINICAL_KEY = base64.b64encode(secrets.token_bytes(32)).decode()


@pytest.fixture(autouse=True)
def set_clinical_key(settings):
    """Garante que CLINICAL_ENCRYPTION_KEY esteja definida em todos os testes."""
    settings.CLINICAL_ENCRYPTION_KEY = TEST_CLINICAL_KEY


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(db):
    return baker.make(User, username='testuser')


@pytest.fixture
def auth_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client
