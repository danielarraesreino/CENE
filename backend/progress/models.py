from django.db import models
from django.conf import settings

class LessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey('content.Lesson', on_delete=models.CASCADE, related_name='progress_entries')
    course_slug = models.CharField(max_length=200)  # Denormalizado para queries rápidas
    completed_at = models.DateTimeField()
    time_spent_seconds = models.PositiveIntegerField(default=0)
    synced_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'lesson']  # Um progresso por aula por usuário
        indexes = [
            models.Index(fields=['user', 'course_slug']),  # Para listar progresso do curso
        ]
        verbose_name = 'Progresso de Aula'
        verbose_name_plural = 'Progressos de Aulas'

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.course_slug})"
