self.addEventListener('push', function(event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png'  // Optional icon for notifications
    });
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Optionally handle actions like opening the app on click
    event.waitUntil(
      clients.openWindow('/')
    );
  });  