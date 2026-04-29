from rest_framework import permissions
from django.utils import timezone
from progress.models import LessonProgress

class HasLessonAccess(permissions.BasePermission):
    """
    Permissão granular para acesso a aulas baseada em pré-requisitos e estratégia de desbloqueio.
    """
    def has_object_permission(self, request, view, obj):
        # Admins e Staff têm acesso total
        if request.user.is_staff:
            return True
        
        # 1. Verifica pré-requisitos concluídos
        # Buscamos os IDs das aulas concluídas pelo usuário para este curso
        completed_lessons = LessonProgress.objects.filter(
            user=request.user,
            course_slug=obj.module.course.slug
        ).values_list('lesson_id', flat=True)
        
        required_prereqs = obj.prerequisites.all()
        for prereq in required_prereqs:
            if prereq.id not in completed_lessons:
                return False
            
        # 2. Verifica estratégia de desbloqueio por data
        if obj.unlock_strategy == 'date' and obj.release_date:
            if timezone.now() < obj.release_date:
                return False
                
        return True
