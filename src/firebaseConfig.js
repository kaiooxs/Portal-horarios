// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj9B0UOEm5E9whKqyT70dI9MVpFmzdNaA",
  authDomain: "portal-horarios.firebaseapp.com",
  projectId: "portal-horarios",
  storageBucket: "portal-horarios.firebasestorage.app",
  messagingSenderId: "972749855191",
  appId: "1:972749855191:web:58c70d2d46b30cd1119392",
  measurementId: "G-HZW2KK8WSC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

