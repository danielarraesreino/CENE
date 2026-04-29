from django.urls import path, re_path
from .views import CourseListView, CourseDetailView, LessonDetailView, LessonPrerequisitesView, downloadable_material

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:pk>/prerequisites/', LessonPrerequisitesView.as_view(), name='lesson-prerequisites'),
    re_path(r'^materials/(?P<file_path>.+)$', downloadable_material, name='downloadable-material'),
]
