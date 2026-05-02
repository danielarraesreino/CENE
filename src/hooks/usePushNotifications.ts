'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    setPermission(Notification.permission);
    
    // Verificar se já existe uma subscrição
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(sub => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Solicitar permissão explicitamente se necessário
      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);
      
      if (currentPermission !== 'granted') {
        toast.error('Permissão de notificação negada.');
        return;
      }

      const vapidPublicKey = "BJWO2ZUfUH5BASLX8IIpPbKBpQNif2zFBo2dcYXZrI1AJmWkzKK1C6WtLO1ctTw0p8PdorxrXmd4H-VeqJCZaFE";
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      const res = await fetch(`${API_URL}/api/push/subscribe/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}` 
        },
        body: JSON.stringify(sub.toJSON())
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast.success('Notificações ativadas! 🔔');
      } else {
        throw new Error('Falha no servidor ao salvar subscrição');
      }
    } catch (err) {
      console.error('[PUSH_SUB_ERROR]', err);
      toast.error('Erro ao ativar notificações.');
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        
        await fetch(`${API_URL}/api/push/subscribe/?endpoint=${encodeURIComponent(endpoint)}`, { 
          method: 'DELETE', 
          headers: { 'Authorization': `Bearer ${session?.accessToken}` } 
        });
        
        setIsSubscribed(false);
        setPermission(Notification.permission);
        toast.info('Notificações desativadas.');
      }
    } catch (err) {
      console.error('[PUSH_UNSUB_ERROR]', err);
    }
  }, []);

  return { isSubscribed, permission, subscribe, unsubscribe };
}
