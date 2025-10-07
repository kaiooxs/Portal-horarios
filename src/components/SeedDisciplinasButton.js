import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import DISCIPLINAS_TURMA_ANO from '../Disciplinas_Turma_Ano.js';

/**
 * Componente para popular o Firebase com dados de disciplinas
 * Este botão deve ser usado apenas pelo administrador
 */
function SeedDisciplinasButton() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setResultado(null);
    setMostrarConfirmacao(false);

    // Debug: Verificar se os dados foram importados corretamente
    console.log('[SeedDisciplinasButton] DISCIPLINAS_TURMA_ANO:', DISCIPLINAS_TURMA_ANO);
    console.log('[SeedDisciplinasButton] Tipo:', typeof DISCIPLINAS_TURMA_ANO);
    console.log('[SeedDisciplinasButton] Keys:', Object.keys(DISCIPLINAS_TURMA_ANO || {}));

    if (!DISCIPLINAS_TURMA_ANO || typeof DISCIPLINAS_TURMA_ANO !== 'object') {
      setResultado({
        total: 0,
        sucessos: 0,
        erros: 1,
        detalhes: [{
          turma: 'N/A',
          status: 'erro',
          mensagem: 'Erro ao importar DISCIPLINAS_TURMA_ANO. Verifique o arquivo de dados.',
        }],
      });
      setLoading(false);
      return;
    }

    const COLLECTION_PATH = 'artifacts/default-app-id/public/data/disciplinas_turma_ano';
    const turmas = Object.keys(DISCIPLINAS_TURMA_ANO);
    let sucessos = 0;
    let erros = 0;
    const detalhes = [];

    console.log(`[SeedDisciplinasButton] Iniciando seed de ${turmas.length} turmas:`, turmas);

    for (const turma of turmas) {
      try {
        const dados = DISCIPLINAS_TURMA_ANO[turma];
        
        // Validar dados antes de enviar
        if (!dados || !dados.ano || !dados.disciplinas) {
          throw new Error(`Dados inválidos para turma ${turma}`);
        }

        const docRef = doc(db, COLLECTION_PATH, turma);
        
        await setDoc(docRef, {
          ano: dados.ano,
          disciplinas: dados.disciplinas,
          lastUpdated: new Date().toISOString(),
        });
        
        console.log(`[SeedDisciplinasButton] ✅ Turma ${turma} adicionada com sucesso`);
        
        detalhes.push({
          turma,
          status: 'sucesso',
          mensagem: `${dados.disciplinas.length} disciplinas adicionadas`,
        });
        sucessos++;
      } catch (error) {
        console.error(`[SeedDisciplinasButton] ❌ Erro na turma ${turma}:`, error);
        detalhes.push({
          turma,
          status: 'erro',
          mensagem: error.message,
        });
        erros++;
      }
    }

    setResultado({
      total: turmas.length,
      sucessos,
      erros,
      detalhes,
    });
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
      <div className="flex items-start gap-4">
        <span className="text-4xl">🔧</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-purple-800 mb-2">
            Configuração Inicial: Popular Disciplinas
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Este botão irá adicionar todas as disciplinas, professores e horas de cada turma no Firebase.
            <br />
            <strong className="text-purple-700">⚠️ Use apenas uma vez ou quando precisar resetar os dados!</strong>
          </p>

          {!mostrarConfirmacao ? (
            <button
              onClick={() => setMostrarConfirmacao(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md"
            >
              🚀 Popular Dados no Firebase
            </button>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-semibold mb-3">
                ⚠️ Tem certeza? Isso irá sobrescrever os dados existentes!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSeed}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Processando...' : '✅ Sim, Popular Agora'}
                </button>
                <button
                  onClick={() => setMostrarConfirmacao(false)}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center gap-3">
              <div className="animate-spin inline-block w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <span className="text-purple-700 font-semibold">Adicionando dados ao Firebase...</span>
            </div>
          )}

          {resultado && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              resultado.erros === 0 
                ? 'bg-green-50 border-green-300' 
                : 'bg-orange-50 border-orange-300'
            }`}>
              <h4 className="font-bold text-lg mb-2">
                {resultado.erros === 0 ? '🎉 Sucesso!' : '⚠️ Concluído com avisos'}
              </h4>
              <p className="text-sm mb-3">
                ✅ <strong>{resultado.sucessos}</strong> turmas adicionadas com sucesso
                {resultado.erros > 0 && (
                  <>
                    <br />
                    ❌ <strong>{resultado.erros}</strong> turmas com erro
                  </>
                )}
              </p>

              <details className="text-xs">
                <summary className="cursor-pointer font-semibold hover:text-purple-700">
                  📋 Ver detalhes
                </summary>
                <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                  {resultado.detalhes.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        item.status === 'sucesso' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <strong>{item.turma}:</strong> {item.mensagem}
                    </div>
                  ))}
                </div>
              </details>

              {resultado.erros === 0 && (
                <div className="mt-3 text-sm text-green-700">
                  <p>✅ Agora os professores poderão ver suas disciplinas e horas restantes!</p>
                  <p className="mt-1">
                    🔍 Verifique no{' '}
                    <a
                      href={`https://console.firebase.google.com/project/${process.env.REACT_APP_PROJECT_ID}/firestore`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-green-900"
                    >
                      Firebase Console
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeedDisciplinasButton;