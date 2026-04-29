"""
Testes para o app clinical — RPD, Metas, Gatilhos, SafetyPlan.
Agente E — Guarda de Testes.
"""
import pytest
from model_bakery import baker
from clinical.models import RPD, TriggerLog, Goal, SafetyPlan, MoodLog

RPD_URL = "/api/clinical/rpd/"           # router usa 'rpd', não 'rpds'
TRIGGER_URL = "/api/clinical/triggers/"
GOAL_URL = "/api/clinical/goals/"
SAFETY_URL = "/api/clinical/safety-plan/"

# Payload mínimo válido para RPD (campos obrigatórios com tipos corretos)
VALID_RPD_PAYLOAD = {
    "situacao": "Discussão com colega",
    "pensamento_automatico": "Nunca faço nada certo",
    "emocoes_iniciais": [{"emocao": "tristeza", "intensidade": 8}],
    "distorcoes_cognitivas": ["pensamento_tudo_ou_nada"],
    "resposta_alternativa": "Errei, mas posso melhorar",
    "emocoes_finais": [{"emocao": "alívio", "intensidade": 3}],
    "grau_crenca_inicial": 90,
    "grau_crenca_final": 40,
}


# ─── RPD ──────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
def test_rpd_create(auth_client, test_user):
    """POST cria um RPD associado ao usuário."""
    response = auth_client.post(RPD_URL, VALID_RPD_PAYLOAD, format="json")
    assert response.status_code == 201
    assert RPD.objects.filter(user=test_user).count() == 1


@pytest.mark.django_db
def test_rpd_soft_delete_not_listed(auth_client, test_user):
    """RPD com is_deleted=True não aparece na listagem."""
    # Cria usando o endpoint para contornar EncryptedField + baker
    auth_client.post(RPD_URL, {**VALID_RPD_PAYLOAD, "is_deleted": True}, format="json")
    auth_client.post(RPD_URL, {**VALID_RPD_PAYLOAD}, format="json")

    # Força is_deleted=True no primeiro RPD diretamente via ORM
    first_rpd = RPD.objects.filter(user=test_user).order_by("id").first()
    first_rpd.is_deleted = True
    first_rpd.save(update_fields=["is_deleted"])

    response = auth_client.get(RPD_URL)
    assert response.status_code == 200
    data = response.data.get("results") or response.data
    # Apenas o RPD não deletado deve aparecer
    assert len(data) == 1


@pytest.mark.django_db
def test_rpd_list_only_own(auth_client, test_user):
    """RPD de outro usuário não aparece na listagem."""
    from django.contrib.auth import get_user_model
    from rest_framework.test import APIClient
    User = get_user_model()
    other = User.objects.create_user(username="other_rpd", password="test", email="other_rpd@test.com")
    other_client = APIClient()
    other_client.force_authenticate(user=other)

    auth_client.post(RPD_URL, VALID_RPD_PAYLOAD, format="json")
    other_client.post(RPD_URL, VALID_RPD_PAYLOAD, format="json")

    response = auth_client.get(RPD_URL)
    data = response.data.get("results") or response.data
    assert len(data) == 1
    assert RPD.objects.get(id=data[0]["id"]).user == test_user


# ─── SafetyPlan ───────────────────────────────────────────────────────────────

@pytest.mark.django_db
def test_safety_plan_upsert(auth_client, test_user):
    """POST no safety-plan deve usar update_or_create — sem duplicatas."""
    payload = {
        "warning_signs": ["ansiedade"],
        "coping_strategies": ["respiração profunda"],
        "social_contacts": [],
        "professionals": [],
        "safe_places": ["Casa do irmão"],
        "reasons_to_live": ["minha família"],
    }
    auth_client.post(SAFETY_URL, payload, format="json")
    auth_client.post(SAFETY_URL, payload, format="json")
    assert SafetyPlan.objects.filter(user=test_user).count() == 1


# ─── TriggerLog ───────────────────────────────────────────────────────────────

@pytest.mark.django_db
def test_trigger_create(auth_client, test_user):
    """POST cria um gatilho para o usuário autenticado."""
    payload = {
        "gatilho": "Ver ex no Instagram",
        "intensidade_impulso": 7,
        "tecnica_utilizada": "respiração",
        "sucesso": True,
    }
    response = auth_client.post(TRIGGER_URL, payload, format="json")
    assert response.status_code == 201
    assert TriggerLog.objects.filter(user=test_user).count() == 1


# ─── Goal ─────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
def test_goal_create_and_list(auth_client, test_user):
    """POST cria meta, GET lista apenas metas do usuário."""
    from django.contrib.auth import get_user_model
    from rest_framework.test import APIClient
    User = get_user_model()
    other = User.objects.create_user(username="other_goal", password="test", email="other_goal@test.com")
    other_client = APIClient()
    other_client.force_authenticate(user=other)

    goal_payload = {
        "title": "Minha meta",
        "category": "Saude",
    }
    auth_client.post(GOAL_URL, goal_payload, format="json")
    other_client.post(GOAL_URL, goal_payload, format="json")

    response = auth_client.get(GOAL_URL)
    data = response.data.get("results") or response.data
    assert all(Goal.objects.get(id=g["id"]).user == test_user for g in data)


@pytest.mark.django_db
def test_clinical_unauthenticated_returns_401(api_client):
    """Endpoint clínico sem autenticação retorna 401."""
    assert api_client.get(RPD_URL).status_code == 401
