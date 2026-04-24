from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrailProgressViewSet, UserViewSet

router = DefaultRouter()
router.register(r'trails', TrailProgressViewSet, basename='trails')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]
