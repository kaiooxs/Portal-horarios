// Script de teste para verificar conexão com Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

console.log("🔧 Configuração do Firebase:");
console.log("Project ID:", firebaseConfig.projectId);
console.log("Auth Domain:", firebaseConfig.authDomain);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  console.log("\n📝 Testando escrita no Firestore...");
  
  try {
    // Tentar escrever um documento de teste
    const testPath = "artifacts/default-app-id/public/data/test";
    const testDoc = doc(db, testPath, "teste");
    
    await setDoc(testDoc, {
      mensagem: "Teste de escrita",
      timestamp: new Date(),
      teste: true
    });
    
    console.log("✅ Escrita bem-sucedida!");
    
    // Tentar ler o documento
    console.log("\n📖 Testando leitura do Firestore...");
    const docSnap = await getDoc(testDoc);
    
    if (docSnap.exists()) {
      console.log("✅ Leitura bem-sucedida!");
      console.log("Dados:", docSnap.data());
    } else {
      console.log("⚠️ Documento não encontrado após escrita");
    }
    
    // Testar escrita em professores
    console.log("\n👨‍🏫 Testando escrita em Professores...");
    const profPath = "artifacts/default-app-id/public/data/Professores";
    const profDoc = doc(db, profPath, "lista");
    
    await setDoc(profDoc, {
      professores: [
        {
          id: "teste_professor",
          nome: "Professor Teste",
          disciplinas: ["Matemática"],
          turmas: ["10A"]
        }
      ],
      lastUpdated: new Date()
    });
    
    console.log("✅ Professores salvos com sucesso!");
    
    // Ler professores
    const profSnap = await getDoc(profDoc);
    if (profSnap.exists()) {
      console.log("✅ Professores lidos com sucesso!");
      console.log("Total:", profSnap.data().professores.length);
    }
    
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    console.error("Código do erro:", error.code);
    console.error("Mensagem:", error.message);
    
    if (error.code === 'permission-denied') {
      console.error("\n🚫 ERRO DE PERMISSÃO!");
      console.error("Verifique as regras do Firestore no Firebase Console");
      console.error("As regras devem permitir leitura e escrita");
    }
  }
}

testFirestore();