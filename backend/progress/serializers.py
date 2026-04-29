from rest_framework import serializers
from .models import LessonProgress

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'course_slug', 'completed_at', 'time_spent_seconds', 'synced_at']
        read_only_fields = ['id', 'synced_at']

    def create(self, validated_data):
        user = self.context['request'].user
        # Upsert: se já existe, atualiza
        progress, created = LessonProgress.objects.update_or_create(
            user=user,
            lesson=validated_data['lesson'],
            defaults={
                'course_slug': validated_data['course_slug'],
                'completed_at': validated_data['completed_at'],
                'time_spent_seconds': validated_data['time_spent_seconds'],
            }
        )
        return progress
