"""
Testes para o app progress — LessonProgress e signal de desbloqueio.
Agente E — Guarda de Testes.
"""
import pytest
from unittest.mock import patch
from django.utils import timezone
from model_bakery import baker
from content.models import Course, Module, Lesson
from progress.models import LessonProgress

# URL real conforme progress/urls.py
PROGRESS_URL = "/api/progress/lessons/"


@pytest.fixture
def lesson_setup(db):
    """Fixture: curso com 2 aulas sequenciais."""
    course = baker.make(Course, slug="curso-teste", status="published")
    mod = baker.make(Module, course=course, order=1)
    l1 = baker.make(Lesson, module=mod, title="Aula 1", order=1, unlock_strategy="immediate")
    l2 = baker.make(Lesson, module=mod, title="Aula 2", order=2, unlock_strategy="sequential")
    l2.prerequisites.add(l1)
    return {"course": course, "mod": mod, "l1": l1, "l2": l2}


@pytest.mark.django_db
def test_progress_create(auth_client, test_user, lesson_setup):
    """POST cria um LessonProgress (201)."""
    payload = {
        "lesson": lesson_setup["l1"].id,
        "course_slug": lesson_setup["course"].slug,
        "completed_at": timezone.now().isoformat(),
        "time_spent_seconds": 180,
    }
    response = auth_client.post(PROGRESS_URL, payload, format="json")
    assert response.status_code == 201
    assert LessonProgress.objects.filter(user=test_user, lesson=lesson_setup["l1"]).exists()


@pytest.mark.django_db
def test_progress_upsert_on_duplicate(auth_client, test_user, lesson_setup):
    """
    O serializer usa update_or_create — então um segundo POST para a
    mesma aula deve ATUALIZAR (201 ou 200) sem retornar 400.
    O registro deve existir apenas uma vez.
    """
    payload = {
        "lesson": lesson_setup["l1"].id,
        "course_slug": lesson_setup["course"].slug,
        "completed_at": timezone.now().isoformat(),
        "time_spent_seconds": 60,
    }
    auth_client.post(PROGRESS_URL, payload, format="json")
    response = auth_client.post(PROGRESS_URL, payload, format="json")

    # Deve ter sucesso (upsert)
    assert response.status_code in (200, 201)
    # Só deve existir UM registro (sem duplicata)
    assert LessonProgress.objects.filter(
        user=test_user, lesson=lesson_setup["l1"]
    ).count() == 1


@pytest.mark.django_db
def test_signal_fires_push_on_complete(test_user, lesson_setup):
    """
    Signal notify_next_lesson_unlock deve chamar send_push_notification
    quando uma aula é concluída e há uma próxima aula disponível.
    """
    with patch("progress.signals.send_push_notification") as mock_push:
        LessonProgress.objects.create(
            user=test_user,
            lesson=lesson_setup["l1"],
            course_slug=lesson_setup["course"].slug,
            completed_at=timezone.now(),
            time_spent_seconds=120,
        )
        mock_push.assert_called_once()
        call_kwargs = mock_push.call_args.kwargs
        assert call_kwargs["user"] == test_user
        assert "Desbloqueada" in call_kwargs["title"]


@pytest.mark.django_db
def test_signal_push_failure_does_not_abort_transaction(test_user, lesson_setup):
    """
    Se send_push_notification lançar exceção, o LessonProgress
    ainda deve ter sido criado (push não deve abortar a transação).
    """
    with patch("progress.signals.send_push_notification", side_effect=Exception("webpush error")):
        LessonProgress.objects.create(
            user=test_user,
            lesson=lesson_setup["l1"],
            course_slug=lesson_setup["course"].slug,
            completed_at=timezone.now(),
            time_spent_seconds=60,
        )
        assert LessonProgress.objects.filter(
            user=test_user, lesson=lesson_setup["l1"]
        ).exists()


@pytest.mark.django_db
def test_progress_unauthenticated_returns_401(api_client):
    """Usuário não autenticado não consegue registrar progresso."""
    assert api_client.post(PROGRESS_URL, {}, format="json").status_code == 401
