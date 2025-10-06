/**
 * Script para migrar dados existentes do Firebase para a estrutura esperada
 * 
 * Este script lê os dados de:
 * - public/data/Turmas/{turmaId} (informações da turma)
 * - public/data/Professores/{professorId} (disciplinas do professor)
 * 
 * E cria:
 * - artifacts/default-app-id/public/data/disciplinas_turma_ano/{turmaId}
 */

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

// Mapeamento de professores para disciplinas (baseado no seu código)
const PROFESSOR_DISCIPLINAS = {
  "João Leite": ["Redes", "Arquitetura interna do computador", "Sistemas Operativos", "CloudOps e Cloud Automation"],
  "Rui Silva": ["Algoritmos", "TIC", "Fundamentos de Python", "Estágio Formativo"],
  "Telmo Baldaia": ["HTML e CSS", "JavaScript", "Desenvolvimento Web", "MySQL"],
  "Sónia Pinto": ["Matemática"],
  "Natália Cardoso": ["Português"],
  "Rafaela Leite": ["Português"],
  "Ana Teixeira": ["Inglês"],
  "Ricardo Silveira": ["Educação Física"],
  "Vera Rafaela": ["Física e Química"],
  "Guilherme": ["Área de Integração", "Prova de Aptidão Profissonal", "Estágio Formativo"],
  "Ana Costa": ["Cortes de Cabelo - Principios", "Cortes de Cabelo - Tecnicas", "Postiço - Aplicação - Postiço - Aplicação e Manutenção"],
  "Catia": ["Tecnicas de Cortes de Cabelo Feminino", "Extensões e Alongamento do Cabelo"],
  "Madalena": ["Tecnicas de Cortes de Cabelo Masculino", "Cuidados Especificos com a Barba e Bigode", "Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode"],
  "Manuela Monteiro": ["Prova de Aptidão Profissional", "Estágio Formativo"],
  "Carmen": ["Física e Química"],
  "Alexandra Cristina": ["Inglês"],
  "Andreza": ["Termalismo e Hidroginástica"],
};

// Turmas disponíveis
const TURMAS = ["PI01", "PI02", "IG01", "IG02", "CC03", "CC04", "CC05", "TE12", "TE13", "TE14"];

// Horas padrão por disciplina (você pode ajustar conforme necessário)
const HORAS_PADRAO = 150;

async function migrateDisciplinas() {
  console.log('🚀 Iniciando migração de disciplinas...\n');

  try {
    // 1. Buscar dados das turmas
    console.log('📚 Buscando dados das turmas...');
    const turmasData = {};
    
    for (const turmaId of TURMAS) {
      try {
        const turmaDoc = await db.doc(`public/data/Turmas/${turmaId}`).get();
        if (turmaDoc.exists) {
          turmasData[turmaId] = turmaDoc.data();
          console.log(`  ✅ ${turmaId}: ${turmasData[turmaId].nome || 'Sem nome'}`);
        } else {
          console.log(`  ⚠️  ${turmaId}: Documento não encontrado`);
        }
      } catch (error) {
        console.log(`  ❌ ${turmaId}: Erro ao buscar - ${error.message}`);
      }
    }

    // 2. Buscar dados dos professores
    console.log('\n👨‍🏫 Buscando dados dos professores...');
    const professoresSnapshot = await db.collection('public/data/Professores').get();
    const professoresData = {};
    
    professoresSnapshot.forEach(doc => {
      const data = doc.data();
      professoresData[data.nome] = data;
      console.log(`  ✅ ${data.nome}: ${data.disciplinas?.length || 0} disciplinas`);
    });

    // 3. Criar estrutura disciplinas_turma_ano
    console.log('\n🔧 Criando estrutura disciplinas_turma_ano...');
    
    for (const turmaId of TURMAS) {
      const turmaInfo = turmasData[turmaId];
      if (!turmaInfo) {
        console.log(`  ⏭️  ${turmaId}: Pulando (sem dados)`);
        continue;
      }

      // Criar array de disciplinas para esta turma
      const disciplinas = [];
      
      // Para cada professor, verificar se ele leciona nesta turma
      for (const [professorNome, professorInfo] of Object.entries(professoresData)) {
        const disciplinasDoProfessor = PROFESSOR_DISCIPLINAS[professorNome] || professorInfo.disciplinas || [];
        
        // Adicionar cada disciplina do professor
        disciplinasDoProfessor.forEach(disciplina => {
          disciplinas.push({
            disciplina: disciplina,
            professor: professorNome,
            horas: HORAS_PADRAO
          });
        });
      }

      // Salvar no Firebase
      const docData = {
        ano: turmaInfo['Ano Letivo'] || turmaInfo.ano || "2024/2025",
        curso: turmaInfo.Curso || turmaInfo.curso || "Curso",
        disciplinas: disciplinas,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      };

      try {
        await db.doc(`artifacts/default-app-id/public/data/disciplinas_turma_ano/${turmaId}`).set(docData);
        console.log(`  ✅ ${turmaId}: ${disciplinas.length} disciplinas criadas`);
      } catch (error) {
        console.log(`  ❌ ${turmaId}: Erro ao salvar - ${error.message}`);
      }
    }

    console.log('\n✨ Migração concluída com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  - Turmas processadas: ${TURMAS.length}`);
    console.log(`  - Professores encontrados: ${Object.keys(professoresData).length}`);
    console.log('\n🔗 Verifique no Firebase Console:');
    console.log(`  https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore/data/~2Fartifacts~2Fdefault-app-id~2Fpublic~2Fdata~2Fdisciplinas_turma_ano`);

  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    throw error;
  }
}

// Executar migração
migrateDisciplinas()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script finalizado com erro:', error);
    process.exit(1);
  });