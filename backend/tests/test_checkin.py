"""
Testes para o app checkin — DailyCheckIn CRUD.
Agente E — Guarda de Testes.
"""
import pytest
from model_bakery import baker
from checkin.models import DailyCheckIn

CHECKIN_URL = "/api/checkin/"


@pytest.mark.django_db
def test_checkin_post_creates_record(auth_client, test_user):
    """POST válido cria um registro de check-in para o usuário."""
    payload = {
        "craving_level": 3,
        "mood": "good",
        "trigger": "estresse no trabalho",
        "areas": {"fisica": 70, "social": 55, "emocional": 60},
    }
    response = auth_client.post(CHECKIN_URL, payload, format="json")
    assert response.status_code == 201
    assert DailyCheckIn.objects.filter(user=test_user).count() == 1
    assert response.data["craving_level"] == 3
    assert response.data["mood"] == "good"


@pytest.mark.django_db
def test_checkin_duplicate_date_returns_400(auth_client, test_user):
    """Segundo check-in no mesmo dia deve falhar (unique_together)."""
    # Cria o primeiro via model_bakery diretamente
    baker.make(DailyCheckIn, user=test_user)
    payload = {
        "craving_level": 5,
        "mood": "neutral",
        "trigger": "",
        "areas": {},
    }
    response = auth_client.post(CHECKIN_URL, payload, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_checkin_list_only_own_records(auth_client, test_user):
    """GET deve retornar apenas check-ins do usuário autenticado."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    other_user = baker.make(User)
    baker.make(DailyCheckIn, user=test_user)
    baker.make(DailyCheckIn, user=other_user)

    response = auth_client.get(CHECKIN_URL)
    assert response.status_code == 200
    ids = [item["id"] for item in (response.data.get("results") or response.data)]
    assert all(
        DailyCheckIn.objects.get(id=i).user == test_user for i in ids
    )


@pytest.mark.django_db
def test_checkin_unauthenticated_returns_401(api_client):
    """Usuário não autenticado deve receber 401."""
    response = api_client.get(CHECKIN_URL)
    assert response.status_code == 401
