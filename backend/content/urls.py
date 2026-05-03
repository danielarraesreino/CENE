from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter
from .views import CourseListView, CourseDetailView, LessonDetailView, LessonPrerequisitesView, downloadable_material
from .cms_views import TrailViewSet, CMSModuleViewSet, CMSLessonViewSet, CMSCourseViewSet

router = DefaultRouter()
router.register(r'cms/trails', TrailViewSet)
router.register(r'cms/modules', CMSModuleViewSet)
router.register(r'cms/lessons', CMSLessonViewSet)
router.register(r'cms/courses', CMSCourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:pk>/prerequisites/', LessonPrerequisitesView.as_view(), name='lesson-prerequisites'),
    re_path(r'^materials/(?P<file_path>.+)$', downloadable_material, name='downloadable-material'),
]
