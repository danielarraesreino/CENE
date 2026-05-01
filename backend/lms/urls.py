from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrailProgressViewSet, UserViewSet, bootstrap_test_user

router = DefaultRouter()
router.register(r'trails', TrailProgressViewSet, basename='trails')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('bootstrap-user/', bootstrap_test_user, name='bootstrap-user'),
]
