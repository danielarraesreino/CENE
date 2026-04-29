from django.urls import path
from .views import CourseEngagementView

urlpatterns = [
    path('courses/<str:slug>/analytics/', CourseEngagementView.as_view(), name='course-analytics'),
]
