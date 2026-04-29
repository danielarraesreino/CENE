import pytest
from django.utils import timezone
from datetime import timedelta
from content.models import Course, Module, Lesson
from progress.models import LessonProgress
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def course_setup(db):
    course = Course.objects.create(title="Teste Conselheiro", slug="teste-conselheiro", status="published")
    mod = Module.objects.create(course=course, title="Módulo 1", order=1)
    l1 = Lesson.objects.create(module=mod, title="Aula 1", order=1, unlock_strategy="immediate")
    l2 = Lesson.objects.create(module=mod, title="Aula 2", order=2, unlock_strategy="sequential")
    l2.prerequisites.add(l1)
    return {"course": course, "mod": mod, "l1": l1, "l2": l2}

@pytest.mark.django_db
def test_sequential_blocks_access_without_prereq(api_client, course_setup):
    user = User.objects.create_user(username="aluno", password="test", email="aluno@reibb.dev")
    api_client.force_authenticate(user=user)
    response = api_client.get(f"/api/content/lessons/{course_setup['l2'].id}/")
    assert response.status_code == 403

@pytest.mark.django_db
def test_date_blocks_access_before_release(api_client, course_setup):
    user = User.objects.create_user(username="aluno2", password="test", email="aluno2@reibb.dev")
    api_client.force_authenticate(user=user)
    l_future = course_setup["mod"].lessons.create(
        title="Aula Futura", order=3, unlock_strategy="date", release_date=timezone.now() + timedelta(days=5)
    )
    response = api_client.get(f"/api/content/lessons/{l_future.id}/")
    assert response.status_code == 403

@pytest.mark.django_db
def test_unlocks_after_completion(api_client, course_setup):
    user = User.objects.create_user(username="aluno3", password="test", email="aluno3@reibb.dev")
    api_client.force_authenticate(user=user)
    LessonProgress.objects.create(
        user=user, 
        lesson=course_setup["l1"], 
        course_slug=course_setup["course"].slug,
        completed_at=timezone.now(), 
        time_spent_seconds=120
    )
    response = api_client.get(f"/api/content/lessons/{course_setup['l2'].id}/")
    assert response.status_code == 200
    assert response.data["is_unlocked"] is True

@pytest.mark.django_db
def test_staff_bypasses_restrictions(api_client, course_setup):
    staff = User.objects.create_user(username="instrutor", password="test", is_staff=True, email="staff@reibb.dev")
    api_client.force_authenticate(user=staff)
    response = api_client.get(f"/api/content/lessons/{course_setup['l2'].id}/")
    assert response.status_code == 200
