from django.db import models
from lms.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from clinical.models import RPD, TriggerLog, MoodLog, Goal, SafetyPlan, Journal
from clinical.serializers import (
    RPDSerializer, TriggerLogSerializer, MoodLogSerializer, 
    GoalSerializer, SafetyPlanSerializer, JournalSerializer
)

class ClinicalBaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset.all()
        
        if user.role in ['supervisor', 'psychologist']:
            linked_patients = User.objects.filter(
                models.Q(professional_links__psychologist=user) | 
                models.Q(professional_links__psychologist__supervisor=user)
            ).distinct()
            return self.queryset.filter(user__in=linked_patients)
            
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from django.http import HttpResponse
from clinical.services.export_service import ExportService

class RPDViewSet(ClinicalBaseViewSet):
    queryset = RPD.objects.all()
    serializer_class = RPDSerializer

    def get_queryset(self):
        user = self.request.user
        base_qs = RPD.objects.filter(is_deleted=False)
        if user.role == 'admin':
            return base_qs
            
        if user.role in ['supervisor', 'psychologist']:
            linked_patients = User.objects.filter(
                models.Q(professional_links__psychologist=user) | 
                models.Q(professional_links__psychologist__supervisor=user)
            ).distinct()
            return base_qs.filter(user__in=linked_patients)

        return base_qs.filter(user=user)

    @action(detail=False, methods=['get'])
    def export_pdf(self, request):
        user_id = request.query_params.get('user_id')
        user = request.user
        
        if user_id and user.role in ['admin', 'supervisor', 'psychologist']:
            # Check if this instructor has access to this user
            target_user = User.objects.get(id=user_id)
            # If not admin, check if linked
            if user.role != 'admin':
                is_linked = User.objects.filter(
                    models.Q(id=user_id),
                    models.Q(professional_links__psychologist=user) | 
                    models.Q(professional_links__psychologist__supervisor=user)
                ).exists()
                if not is_linked:
                    return Response({'error': 'Acesso negado'}, status=403)
            qs = self.queryset.filter(user_id=user_id)
            report_user_name = target_user.username
        else:
            qs = self.get_queryset()
            report_user_name = user.username

        pdf = ExportService.generate_pdf(qs, "Relatório Clínico", report_user_name)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{report_user_name}.pdf"'
        return response

class TriggerLogViewSet(ClinicalBaseViewSet):
    queryset = TriggerLog.objects.all()
    serializer_class = TriggerLogSerializer

class MoodLogViewSet(ClinicalBaseViewSet):
    queryset = MoodLog.objects.all()
    serializer_class = MoodLogSerializer

    @action(detail=False, methods=['get'])
    def export_pdf(self, request):
        user_id = request.query_params.get('user_id')
        user = request.user
        
        if user_id and user.role in ['admin', 'supervisor', 'psychologist']:
            target_user = User.objects.get(id=user_id)
            if user.role != 'admin':
                is_linked = User.objects.filter(
                    models.Q(id=user_id),
                    models.Q(professional_links__psychologist=user) | 
                    models.Q(professional_links__psychologist__supervisor=user)
                ).exists()
                if not is_linked:
                    return Response({'error': 'Acesso negado'}, status=403)
            qs = self.queryset.filter(user_id=user_id)
            report_user_name = target_user.username
        else:
            qs = self.get_queryset()
            report_user_name = user.username

        pdf = ExportService.generate_pdf(qs, "Relatório de Humor", report_user_name)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="mood_{report_user_name}.pdf"'
        return response

class GoalViewSet(ClinicalBaseViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

class SafetyPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SafetyPlanSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return SafetyPlan.objects.all()
            
        if user.role in ['supervisor', 'psychologist']:
            linked_patients = User.objects.filter(
                models.Q(professional_links__psychologist=user) | 
                models.Q(professional_links__psychologist__supervisor=user)
            ).distinct()
            return SafetyPlan.objects.filter(user__in=linked_patients)
            
        return SafetyPlan.objects.filter(user=user)

    def perform_create(self, serializer):
        SafetyPlan.objects.update_or_create(
            user=self.request.user,
            defaults=serializer.validated_data
        )

class JournalViewSet(ClinicalBaseViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
