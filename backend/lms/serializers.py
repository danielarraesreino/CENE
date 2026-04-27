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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
