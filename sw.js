self.addEventListener("push", function(event) {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Peringatan Darurat!", {
      body: data.body || "Segera lakukan evakuasi.",
      icon: "assets/icon.png",
      badge: "assets/icon.png",
      vibrate: [200, 100, 200, 100, 200]
    })
  );
});
