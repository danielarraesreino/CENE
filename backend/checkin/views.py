from rest_framework import viewsets, permissions
from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer

class DailyCheckInViewSet(viewsets.ModelViewSet):
    serializer_class = DailyCheckInSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
