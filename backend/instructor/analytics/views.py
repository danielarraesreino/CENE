from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from content.models import Course, Lesson
from progress.models import LessonProgress
from clinical.models import MoodLog
from django.contrib.auth import get_user_model

User = get_user_model()

class InstructorGlobalStatsView(APIView):
    """
    Retorna métricas globais para o dashboard do instrutor (Admin/Supervisor).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'supervisor']:
            raise PermissionDenied("Acesso restrito a instrutores e supervisores.")

        now = timezone.now()
        hoje_inicio = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # Total de pacientes na plataforma
        total_patients = User.objects.filter(role='patient').count()

        # Trilhas/cursos ativos publicados
        active_trails = Course.objects.filter(status='published').count()

        # Lições totais criadas na plataforma (qualquer curso/modulo)
        created_lessons = Lesson.objects.count()

        # Logs diários (vamos usar MoodLog como exemplo representativo da atividade diária clínica)
        today_logs = MoodLog.objects.filter(timestamp__gte=hoje_inicio).count()

        return Response({
            "total_patients": total_patients,
            "active_trails": active_trails,
            "created_lessons": created_lessons,
            "today_logs": today_logs,
            "generated_at": now.isoformat()
        })


class CourseEngagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        course = Course.objects.filter(slug=slug).first()
        if not course:
            return Response({"detail": "Curso não encontrado"}, status=404)

        # RBAC: Apenas dono ou staff
        if not request.user.is_staff and course.owner != request.user:
            raise PermissionDenied("Acesso negado a analytics deste curso.")

        now = timezone.now()
        # total_students = LessonProgress.objects.filter(lesson__module__course=course).values('user').distinct().count()
        # Usando a relação enrolled_students que adicionamos
        total_students = course.enrolled_students.count()
        
        if total_students == 0:
            return Response({
                "course": course.title, "total_students": 0, "completion_rate": 0,
                "avg_time_minutes": 0, "recent_logins": 0, "drop_off_points": [],
                "generated_at": now.isoformat()
            })

        stats = LessonProgress.objects.filter(lesson__module__course=course).aggregate(
            completed_count=Count('id', filter=Q(completed_at__isnull=False)),
            avg_time=Avg('time_spent_seconds'),
            recent=Count('id', filter=Q(created_at__gte=now - timedelta(days=7)))
        )

        total_lessons = Lesson.objects.filter(module__course=course).count()
        completion_rate = round((stats['completed_count'] / max(total_students * total_lessons, 1)) * 100, 2)

        drop_off = LessonProgress.objects.filter(
            lesson__module__course=course, completed_at__isnull=True
        ).values('lesson__title').annotate(count=Count('id')).order_by('-count')[:5]

        return Response({
            "course": course.title,
            "slug": course.slug,
            "total_students": total_students,
            "completion_rate": completion_rate,
            "avg_time_minutes": round((stats['avg_time'] or 0) / 60, 1),
            "recent_logins": stats['recent'],
            "drop_off_points": list(drop_off),
            "generated_at": now.isoformat()
        })
