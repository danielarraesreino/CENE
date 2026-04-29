from django.conf import settings
from django.db import models
from django.utils.text import slugify

class Course(models.Model):
    STATUS_CHOICES = [('draft', 'Rascunho'), ('published', 'Publicado')]
    TARGET_CHOICES = [('all', 'Todos'), ('counselor', 'Conselheiro'), ('clinical', 'Clínico')]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='courses/covers/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    target_role = models.CharField(max_length=20, choices=TARGET_CHOICES, default='all')
    is_active = models.BooleanField(default=True)
    
    # Opção D: Analytics + Instrutor
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='courses_owned', verbose_name='Instrutor'
    )
    enrolled_students = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name='enrolled_courses'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Curso'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self): return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    class Meta: ordering = ['order']
    def __str__(self): return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    TYPE_CHOICES = [('video', 'Vídeo'), ('text', 'Texto'), ('pdf', 'PDF'), ('quiz', 'Quiz')]
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='text')
    content_html = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    pdf_file = models.FileField(upload_to='courses/materials/', blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    
    # Opção E: RBAC Granular + Pré-requisitos
    prerequisites = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='required_for')
    unlock_strategy = models.CharField(
        max_length=20, 
        choices=[('immediate', 'Imediato'), ('sequential', 'Sequencial'), ('date', 'Data Fixa')],
        default='immediate'
    )
    release_date = models.DateTimeField(blank=True, null=True, help_text='Para estratégia "date"')

    class Meta: ordering = ['order']
    def __str__(self): return self.title
