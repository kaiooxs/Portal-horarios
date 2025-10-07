/**
 * 🔐 Diagnóstico de Permissões RBAC
 * 
 * Componente para testar e diagnosticar as permissões de acesso
 * baseadas em funções (Role-Based Access Control)
 */

import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  getUserFromFirestore,
  isAdmin,
  isProfessor,
  isAluno,
  getCurrentUserRole,
  getCurrentUserName,
  canModifyResource,
} from "../utils/userManager";

export default function DiagnosticoPermissoes() {
  const [resultados, setResultados] = useState([]);
  const [executando, setExecutando] = useState(false);

  const adicionarResultado = (teste, status, mensagem, detalhes = "") => {
    setResultados((prev) => [
      ...prev,
      {
        teste,
        status, // "sucesso", "erro", "aviso"
        mensagem,
        detalhes,
        timestamp: new Date().toLocaleTimeString("pt-PT"),
      },
    ]);
  };

  const executarDiagnostico = async () => {
    setResultados([]);
    setExecutando(true);

    try {
      // ========================================
      // TESTE 1: Verificar autenticação
      // ========================================
      adicionarResultado(
        "1. Autenticação",
        "executando",
        "Verificando autenticação do Firebase..."
      );

      const user = auth.currentUser;
      if (user) {
        adicionarResultado(
          "1. Autenticação",
          "sucesso",
          "Usuário autenticado com sucesso",
          `UID: ${user.uid}`
        );
      } else {
        adicionarResultado(
          "1. Autenticação",
          "erro",
          "Usuário não está autenticado",
          "Faça login novamente"
        );
        setExecutando(false);
        return;
      }

      // ========================================
      // TESTE 2: Verificar documento do usuário
      // ========================================
      adicionarResultado(
        "2. Documento do Usuário",
        "executando",
        "Buscando documento do usuário no Firestore..."
      );

      const userData = await getUserFromFirestore(user.uid);
      if (userData) {
        adicionarResultado(
          "2. Documento do Usuário",
          "sucesso",
          "Documento encontrado no Firestore",
          `Role: ${userData.role} | Nome: ${userData.name}`
        );
      } else {
        adicionarResultado(
          "2. Documento do Usuário",
          "erro",
          "Documento não encontrado no Firestore",
          "Faça logout e login novamente para criar o documento"
        );
        setExecutando(false);
        return;
      }

      // ========================================
      // TESTE 3: Verificar role
      // ========================================
      adicionarResultado(
        "3. Verificação de Role",
        "executando",
        "Verificando role do usuário..."
      );

      const role = await getCurrentUserRole();
      const name = await getCurrentUserName();

      if (role) {
        const roleEmoji = {
          admin: "👨‍💼",
          professor: "👨‍🏫",
          aluno: "👨‍🎓",
        };

        adicionarResultado(
          "3. Verificação de Role",
          "sucesso",
          `Role identificado: ${roleEmoji[role]} ${role.toUpperCase()}`,
          `Nome/Turma: ${name}`
        );
      } else {
        adicionarResultado(
          "3. Verificação de Role",
          "erro",
          "Não foi possível identificar o role",
          "Verifique o documento do usuário no Firestore"
        );
      }

      // ========================================
      // TESTE 4: Verificar funções de permissão
      // ========================================
      adicionarResultado(
        "4. Funções de Permissão",
        "executando",
        "Testando funções de verificação de permissão..."
      );

      const ehAdmin = await isAdmin();
      const ehProfessor = await isProfessor();
      const ehAluno = await isAluno();

      adicionarResultado(
        "4. Funções de Permissão",
        "sucesso",
        "Funções testadas com sucesso",
        `isAdmin: ${ehAdmin} | isProfessor: ${ehProfessor} | isAluno: ${ehAluno}`
      );

      // ========================================
      // TESTE 5: Verificar permissões de modificação
      // ========================================
      adicionarResultado(
        "5. Permissões de Modificação",
        "executando",
        "Testando permissões de modificação de recursos..."
      );

      const podeModificarMenu = await canModifyResource("menu");
      const podeModificarHorario = await canModifyResource("horario", {
        professor: name,
      });
      const podeModificarHorarioOutro = await canModifyResource("horario", {
        professor: "Outro Professor",
      });

      let permissoesDetalhes = `
        • Modificar cardápio: ${podeModificarMenu ? "✅ SIM" : "❌ NÃO"}
        • Modificar próprio horário: ${podeModificarHorario ? "✅ SIM" : "❌ NÃO"}
        • Modificar horário de outro: ${podeModificarHorarioOutro ? "✅ SIM" : "❌ NÃO"}
      `;

      adicionarResultado(
        "5. Permissões de Modificação",
        "sucesso",
        "Permissões verificadas",
        permissoesDetalhes
      );

      // ========================================
      // TESTE 6: Resumo das permissões esperadas
      // ========================================
      adicionarResultado(
        "6. Resumo de Permissões",
        "executando",
        "Gerando resumo das permissões esperadas..."
      );

      let resumo = "";
      if (ehAdmin) {
        resumo = `
          Como ADMIN, você deve ter:
          ✅ Acesso total de leitura e escrita
          ✅ Pode publicar cardápios
          ✅ Pode modificar todos os horários
          ✅ Pode modificar todas as horas restantes
          ✅ Pode modificar professores, turmas e disciplinas
        `;
      } else if (ehProfessor) {
        resumo = `
          Como PROFESSOR, você deve ter:
          ✅ Acesso de leitura a tudo
          ✅ Pode modificar apenas seus próprios horários
          ✅ Pode modificar apenas suas próprias horas restantes
          ❌ NÃO pode publicar cardápios
          ❌ NÃO pode modificar professores, turmas ou disciplinas
        `;
      } else if (ehAluno) {
        resumo = `
          Como ALUNO, você deve ter:
          ✅ Acesso de leitura a horários e cardápios
          ✅ Pode baixar cardápios
          ❌ NÃO pode modificar nada
          ❌ Interface de administração não está disponível
        `;
      }

      adicionarResultado(
        "6. Resumo de Permissões",
        "sucesso",
        "Resumo gerado com sucesso",
        resumo
      );

      // ========================================
      // CONCLUSÃO
      // ========================================
      adicionarResultado(
        "✅ Diagnóstico Concluído",
        "sucesso",
        "Todos os testes foram executados com sucesso!",
        "Verifique os resultados acima para confirmar suas permissões."
      );
    } catch (error) {
      adicionarResultado(
        "❌ Erro no Diagnóstico",
        "erro",
        "Ocorreu um erro durante o diagnóstico",
        `${error.message}\n\nStack: ${error.stack}`
      );
    } finally {
      setExecutando(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sucesso":
        return "bg-green-50 border-green-200 text-green-800";
      case "erro":
        return "bg-red-50 border-red-200 text-red-800";
      case "aviso":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "executando":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sucesso":
        return "✅";
      case "erro":
        return "❌";
      case "aviso":
        return "⚠️";
      case "executando":
        return "⏳";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔐 Diagnóstico de Permissões RBAC
        </h2>
        <p className="text-gray-600">
          Este diagnóstico verifica suas permissões de acesso baseadas em função
          (Role-Based Access Control). Execute o teste para confirmar que suas
          permissões estão configuradas corretamente.
        </p>
      </div>

      <button
        onClick={executarDiagnostico}
        disabled={executando}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          executando
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
        }`}
      >
        {executando ? "⏳ Executando Diagnóstico..." : "▶️ Executar Diagnóstico"}
      </button>

      {resultados.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📊 Resultados do Diagnóstico
          </h3>

          {resultados.map((resultado, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getStatusColor(
                resultado.status
              )}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getStatusIcon(resultado.status)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold">{resultado.teste}</h4>
                    <span className="text-xs opacity-75">
                      {resultado.timestamp}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{resultado.mensagem}</p>
                  {resultado.detalhes && (
                    <pre className="text-xs bg-white bg-opacity-50 p-2 rounded mt-2 whitespace-pre-wrap font-mono">
                      {resultado.detalhes}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Estatísticas */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">
              📈 Estatísticas
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {resultados.filter((r) => r.status === "sucesso").length}
                </div>
                <div className="text-xs text-gray-600">Sucessos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {resultados.filter((r) => r.status === "erro").length}
                </div>
                <div className="text-xs text-gray-600">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {resultados.filter((r) => r.status === "aviso").length}
                </div>
                <div className="text-xs text-gray-600">Avisos</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações adicionais */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informações</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Este diagnóstico verifica apenas as permissões no código</li>
          <li>• As regras do Firebase devem estar aplicadas corretamente</li>
          <li>• Se encontrar erros, consulte FIREBASE_REGRAS_RBAC.md</li>
          <li>• Em caso de problemas, faça logout e login novamente</li>
        </ul>
      </div>
    </div>
  );
}