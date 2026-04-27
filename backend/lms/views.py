from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.contrib.auth import get_user_model
from lms.models import TrailProgress
from lms.serializers import UserSerializer, TrailProgressSerializer, RegisterSerializer

User = get_user_model()

class UserViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrailProgressViewSet(viewsets.ModelViewSet):
    serializer_class = TrailProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrailProgress.objects.select_related('user').filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['get'])
    def progress(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def sync(self, request):
        # Sync all trails from local storage to db
        # If request.data is a list, use it directly. If it's a dict with 'trails', use that.
        data = request.data
        if isinstance(data, dict) and 'trails' in data:
            data = data['trails']
        
        if not isinstance(data, list):
            return Response({"error": "Expected a list of trails or a dict with 'trails' key."}, status=400)

        synced_trails = []
        for trail in data:
            obj, created = TrailProgress.objects.update_or_create(
                user=request.user,
                trail_id=trail.get('trail_id') or trail.get('id'),
                defaults={
                    'is_unlocked': trail.get('is_unlocked') or trail.get('isUnlocked', False),
                    'status': trail.get('status', 'idle'),
                    'ouvir': trail.get('ouvir', False),
                    'estudar': trail.get('estudar', False),
                    'avaliar': trail.get('avaliar', False),
                }
            )
            synced_trails.append(obj)
            
        return Response({'status': 'synced', 'count': len(synced_trails)})
