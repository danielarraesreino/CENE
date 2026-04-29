// public/sw-push.js

self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { url: data.data?.url || '/portal/paciente' },
      tag: data.tag || 'reibb-notification',
      requireInteraction: true,
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'close', title: 'Fechar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (err) {
    console.error('Erro ao processar notificação push:', err);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Se já houver uma aba aberta, foca nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não houver, abre uma nova
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
