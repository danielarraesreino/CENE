import bleach
from django.conf import settings
from rest_framework import serializers
from django.utils import timezone
from .models import Course, Module, Lesson, Trail
from progress.models import LessonProgress

class LessonSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    prerequisites_ids = serializers.PrimaryKeyRelatedField(
        source='prerequisites', many=True, read_only=True
    )

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'content_type', 'content_html', 'video_url', 
            'pdf_file', 'audio_file', 'attachment', 'quiz_data',
            'duration_minutes', 'order', 'unlock_strategy', 
            'release_date', 'is_unlocked', 'is_completed', 'prerequisites_ids'
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
            
        # If it's a Trail lesson, the logic might differ, but for now we follow Course logic
        if obj.module.course:
            completed_ids = LessonProgress.objects.filter(
                user=request.user,
                course_slug=obj.module.course.slug
            ).values_list('lesson_id', flat=True)
            
            for prereq in obj.prerequisites.all():
                if prereq.id not in completed_ids:
                    return False
        
        # 2. Data
        if obj.unlock_strategy == 'date' and obj.release_date:
            if timezone.now() < obj.release_date:
                return False
                
        return True

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return LessonProgress.objects.filter(user=request.user, lesson=obj).exists()

    def validate_content_html(self, value):
        return bleach.clean(
            value,
            tags=settings.BLEACH_ALLOWED_TAGS,
            attributes=settings.BLEACH_ALLOWED_ATTRIBUTES,
            protocols=settings.BLEACH_ALLOWED_PROTOCOLS,
            strip=True
        )

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module; fields = ['id', 'title', 'order', 'lessons']

class CourseListSerializer(serializers.ModelSerializer):
    modules_count = serializers.IntegerField(source='modules.count', read_only=True)
    class Meta:
        model = Course; fields = ['id', 'title', 'slug', 'description', 'cover_image', 'target_role', 'modules_count']

class CourseDetailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Course; fields = ['id', 'title', 'slug', 'description', 'cover_image', 'target_role', 'modules']

from lms.serializers import UserSummarySerializer

class TrailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    author = UserSummarySerializer(read_only=True)
    
    class Meta:
        model = Trail
        fields = ['id', 'title', 'category', 'description', 'is_premium', 'order', 'is_active', 'modules', 'author']
