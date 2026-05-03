from rest_framework import serializers
from .models import User, PsychologistLink, TrailProgress

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']

class PsychologistLinkSerializer(serializers.ModelSerializer):
    patient_detail = UserSummarySerializer(source='patient', read_only=True)
    psychologist_detail = UserSummarySerializer(source='psychologist', read_only=True)

    class Meta:
        model = PsychologistLink
        fields = ['id', 'patient', 'psychologist', 'is_active', 'patient_detail', 'psychologist_detail']

class TrailProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrailProgress
        fields = '__all__'
