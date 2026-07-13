self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body,
        icon: data.icon || '/assets/img/icons/logo.png',
        badge: '/assets/img/icons/logo.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/'
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {      
      event.waitUntil(
        self.registration.showNotification('Pesan Baru', {
          body: event.data.text()
        }
      ));
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {      
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }      
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});