from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RPDViewSet, TriggerLogViewSet, MoodLogViewSet,
    GoalViewSet, SafetyPlanViewSet, JournalViewSet
)

router = DefaultRouter()
router.register(r'rpd', RPDViewSet, basename='rpd')
router.register(r'triggers', TriggerLogViewSet, basename='triggers')
router.register(r'mood', MoodLogViewSet, basename='mood')
router.register(r'goals', GoalViewSet, basename='goals')
router.register(r'safety-plan', SafetyPlanViewSet, basename='safety-plan')
router.register(r'journal', JournalViewSet, basename='journal')

urlpatterns = [
    path('', include(router.urls)),
]
