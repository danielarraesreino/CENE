from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Custom fields can go here (e.g. is_paying_customer)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.username

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
