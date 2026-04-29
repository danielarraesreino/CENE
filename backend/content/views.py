from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Course, Lesson
from .serializers import CourseListSerializer, CourseDetailSerializer, LessonSerializer
from .permissions import HasLessonAccess

class CoursePagination(PageNumberPagination):
    page_size = 12; page_size_query_param = 'page_size'; max_page_size = 24

class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer; pagination_class = CoursePagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Course.objects.filter(status='published', is_active=True)
        user_role = getattr(self.request.user, 'role', 'all')
        if user_role != 'admin':
            qs = qs.filter(target_role__in=['all', user_role])
        return qs.prefetch_related('modules__lessons')

class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseDetailSerializer; permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    def get_queryset(self):
        return Course.objects.filter(status='published', is_active=True).prefetch_related('modules__lessons')

class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, HasLessonAccess]
    queryset = Lesson.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class LessonPrerequisitesView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Lesson.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        prereqs = instance.prerequisites.values_list('id', flat=True)
        return Response({'prerequisites': list(prereqs)})

from django.http import FileResponse, HttpResponse
from django.views.decorators.http import require_GET
from django.utils.http import http_date
from django.conf import settings
import os

@require_GET
def downloadable_material(request, file_path: str):
    if not file_path.startswith('courses/materials/'):
        return HttpResponse('Acesso negado', status=403)
    
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)
    if not os.path.exists(full_path):
        return HttpResponse('Arquivo não encontrado', status=404)
    
    response = FileResponse(open(full_path, 'rb'), content_type='application/pdf')
    response['Cache-Control'] = 'public, max-age=31536000, immutable'
    response['Last-Modified'] = http_date(os.path.getmtime(full_path))
    response['Content-Disposition'] = f'inline; filename="{os.path.basename(full_path)}"'
    
    return response
