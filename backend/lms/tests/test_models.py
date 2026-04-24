import pytest
from lms.models import TrailProgress
from model_bakery import baker

@pytest.mark.django_db
def test_trail_progress_creation(test_user):
    progress = baker.make(TrailProgress, user=test_user, trail_id=1, status='in_progress')
    assert progress.trail_id == 1
    assert progress.user == test_user
    assert str(progress) == f"Trail 1 - {test_user.username}"

@pytest.mark.django_db
def test_trail_progress_unique_together(test_user):
    baker.make(TrailProgress, user=test_user, trail_id=1)
    with pytest.raises(Exception): # IntegrityError
        baker.make(TrailProgress, user=test_user, trail_id=1)
