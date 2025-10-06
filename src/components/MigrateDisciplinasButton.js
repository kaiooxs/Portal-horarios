import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";

/**
 * Componente para migrar dados existentes do Firebase para a estrutura esperada
 * 
 * Lê dados de:
 * - public/data/Turmas/{turmaId}
 * - public/data/Professores/{professorId}
 * 
 * E cria:
 * - artifacts/default-app-id/public/data/disciplinas_turma_ano/{turmaId}
 */

const TURMAS = ["PI01", "PI02", "IG01", "IG02", "CC03", "CC04", "CC05", "TE12", "TE13", "TE14"];

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

const HORAS_PADRAO = 150;

function MigrateDisciplinasButton() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [detalhes, setDetalhes] = useState([]);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const handleMigrate = async () => {
    setLoading(true);
    setResultado(null);
    setDetalhes([]);
    setMostrarConfirmacao(false);

    const logs = [];
    let sucessos = 0;
    let erros = 0;

    try {
      logs.push({ tipo: 'info', msg: '🚀 Iniciando migração de disciplinas...' });

      // 1. Buscar dados das turmas
      logs.push({ tipo: 'info', msg: '📚 Buscando dados das turmas...' });
      const turmasData = {};
      
      for (const turmaId of TURMAS) {
        try {
          const turmaDoc = await getDoc(doc(db, `public/data/Turmas/${turmaId}`));
          if (turmaDoc.exists()) {
            turmasData[turmaId] = turmaDoc.data();
            logs.push({ tipo: 'sucesso', turma: turmaId, msg: `Turma encontrada: ${turmasData[turmaId].nome || 'Sem nome'}` });
          } else {
            logs.push({ tipo: 'aviso', turma: turmaId, msg: 'Documento não encontrado' });
          }
        } catch (error) {
          logs.push({ tipo: 'erro', turma: turmaId, msg: `Erro ao buscar: ${error.message}` });
        }
      }

      // 2. Buscar dados dos professores
      logs.push({ tipo: 'info', msg: '👨‍🏫 Buscando dados dos professores...' });
      const professoresSnapshot = await getDocs(collection(db, 'public/data/Professores'));
      const professoresData = {};
      
      professoresSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        professoresData[data.nome] = data;
        logs.push({ tipo: 'sucesso', msg: `Professor: ${data.nome} (${data.disciplinas?.length || 0} disciplinas)` });
      });

      // 3. Criar estrutura disciplinas_turma_ano
      logs.push({ tipo: 'info', msg: '🔧 Criando estrutura disciplinas_turma_ano...' });
      
      for (const turmaId of TURMAS) {
        const turmaInfo = turmasData[turmaId];
        if (!turmaInfo) {
          logs.push({ tipo: 'aviso', turma: turmaId, msg: 'Pulando (sem dados)' });
          continue;
        }

        // Criar array de disciplinas para esta turma
        const disciplinas = [];
        
        // Para cada professor, adicionar suas disciplinas
        for (const [professorNome, professorInfo] of Object.entries(professoresData)) {
          const disciplinasDoProfessor = PROFESSOR_DISCIPLINAS[professorNome] || professorInfo.disciplinas || [];
          
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
          lastUpdated: serverTimestamp()
        };

        try {
          await setDoc(doc(db, `artifacts/default-app-id/public/data/disciplinas_turma_ano/${turmaId}`), docData);
          logs.push({ tipo: 'sucesso', turma: turmaId, msg: `${disciplinas.length} disciplinas criadas` });
          sucessos++;
        } catch (error) {
          logs.push({ tipo: 'erro', turma: turmaId, msg: `Erro ao salvar: ${error.message}` });
          erros++;
        }
      }

      setResultado({
        tipo: erros === 0 ? 'sucesso' : 'parcial',
        sucessos,
        erros,
        total: TURMAS.length,
        professores: Object.keys(professoresData).length
      });

    } catch (error) {
      logs.push({ tipo: 'erro', msg: `Erro geral: ${error.message}` });
      setResultado({
        tipo: 'erro',
        mensagem: error.message
      });
    }

    setDetalhes(logs);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl">🔄</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Migrar Dados Existentes do Firebase
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Este botão irá ler os dados existentes das coleções <code className="bg-white px-2 py-1 rounded">public/data/Turmas</code> e{' '}
            <code className="bg-white px-2 py-1 rounded">public/data/Professores</code> e criar a estrutura{' '}
            <code className="bg-white px-2 py-1 rounded">disciplinas_turma_ano</code> necessária para o sistema funcionar.
          </p>

          {!mostrarConfirmacao ? (
            <button
              onClick={() => setMostrarConfirmacao(true)}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Migrar Dados
            </button>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-yellow-800 mb-3">
                ⚠️ Confirmar Migração
              </p>
              <p className="text-sm text-yellow-700 mb-4">
                Esta ação irá criar/sobrescrever os dados em <code>disciplinas_turma_ano</code>. Deseja continuar?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleMigrate}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  ✅ Sim, Migrar
                </button>
                <button
                  onClick={() => setMostrarConfirmacao(false)}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center gap-3 text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
              <span className="font-medium">Migrando dados...</span>
            </div>
          )}

          {resultado && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              resultado.tipo === 'sucesso' 
                ? 'bg-green-50 border-green-300' 
                : resultado.tipo === 'parcial'
                ? 'bg-yellow-50 border-yellow-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <p className="font-semibold mb-2">
                {resultado.tipo === 'sucesso' && '✅ Migração concluída com sucesso!'}
                {resultado.tipo === 'parcial' && '⚠️ Migração concluída com avisos'}
                {resultado.tipo === 'erro' && '❌ Erro durante a migração'}
              </p>
              
              {resultado.tipo !== 'erro' && (
                <div className="text-sm space-y-1">
                  <p>📊 <strong>Turmas processadas:</strong> {resultado.total}</p>
                  <p>✅ <strong>Sucessos:</strong> {resultado.sucessos}</p>
                  {resultado.erros > 0 && <p>❌ <strong>Erros:</strong> {resultado.erros}</p>}
                  <p>👨‍🏫 <strong>Professores encontrados:</strong> {resultado.professores}</p>
                </div>
              )}

              {resultado.tipo === 'erro' && (
                <p className="text-sm text-red-700">{resultado.mensagem}</p>
              )}

              <button
                onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {mostrarDetalhes ? '▼ Ocultar detalhes' : '▶ Ver detalhes'}
              </button>

              {mostrarDetalhes && (
                <div className="mt-3 bg-white p-3 rounded border max-h-64 overflow-y-auto text-xs font-mono">
                  {detalhes.map((log, idx) => (
                    <div key={idx} className={`mb-1 ${
                      log.tipo === 'erro' ? 'text-red-600' :
                      log.tipo === 'aviso' ? 'text-yellow-600' :
                      log.tipo === 'sucesso' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {log.turma && `[${log.turma}] `}{log.msg}
                    </div>
                  ))}
                </div>
              )}

              <a
                href={`https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-purple-600 hover:text-purple-800 font-medium underline"
              >
                🔗 Abrir Firebase Console
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MigrateDisciplinasButton;