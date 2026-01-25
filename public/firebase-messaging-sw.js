// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDdieAiF9M2Rzyu0m9WkPxY3FallsEzsyo",
  authDomain: "wdp-notification.firebaseapp.com",
  projectId: "wdp-notification",
  storageBucket: "wdp-notification.firebasestorage.app",
  messagingSenderId: "192518278834",
  appId: "1:192518278834:web:4ad28ba70cad9b408043ab",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Lắng nghe thông báo khi ứng dụng chạy ngầm (đóng tab/thu nhỏ)
messaging.onBackgroundMessage((payload) => {
  console.log("[sw.js] Nhận thông báo ngầm:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/logo-sync", // Thay bằng link icon web của bạn
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
