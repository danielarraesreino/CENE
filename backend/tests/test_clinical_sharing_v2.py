import pytest
from django.urls import reverse
from lms.models import User, PsychologistLink
from clinical.models import MoodLog
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def supervisor():
    user = User.objects.create(username="matheus", role="supervisor")
    user.set_password("password")
    user.save()
    return user

@pytest.fixture
def psychologist(supervisor):
    user = User.objects.create(username="psy1", role="psychologist", supervisor=supervisor)
    user.set_password("password")
    user.save()
    return user

@pytest.fixture
def patient():
    user = User.objects.create(username="patient1", role="patient")
    user.set_password("password")
    user.save()
    return user

@pytest.fixture
def mood_log(patient):
    return MoodLog.objects.create(user=patient, mood=8)

@pytest.mark.django_db
def test_psychologist_can_see_linked_patient_data(api_client, psychologist, patient, mood_log):
    # Link patient to psychologist
    PsychologistLink.objects.create(patient=patient, psychologist=psychologist)
    
    api_client.force_authenticate(user=psychologist)
    url = reverse('mood-list')
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['mood'] == 8

@pytest.mark.django_db
def test_supervisor_can_see_team_patient_data(api_client, supervisor, psychologist, patient, mood_log):
    # Link patient to psychologist (who is supervised by Matheus)
    PsychologistLink.objects.create(patient=patient, psychologist=psychologist)
    
    api_client.force_authenticate(user=supervisor)
    url = reverse('mood-list')
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1

@pytest.mark.django_db
def test_random_psychologist_cannot_see_patient_data(api_client, patient, mood_log):
    other_psy = User.objects.create(username="other", role="psychologist")
    api_client.force_authenticate(user=other_psy)
    
    url = reverse('mood-list')
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert len(response.data['results']) == 0
