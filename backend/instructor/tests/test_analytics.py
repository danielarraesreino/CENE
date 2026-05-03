"""
Testes de Analytics do Instrutor — Reibb LMS.
Agente E (Testes) — Criado sob regime TDD (Test-Driven Development).
"""
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from model_bakery import baker
from django.utils import timezone
from content.models import Lesson, Course, Module
from clinical.models import MoodLog

User = get_user_model()


@pytest.fixture
def auth_client():
    client = APIClient()
    return client


@pytest.mark.django_db
class TestInstructorGlobalStats:
    def test_endpoint_requires_authentication(self, auth_client):
        """Não-autenticados não devem acessar o endpoint de stats."""
        response = auth_client.get('/api/instructor/stats/')
        assert response.status_code == 401

    def test_endpoint_requires_instructor_role(self, auth_client):
        """Apenas admin e supervisor podem acessar as stats globais."""
        paciente = baker.make(User, role='patient')
        auth_client.force_authenticate(user=paciente)

        response = auth_client.get('/api/instructor/stats/')
        assert response.status_code == 403

    def test_stats_return_expected_format_and_data(self, auth_client):
        """Testa se o retorno traz as chaves de estatísticas globais corretas."""
        # Setup: 1 Admin
        admin = baker.make(User, role='admin')
        auth_client.force_authenticate(user=admin)

        # Setup: 3 pacientes criados
        baker.make(User, role='patient', _quantity=3)
        baker.make(User, role='admin')  # não deve contar como paciente

        # Setup: 2 cursos e 5 aulas (para created_lessons)
        curso1 = baker.make(Course, status='published')
        mod1 = baker.make(Module, course=curso1)
        baker.make(Lesson, module=mod1, _quantity=5)

        # Setup: Logs de hoje (2) e de ontem (1)
        hoje = timezone.now()
        ontem = hoje - timezone.timedelta(days=1)
        
        paciente = User.objects.filter(role='patient').first()
        baker.make(MoodLog, user=paciente, timestamp=hoje, _quantity=2)
        baker.make(MoodLog, user=paciente, timestamp=ontem, _quantity=1)

        response = auth_client.get('/api/instructor/stats/')
        assert response.status_code == 200

        data = response.json()
        assert 'total_patients' in data
        assert 'active_trails' in data
        assert 'created_lessons' in data
        assert 'today_logs' in data

        assert data['total_patients'] == 3
        assert data['active_trails'] == 1  # curso publicado
        assert data['created_lessons'] == 5
        assert data['today_logs'] == 2  # Apenas os de hoje
