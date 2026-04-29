from rest_framework import serializers
from .models import PushSubscription

class PushSubscriptionSerializer(serializers.ModelSerializer):
    keys = serializers.JSONField(write_only=True)

    class Meta:
        model = PushSubscription
        fields = ['id', 'endpoint', 'keys', 'is_active']
        read_only_fields = ['id', 'is_active']

    def create(self, validated_data):
        keys = validated_data.pop('keys')
        validated_data['p256dh'] = keys.get('p256dh')
        validated_data['auth'] = keys.get('auth')
        return super().create(validated_data)
