from rest_framework import serializers
from .models import DailyCheckIn

class DailyCheckInSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = DailyCheckIn
        fields = '__all__'
