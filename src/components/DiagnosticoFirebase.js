import React, { useState } from "react";
import { motion } from "framer-motion";
import { db, storage, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

/**
 * Componente de Diagnóstico do Firebase
 * 
 * Este componente testa todas as configurações do Firebase:
 * - Autenticação
 * - Firestore (leitura e escrita)
 * - Storage (upload e leitura)
 * 
 * Use este componente para verificar se as regras estão corretas.
 */
function DiagnosticoFirebase() {
  const [resultados, setResultados] = useState([]);
  const [testando, setTestando] = useState(false);

  const adicionarResultado = (teste, sucesso, mensagem, detalhes = null) => {
    setResultados(prev => [...prev, {
      teste,
      sucesso,
      mensagem,
      detalhes,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const executarDiagnostico = async () => {
    setResultados([]);
    setTestando(true);

    try {
      // ========================================
      // TESTE 1: Autenticação
      // ========================================
      adicionarResultado("Autenticação", null, "Verificando autenticação...");
      
      const user = auth.currentUser;
      if (user) {
        adicionarResultado(
          "Autenticação",
          true,
          "✅ Usuário autenticado",
          `UID: ${user.uid}, Anônimo: ${user.isAnonymous}`
        );
      } else {
        adicionarResultado(
          "Autenticação",
          false,
          "❌ Nenhum usuário autenticado",
          "Execute signInAnonymously() primeiro"
        );
      }

      // ========================================
      // TESTE 2: Firestore - Leitura
      // ========================================
      adicionarResultado("Firestore Leitura", null, "Testando leitura do Firestore...");
      
      try {
        const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          adicionarResultado(
            "Firestore Leitura",
            true,
            "✅ Leitura bem-sucedida",
            `Documento existe. Semanas: ${data.semanas?.length || 0}`
          );
        } else {
          adicionarResultado(
            "Firestore Leitura",
            false,
            "⚠️ Documento não existe",
            "O documento 'current' não foi encontrado. Será criado no próximo teste."
          );
        }
      } catch (error) {
        adicionarResultado(
          "Firestore Leitura",
          false,
          "❌ Erro ao ler Firestore",
          `${error.code}: ${error.message}`
        );
      }

      // ========================================
      // TESTE 3: Firestore - Escrita
      // ========================================
      adicionarResultado("Firestore Escrita", null, "Testando escrita no Firestore...");
      
      try {
        const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
        const testData = {
          semanas: [],
          ultimoTeste: new Date().toISOString(),
          testeDiagnostico: true
        };
        
        await setDoc(docRef, testData, { merge: true });
        
        adicionarResultado(
          "Firestore Escrita",
          true,
          "✅ Escrita bem-sucedida",
          "Documento atualizado com sucesso"
        );
      } catch (error) {
        adicionarResultado(
          "Firestore Escrita",
          false,
          "❌ Erro ao escrever no Firestore",
          `${error.code}: ${error.message}`
        );
      }

      // ========================================
      // TESTE 4: Storage - Listar Arquivos
      // ========================================
      adicionarResultado("Storage Leitura", null, "Testando leitura do Storage...");
      
      try {
        const storageRef = ref(storage, "cardapios/");
        const result = await listAll(storageRef);
        
        adicionarResultado(
          "Storage Leitura",
          true,
          "✅ Leitura bem-sucedida",
          `Encontrados ${result.items.length} arquivos na pasta cardapios/`
        );
      } catch (error) {
        adicionarResultado(
          "Storage Leitura",
          false,
          "❌ Erro ao listar arquivos do Storage",
          `${error.code}: ${error.message}`
        );
      }

      // ========================================
      // TESTE 5: Storage - Upload
      // ========================================
      adicionarResultado("Storage Upload", null, "Testando upload no Storage...");
      
      try {
        // Criar uma imagem de teste (1x1 pixel PNG)
        const testImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        const response = await fetch(testImageData);
        const blob = await response.blob();
        
        const timestamp = Date.now();
        const filename = `teste_diagnostico_${timestamp}.png`;
        const storageRef = ref(storage, `cardapios/${filename}`);
        
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        
        adicionarResultado(
          "Storage Upload",
          true,
          "✅ Upload bem-sucedido",
          `Arquivo: ${filename}, URL: ${url.substring(0, 50)}...`
        );
      } catch (error) {
        adicionarResultado(
          "Storage Upload",
          false,
          "❌ Erro ao fazer upload no Storage",
          `${error.code}: ${error.message}`
        );
      }

      // ========================================
      // TESTE 6: Verificar Configuração
      // ========================================
      adicionarResultado("Configuração", null, "Verificando configuração do Firebase...");
      
      const config = {
        projectId: db.app.options.projectId,
        storageBucket: storage.app.options.storageBucket,
        authDomain: auth.app.options.authDomain
      };
      
      let configOk = true;
      let configProblemas = [];
      
      if (!config.projectId) {
        configOk = false;
        configProblemas.push("projectId não configurado");
      }
      if (!config.storageBucket) {
        configOk = false;
        configProblemas.push("storageBucket não configurado");
      }
      if (!config.authDomain) {
        configOk = false;
        configProblemas.push("authDomain não configurado");
      }
      
      if (configOk) {
        adicionarResultado(
          "Configuração",
          true,
          "✅ Configuração correta",
          `Projeto: ${config.projectId}, Bucket: ${config.storageBucket}`
        );
      } else {
        adicionarResultado(
          "Configuração",
          false,
          "❌ Problemas na configuração",
          configProblemas.join(", ")
        );
      }

    } catch (error) {
      adicionarResultado(
        "Erro Geral",
        false,
        "❌ Erro inesperado",
        error.message
      );
    } finally {
      setTestando(false);
    }
  };

  const getIcone = (sucesso) => {
    if (sucesso === null) return "⏳";
    return sucesso ? "✅" : "❌";
  };

  const getCorFundo = (sucesso) => {
    if (sucesso === null) return "bg-blue-50 border-blue-200";
    return sucesso ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔍 Diagnóstico do Firebase
        </h2>
        
        <p className="text-gray-600 mb-6">
          Este teste verifica se todas as configurações do Firebase estão corretas.
          Clique no botão abaixo para executar o diagnóstico completo.
        </p>

        <button
          onClick={executarDiagnostico}
          disabled={testando}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            testando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {testando ? "🔄 Executando testes..." : "▶️ Executar Diagnóstico"}
        </button>

        {resultados.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Resultados:
            </h3>
            
            {resultados.map((resultado, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-lg p-4 ${getCorFundo(resultado.sucesso)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getIcone(resultado.sucesso)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {resultado.teste}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {resultado.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {resultado.mensagem}
                    </p>
                    {resultado.detalhes && (
                      <div className="bg-white bg-opacity-50 rounded p-2 text-xs font-mono text-gray-600">
                        {resultado.detalhes}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Resumo Final */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">📋 Resumo:</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {resultados.filter(r => r.sucesso === true).length}
                  </div>
                  <div className="text-xs text-gray-600">Sucessos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {resultados.filter(r => r.sucesso === false).length}
                  </div>
                  <div className="text-xs text-gray-600">Falhas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {resultados.filter(r => r.sucesso === null).length}
                  </div>
                  <div className="text-xs text-gray-600">Em andamento</div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            {resultados.some(r => r.sucesso === false) && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Ações Recomendadas:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  {resultados.find(r => r.teste === "Autenticação" && r.sucesso === false) && (
                    <li>Verifique se a autenticação anônima está habilitada no Firebase Console</li>
                  )}
                  {resultados.find(r => r.teste === "Firestore Leitura" && r.sucesso === false) && (
                    <li>Verifique as regras do Firestore (allow read: if true)</li>
                  )}
                  {resultados.find(r => r.teste === "Firestore Escrita" && r.sucesso === false) && (
                    <li>Verifique as regras do Firestore (allow write: if request.auth != null)</li>
                  )}
                  {resultados.find(r => r.teste === "Storage Leitura" && r.sucesso === false) && (
                    <li>Verifique as regras do Storage (allow read: if true)</li>
                  )}
                  {resultados.find(r => r.teste === "Storage Upload" && r.sucesso === false) && (
                    <li>Verifique as regras do Storage (allow write: if request.auth != null)</li>
                  )}
                  {resultados.find(r => r.teste === "Configuração" && r.sucesso === false) && (
                    <li>Verifique o arquivo firebaseConfig.js e as variáveis de ambiente (.env)</li>
                  )}
                </ul>
              </div>
            )}

            {/* Sucesso Total */}
            {resultados.every(r => r.sucesso === true) && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h4 className="font-semibold text-green-800 text-lg">
                  Tudo Funcionando Perfeitamente!
                </h4>
                <p className="text-sm text-green-700 mt-2">
                  Todas as configurações do Firebase estão corretas.
                  O sistema de cardápios deve funcionar sem problemas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informações:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Este diagnóstico testa leitura e escrita no Firestore e Storage</li>
            <li>• Um arquivo de teste será criado em Storage/cardapios/</li>
            <li>• Você pode executar este teste quantas vezes quiser</li>
            <li>• Se houver falhas, verifique as regras do Firebase Console</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default DiagnosticoFirebase;