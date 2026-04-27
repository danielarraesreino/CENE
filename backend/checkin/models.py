from django.db import models
from django.conf import settings

class DailyCheckIn(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='checkins')
    date = models.DateField(auto_now_add=True)
    craving_level = models.IntegerField(default=0) # 0-10
    mood = models.CharField(max_length=50) # "happy", "anxious", "sad", etc.
    trigger = models.TextField(blank=True, null=True)
    areas = models.JSONField(default=dict) # {"fisica": 70, "social": 55, ...}
    
    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"Check-in {self.date} - {self.user.username}"
