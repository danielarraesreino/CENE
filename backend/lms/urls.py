from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrailProgressViewSet, UserManagementViewSet, PsychologistLinkViewSet, bootstrap_test_user

router = DefaultRouter()
router.register(r'trails', TrailProgressViewSet, basename='trails')
router.register(r'users', UserManagementViewSet, basename='users')
router.register(r'professional-links', PsychologistLinkViewSet, basename='professional-links')

urlpatterns = [
    path('', include(router.urls)),
    path('bootstrap-user/', bootstrap_test_user, name='bootstrap-user'),
]
