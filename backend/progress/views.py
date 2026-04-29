from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import LessonProgress
from .serializers import LessonProgressSerializer

class LessonProgressCreateView(generics.CreateAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonProgressDetailView(generics.RetrieveAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'lesson_id'

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)
