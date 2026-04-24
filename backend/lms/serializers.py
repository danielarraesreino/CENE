from rest_framework import serializers
from .models import User, TrailProgress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_premium']

class TrailProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrailProgress
        fields = ['trail_id', 'is_unlocked', 'status', 'ouvir', 'estudar', 'avaliar']
        read_only_fields = ['trail_id']
