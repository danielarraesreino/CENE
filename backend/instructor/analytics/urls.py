from django.urls import path
from .views import CourseEngagementView, InstructorGlobalStatsView

urlpatterns = [
    path('courses/<str:slug>/analytics/', CourseEngagementView.as_view(), name='course-analytics'),
    path('stats/', InstructorGlobalStatsView.as_view(), name='instructor-global-stats'),
]
