from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('supervisor', 'Supervisor (Matheus)'),
        ('psychologist', 'Psicólogo'),
        ('attendant', 'Atendente'),
        ('patient', 'Paciente'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    supervisor = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='subordinates'
    )
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class PsychologistLink(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='professional_links')
    psychologist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_links')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('patient', 'psychologist')

    def __str__(self):
        return f"{self.psychologist.username} -> {self.patient.username}"

class TrailProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trails')
    trail_id = models.IntegerField()
    is_unlocked = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='idle') # idle, in_progress, completed
    
    # Progress steps
    ouvir = models.BooleanField(default=False)
    estudar = models.BooleanField(default=False)
    avaliar = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'trail_id')

    def __str__(self):
        return f"Trail {self.trail_id} - {self.user.username}"
