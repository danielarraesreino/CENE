import pytest
from django.urls import reverse
from lms.models import TrailProgress

@pytest.mark.django_db
def test_get_me(auth_client, test_user):
    url = reverse('users-me')
    response = auth_client.get(url)
    assert response.status_code == 200
    assert response.data['username'] == test_user.username

@pytest.mark.django_db
def test_sync_progress(auth_client, test_user):
    url = reverse('trails-sync-progress')
    data = {
        'trails': [
            {
                'id': 1,
                'isUnlocked': True,
                'status': 'completed',
                'progress': {'ouvir': True, 'estudar': True, 'avaliar': True}
            }
        ]
    }
    response = auth_client.post(url, data, format='json')
    assert response.status_code == 200
    assert response.data['status'] == 'synced'
    assert response.data['count'] == 1
    
    progress = TrailProgress.objects.get(user=test_user, trail_id=1)
    assert progress.status == 'completed'
    assert progress.ouvir is True
