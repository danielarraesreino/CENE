from django.urls import path
from .views import LessonProgressCreateView, LessonProgressDetailView

urlpatterns = [
    path('lessons/', LessonProgressCreateView.as_view(), name='progress-lesson-create'),
    path('lessons/<int:lesson_id>/', LessonProgressDetailView.as_view(), name='progress-lesson-detail'),
]
