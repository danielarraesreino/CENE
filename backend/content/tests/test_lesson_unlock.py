import pytest
from django.utils import timezone
from datetime import timedelta
from content.models import Course, Module, Lesson
from progress.models import LessonProgress
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username="testuser", email="test@reibb.dev", password="password123")

@pytest.mark.django_db
def test_sequential_unlock_blocks_access(user, api_client):
    course = Course.objects.create(title="Test", slug="test-course", status="published")
    mod = Module.objects.create(course=course, title="Module 1")
    l1 = Lesson.objects.create(module=mod, title="Aula 1", order=1)
    l2 = Lesson.objects.create(module=mod, title="Aula 2", order=2, unlock_strategy="sequential")
    l2.prerequisites.add(l1)

    # Tenta acessar Aula 2 sem concluir Aula 1
    url = f"/api/content/lessons/{l2.id}/"
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 403

@pytest.mark.django_db
def test_date_based_unlock_respects_release_date(user, api_client):
    course = Course.objects.create(title="Test", slug="test-course-date", status="published")
    mod = Module.objects.create(course=course, title="Module 1")
    l1 = Lesson.objects.create(
        module=mod, 
        title="Aula Futura",
        unlock_strategy="date", 
        release_date=timezone.now() + timedelta(days=5)
    )
    url = f"/api/content/lessons/{l1.id}/"
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 403

@pytest.mark.django_db
def test_unlock_after_prerequisite_completion(user, api_client):
    course = Course.objects.create(title="Test", slug="test-course-unlock", status="published")
    mod = Module.objects.create(course=course, title="Module 1")
    l1 = Lesson.objects.create(module=mod, title="Aula 1", order=1)
    l2 = Lesson.objects.create(module=mod, title="Aula 2", order=2, unlock_strategy="sequential")
    l2.prerequisites.add(l1)
    
    # Marca Aula 1 como concluída
    LessonProgress.objects.create(user=user, lesson=l1, course_slug=course.slug, completed_at=timezone.now())
    
    url = f"/api/content/lessons/{l2.id}/"
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.data["is_unlocked"] is True
