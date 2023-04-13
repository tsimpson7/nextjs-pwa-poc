// install service worker
self.addEventListener('install', function (event) {
  console.log('Service worker has been installed');
});

// activate event
self.addEventListener('activate', function (event) {
  console.log('Service worker has been activated');
});

// fetch event
self.addEventListener('fetch', function (event) {
  console.log('fetch event', event);
});
