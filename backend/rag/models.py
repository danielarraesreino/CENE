from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    role = models.CharField(max_length=20) # "user" or "assistant"
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.role} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
