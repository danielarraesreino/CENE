from rest_framework import viewsets, permissions
from .models import Trail, Module, Lesson, Course
from .serializers import TrailSerializer, ModuleSerializer, LessonSerializer, CourseListSerializer

class CMSPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'supervisor']

class TrailViewSet(viewsets.ModelViewSet):
    queryset = Trail.objects.all().prefetch_related('modules__lessons')
    serializer_class = TrailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [CMSPermission()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CMSModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [CMSPermission]

class CMSLessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [CMSPermission]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CMSCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer
    permission_classes = [CMSPermission]
