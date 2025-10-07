import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_PATHS } from "../constants";

/**
 * Componente de Diagnóstico do Firebase
 * Verifica a estrutura de dados e identifica problemas
 */
function FirebaseDiagnostico() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const executarDiagnostico = async () => {
    setLoading(true);
    const resultado = {
      timestamp: new Date().toLocaleString("pt-PT"),
      colecoes: {},
      problemas: [],
      avisos: [],
      sucesso: [],
    };

    try {
      // 1. Verificar Professores
      try {
        const profSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.PROFESSORES));
        resultado.colecoes.professores = {
          existe: true,
          total: profSnapshot.size,
          documentos: profSnapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome,
            disciplinas: doc.data().disciplinas?.length || 0
          }))
        };
        resultado.sucesso.push(`✅ Coleção 'Professores' encontrada com ${profSnapshot.size} documentos`);
      } catch (err) {
        resultado.colecoes.professores = { existe: false, erro: err.message };
        resultado.problemas.push(`❌ Coleção 'Professores' não encontrada ou inacessível`);
      }

      // 2. Verificar Turmas
      try {
        const turmasSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.TURMAS));
        resultado.colecoes.turmas = {
          existe: true,
          total: turmasSnapshot.size,
          documentos: turmasSnapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome,
            curso: doc.data().curso
          }))
        };
        resultado.sucesso.push(`✅ Coleção 'Turmas' encontrada com ${turmasSnapshot.size} documentos`);
      } catch (err) {
        resultado.colecoes.turmas = { existe: false, erro: err.message };
        resultado.problemas.push(`❌ Coleção 'Turmas' não encontrada ou inacessível`);
      }

      // 3. Verificar Disciplinas por Turma/Ano (CRÍTICO)
      try {
        const discSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO));
        resultado.colecoes.disciplinas_turma_ano = {
          existe: true,
          total: discSnapshot.size,
          documentos: discSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ano: data.ano,
              curso: data.curso,
              totalDisciplinas: data.disciplinas?.length || 0,
              professores: [...new Set(data.disciplinas?.map(d => d.professor) || [])]
            };
          })
        };
        
        if (discSnapshot.size === 0) {
          resultado.problemas.push(`❌ CRÍTICO: Coleção 'disciplinas_turma_ano' está VAZIA!`);
          resultado.problemas.push(`   → Professores NÃO conseguirão ver suas disciplinas`);
          resultado.problemas.push(`   → Execute a migração de dados no AdminDashboard`);
        } else if (discSnapshot.size < 10) {
          resultado.avisos.push(`⚠️ Coleção 'disciplinas_turma_ano' tem apenas ${discSnapshot.size} documentos (esperado: 10)`);
        } else {
          resultado.sucesso.push(`✅ Coleção 'disciplinas_turma_ano' encontrada com ${discSnapshot.size} documentos`);
        }
      } catch (err) {
        resultado.colecoes.disciplinas_turma_ano = { existe: false, erro: err.message };
        resultado.problemas.push(`❌ CRÍTICO: Coleção 'disciplinas_turma_ano' NÃO EXISTE!`);
        resultado.problemas.push(`   → Esta é a causa principal do problema`);
        resultado.problemas.push(`   → Siga o guia: FIREBASE_CONFIGURACAO_MANUAL.md`);
      }

      // 4. Verificar Availabilities
      try {
        const availSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.AVAILABILITIES));
        resultado.colecoes.availabilities = {
          existe: true,
          total: availSnapshot.size,
          documentos: availSnapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome,
            turmas: doc.data().turmas?.length || 0
          }))
        };
        resultado.sucesso.push(`✅ Coleção 'availabilities' encontrada com ${availSnapshot.size} documentos`);
      } catch (err) {
        resultado.colecoes.availabilities = { existe: false, erro: err.message };
        resultado.avisos.push(`⚠️ Coleção 'availabilities' não encontrada (será criada quando professores salvarem disponibilidades)`);
      }

      // 5. Verificar Schedules
      try {
        const schedSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.SCHEDULES));
        resultado.colecoes.schedules = {
          existe: true,
          total: schedSnapshot.size,
          documentos: schedSnapshot.docs.map(doc => ({
            id: doc.id,
            published: doc.data().published,
            entries: doc.data().entries?.length || 0
          }))
        };
        resultado.sucesso.push(`✅ Coleção 'schedules' encontrada com ${schedSnapshot.size} documentos`);
      } catch (err) {
        resultado.colecoes.schedules = { existe: false, erro: err.message };
        resultado.avisos.push(`⚠️ Coleção 'schedules' não encontrada (será criada quando admin publicar horários)`);
      }

      // 6. Análise Final
      if (resultado.problemas.length === 0 && resultado.avisos.length === 0) {
        resultado.status = "✅ TUDO OK";
        resultado.mensagem = "Todas as coleções estão configuradas corretamente!";
      } else if (resultado.problemas.length > 0) {
        resultado.status = "❌ PROBLEMAS ENCONTRADOS";
        resultado.mensagem = "Há problemas críticos que precisam ser resolvidos.";
      } else {
        resultado.status = "⚠️ AVISOS";
        resultado.mensagem = "Sistema funcional, mas há avisos a considerar.";
      }

    } catch (err) {
      resultado.problemas.push(`❌ Erro geral ao executar diagnóstico: ${err.message}`);
      resultado.status = "❌ ERRO";
      resultado.mensagem = "Não foi possível completar o diagnóstico.";
    }

    setDiagnostico(resultado);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🔍 Diagnóstico do Firebase
        </h2>
        <button
          onClick={executarDiagnostico}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "⏳ Analisando..." : "🔍 Executar Diagnóstico"}
        </button>
      </div>

      {diagnostico && (
        <div className="space-y-4">
          {/* Status Geral */}
          <div className={`p-4 rounded-lg border-2 ${
            diagnostico.status.includes("✅") ? "bg-green-50 border-green-300" :
            diagnostico.status.includes("❌") ? "bg-red-50 border-red-300" :
            "bg-yellow-50 border-yellow-300"
          }`}>
            <h3 className="font-bold text-lg mb-2">{diagnostico.status}</h3>
            <p className="text-sm">{diagnostico.mensagem}</p>
            <p className="text-xs text-gray-500 mt-2">
              Executado em: {diagnostico.timestamp}
            </p>
          </div>

          {/* Problemas Críticos */}
          {diagnostico.problemas.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                ❌ Problemas Críticos ({diagnostico.problemas.length})
              </h4>
              <ul className="space-y-1">
                {diagnostico.problemas.map((problema, idx) => (
                  <li key={idx} className="text-sm text-red-700 font-mono">
                    {problema}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avisos */}
          {diagnostico.avisos.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                ⚠️ Avisos ({diagnostico.avisos.length})
              </h4>
              <ul className="space-y-1">
                {diagnostico.avisos.map((aviso, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">
                    {aviso}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sucessos */}
          {diagnostico.sucesso.length > 0 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                ✅ Verificações Bem-Sucedidas ({diagnostico.sucesso.length})
              </h4>
              <ul className="space-y-1">
                {diagnostico.sucesso.map((sucesso, idx) => (
                  <li key={idx} className="text-sm text-green-700">
                    {sucesso}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detalhes Técnicos */}
          <div className="border-2 border-gray-300 rounded-lg">
            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="w-full p-4 text-left font-semibold hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span>📊 Detalhes Técnicos das Coleções</span>
              <span>{mostrarDetalhes ? "▼" : "▶"}</span>
            </button>
            
            {mostrarDetalhes && (
              <div className="p-4 border-t-2 border-gray-300 bg-gray-50">
                <pre className="text-xs overflow-auto max-h-96 bg-white p-4 rounded border">
                  {JSON.stringify(diagnostico.colecoes, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Ações Recomendadas */}
          {diagnostico.problemas.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-3">🛠️ Ações Recomendadas</h4>
              <ol className="space-y-2 text-sm text-blue-700">
                <li>1. Leia o guia: <code className="bg-blue-100 px-2 py-1 rounded">FIREBASE_CONFIGURACAO_MANUAL.md</code></li>
                <li>2. Acesse o Firebase Console: <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.firebase.google.com</a></li>
                <li>3. Crie a coleção <code className="bg-blue-100 px-2 py-1 rounded">disciplinas_turma_ano</code></li>
                <li>4. Ou use o botão de migração no AdminDashboard</li>
                <li>5. Execute este diagnóstico novamente para verificar</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {!diagnostico && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">👆 Clique no botão acima para executar o diagnóstico</p>
          <p className="text-sm">
            Isso verificará se todas as coleções do Firebase estão configuradas corretamente
          </p>
        </div>
      )}
    </div>
  );
}

export default FirebaseDiagnostico;