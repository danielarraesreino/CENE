from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import TrailProgress
from .serializers import UserSerializer, TrailProgressSerializer

User = get_user_model()

class UserViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class TrailProgressViewSet(viewsets.ModelViewSet):
    serializer_class = TrailProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrailProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['post'])
    def sync_progress(self, request):
        # Sync all trails from local storage to db
        data = request.data.get('trails', [])
        synced_trails = []
        for trail in data:
            obj, created = TrailProgress.objects.update_or_create(
                user=request.user,
                trail_id=trail.get('id'),
                defaults={
                    'is_unlocked': trail.get('isUnlocked', False),
                    'status': trail.get('status', 'idle'),
                    'ouvir': trail.get('progress', {}).get('ouvir', False),
                    'estudar': trail.get('progress', {}).get('estudar', False),
                    'avaliar': trail.get('progress', {}).get('avaliar', False),
                }
            )
            synced_trails.append(obj)
            
        return Response({'status': 'synced', 'count': len(synced_trails)})
