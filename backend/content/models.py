from django.db import models

class Trail(models.Model):
    TYPES = [
        ('narrative', 'narrative'),
        ('myth_reveal', 'myth_reveal'),
        ('resistance', 'resistance'),
        ('quiz', 'quiz'),
        ('video', 'video'),
        ('breathing', 'breathing'),
        ('reflection', 'reflection'),
    ]
    
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100) # Ex: "Fundamentos", "Recaída", "Família"
    order = models.IntegerField()
    is_premium = models.BooleanField(default=False)
    type = models.CharField(max_length=20, choices=TYPES)
    audio_url = models.CharField(max_length=500, blank=True, null=True)
    content = models.JSONField() # Esquema definido em types/trail-content.ts do frontend
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.id} - {self.title}"
