from rest_framework import viewsets, permissions
from .models import Trail
from .serializers import TrailSerializer

class TrailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trail.objects.all()
    serializer_class = TrailSerializer
    permission_classes = [permissions.AllowAny] # Pode ser IsAuthenticated se quiser proteger o catálogo
