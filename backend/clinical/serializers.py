from rest_framework import serializers
from .models import RPD, TriggerLog, MoodLog, Goal, SafetyPlan, Journal

class RPDSerializer(serializers.ModelSerializer):
    class Meta:
        model = RPD
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

class TriggerLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TriggerLog
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class SafetyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyPlan
        fields = '__all__'
        read_only_fields = ('user', 'updated_at')

class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
