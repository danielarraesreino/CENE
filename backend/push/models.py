from django.db import models
from django.conf import settings

class PushSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.URLField(unique=True, max_length=500)
    p256dh = models.CharField(max_length=256)
    auth = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        indexes = [models.Index(fields=['user', 'is_active'])]
    
    def __str__(self): return f"{self.user.username} - {self.endpoint[-20:]}"
