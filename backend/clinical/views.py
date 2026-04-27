from rest_framework import viewsets, permissions
from clinical.models import RPD, TriggerLog, MoodLog, Goal, SafetyPlan, Journal
from clinical.serializers import (
    RPDSerializer, TriggerLogSerializer, MoodLogSerializer, 
    GoalSerializer, SafetyPlanSerializer, JournalSerializer
)

class ClinicalBaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RPDViewSet(ClinicalBaseViewSet):
    queryset = RPD.objects.all()
    serializer_class = RPDSerializer

    def get_queryset(self):
        return RPD.objects.filter(user=self.request.user, is_deleted=False)

class TriggerLogViewSet(ClinicalBaseViewSet):
    queryset = TriggerLog.objects.all()
    serializer_class = TriggerLogSerializer

class MoodLogViewSet(ClinicalBaseViewSet):
    queryset = MoodLog.objects.all()
    serializer_class = MoodLogSerializer

class GoalViewSet(ClinicalBaseViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

class SafetyPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SafetyPlanSerializer

    def get_queryset(self):
        return SafetyPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Garante que só existe um plano de segurança por usuário
        SafetyPlan.objects.update_or_create(
            user=self.request.user,
            defaults=serializer.validated_data
        )

class JournalViewSet(ClinicalBaseViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
