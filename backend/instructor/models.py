from django.db import models
from django.conf import settings


class InstructorAnalytics(models.Model):
    """
    Snapshot diário das métricas de desempenho do instrutor.
    Gerado automaticamente via tarefa agendada ou endpoint sob demanda.
    """
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analytics_snapshots',
        limit_choices_to={'role__in': ['admin', 'supervisor']},
    )
    date = models.DateField()

    # Métricas de alunos
    total_students = models.IntegerField(default=0)
    active_students = models.IntegerField(default=0)  # Ativos nos últimos 7 dias

    # Métricas de conclusão
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    avg_time_spent_minutes = models.DecimalField(max_digits=8, decimal_places=1, default=0)

    # Métricas de conteúdo
    total_lessons = models.IntegerField(default=0)
    total_courses = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('instructor', 'date')]
        ordering = ['-date']
        verbose_name = 'Analytics do Instrutor'
        verbose_name_plural = 'Analytics dos Instrutores'

    def __str__(self):
        return f'{self.instructor} — {self.date}'

