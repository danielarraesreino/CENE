from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LessonProgress
from push.utils import send_push_notification
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=LessonProgress)
@transaction.atomic
def notify_next_lesson_unlock(sender, instance, created, **kwargs):
    """
    Notifica o usuário quando ele conclui uma aula e a próxima é desbloqueada.
    Envolto em @transaction.atomic para garantir que falhas no push não
    deixem o banco em estado intermediário inconsistente.
    """
    if instance.completed_at:
        lesson = instance.lesson
        # Busca a próxima aula na ordem
        next_lesson = lesson.module.lessons.filter(
            order__gt=lesson.order
        ).first()

        # Se não houver no módulo atual, busca no próximo módulo
        if not next_lesson:
            next_module = lesson.module.course.modules.filter(
                order__gt=lesson.module.order
            ).first()
            if next_module:
                next_lesson = next_module.lessons.first()

        if next_lesson:
            try:
                send_push_notification(
                    user=instance.user,
                    title="🎓 Aula Desbloqueada!",
                    body=f"Parabéns! '{next_lesson.title}' já está disponível para você.",
                    url=f"/cursos/{lesson.module.course.slug}"
                )
            except Exception as exc:
                # Falha no push NÃO deve abortar a transação de progresso
                logger.warning(
                    "[REIBB] Falha ao enviar push de desbloqueio: %s | user=%s | lesson=%s",
                    exc, instance.user_id, next_lesson.id
                )

