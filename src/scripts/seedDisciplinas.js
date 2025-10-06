/**
 * Script para popular o Firebase com dados de disciplinas por turma/ano
 * 
 * COMO USAR:
 * 1. Certifique-se de que o Firebase está configurado corretamente (.env)
 * 2. Execute: node src/scripts/seedDisciplinas.js
 * 3. Aguarde a confirmação de sucesso
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import DISCIPLINAS_TURMA_ANO from '../Disciplinas_Turma_Ano.js';

// Configuração do Firebase (usando variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_PATH = 'artifacts/default-app-id/public/data/disciplinas_turma_ano';

async function seedDisciplinas() {
  console.log('🚀 Iniciando população do Firebase com dados de disciplinas...\n');
  
  const turmas = Object.keys(DISCIPLINAS_TURMA_ANO);
  let sucessos = 0;
  let erros = 0;

  for (const turma of turmas) {
    try {
      const dados = DISCIPLINAS_TURMA_ANO[turma];
      const docRef = doc(db, COLLECTION_PATH, turma);
      
      await setDoc(docRef, {
        ano: dados.ano,
        disciplinas: dados.disciplinas,
        lastUpdated: new Date().toISOString(),
      });
      
      console.log(`✅ Turma ${turma} (${dados.ano}): ${dados.disciplinas.length} disciplinas adicionadas`);
      sucessos++;
    } catch (error) {
      console.error(`❌ Erro ao adicionar turma ${turma}:`, error.message);
      erros++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 RESUMO:`);
  console.log(`   ✅ Sucessos: ${sucessos}/${turmas.length}`);
  console.log(`   ❌ Erros: ${erros}/${turmas.length}`);
  console.log('='.repeat(60));
  
  if (sucessos === turmas.length) {
    console.log('\n🎉 Todos os dados foram adicionados com sucesso!');
    console.log('🔍 Verifique no Firebase Console:');
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
  } else {
    console.log('\n⚠️ Alguns dados não foram adicionados. Verifique os erros acima.');
  }
  
  process.exit(0);
}

// Executar o script
seedDisciplinas().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});