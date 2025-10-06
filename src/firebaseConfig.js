import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Verificar se as variáveis de ambiente foram carregadas
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "undefined") {
  console.error("❌ ERRO: Variáveis de ambiente do Firebase não foram carregadas!");
  console.error("Certifique-se de que o arquivo .env existe na raiz do projeto e reinicie o servidor.");
} else {
  console.log("✅ Firebase configurado com sucesso!");
  console.log("📦 Projeto:", firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
