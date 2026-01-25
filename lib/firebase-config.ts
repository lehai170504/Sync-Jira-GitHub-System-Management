// @/lib/firebase-config.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDdieAiF9M2Rzyu0m9WkPxY3FallsEzsyo",
  authDomain: "wdp-notification.firebaseapp.com",
  projectId: "wdp-notification",
  storageBucket: "wdp-notification.firebasestorage.app",
  messagingSenderId: "192518278834",
  appId: "1:192518278834:web:4ad28ba70cad9b408043ab",
};

// Khởi tạo Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
