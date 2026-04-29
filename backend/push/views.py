from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import PushSubscription
from .serializers import PushSubscriptionSerializer

class PushSubscriptionView(generics.CreateAPIView, generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PushSubscriptionSerializer
    
    def get_queryset(self):
        return PushSubscription.objects.filter(user=self.request.user, is_active=True)
    
    def get_object(self):
        # Para o DELETE, buscamos o endpoint específico passado no body ou query
        endpoint = self.request.data.get('endpoint') or self.request.query_params.get('endpoint')
        return generics.get_object_or_404(self.get_queryset(), endpoint=endpoint)

    def create(self, request, *args, **kwargs):
        endpoint = request.data.get('endpoint')
        keys = request.data.get('keys')
        
        if not endpoint or not keys:
            return Response({"error": "Endpoint e keys são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

        sub, created = PushSubscription.objects.update_or_create(
            endpoint=endpoint,
            defaults={
                'user': request.user,
                'p256dh': keys.get('p256dh'),
                'auth': keys.get('auth'),
                'is_active': True
            }
        )
        serializer = self.get_serializer(sub)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
