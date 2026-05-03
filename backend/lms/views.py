from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.conf import settings
from .models import User, PsychologistLink, TrailProgress
from .serializers import UserCreateSerializer, UserSummarySerializer, PsychologistLinkSerializer, TrailProgressSerializer

class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'supervisor']

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSummarySerializer
    permission_classes = [IsSupervisorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        # Supervisors only see users they created or are linked to
        return User.objects.filter(supervisor=user)

    def perform_create(self, serializer):
        serializer.save(supervisor=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class PsychologistLinkViewSet(viewsets.ModelViewSet):
    queryset = PsychologistLink.objects.all()
    serializer_class = PsychologistLinkSerializer
    permission_classes = [IsSupervisorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return PsychologistLink.objects.all()
        return PsychologistLink.objects.filter(psychologist__supervisor=user) | PsychologistLink.objects.filter(psychologist=user)

class TrailProgressViewSet(viewsets.ModelViewSet):
    serializer_class = TrailProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrailProgress.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def sync(self, request):
        # Sync logic from frontend
        trails_data = request.data
        for trail in trails_data:
            TrailProgress.objects.update_or_create(
                user=request.user,
                trail_id=trail['id'],
                defaults={
                    'is_unlocked': trail.get('isUnlocked', False),
                    'status': trail.get('status', 'idle'),
                    'ouvir': trail.get('progress', {}).get('ouvir', False),
                    'estudar': trail.get('progress', {}).get('estudar', False),
                    'avaliar': trail.get('progress', {}).get('avaliar', False),
                }
            )
        return Response({'status': 'synced'})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bootstrap_test_user(request):
    """Cria usuário de teste. Desabilitado em produção (DEBUG=False)."""
    if not settings.DEBUG:
        return Response(
            {'error': 'Endpoint desabilitado em produção.'},
            status=status.HTTP_403_FORBIDDEN
        )
    username = request.data.get('username', 'testuser')
    user, created = User.objects.get_or_create(username=username)
    if created:
        user.set_password('password123')
        user.role = 'patient'
        user.save()
    return Response({'status': 'bootstrapped', 'username': username})

