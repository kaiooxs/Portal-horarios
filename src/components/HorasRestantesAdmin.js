import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PROFESSORES_EXEMPLO, TURMAS } from "../constants";
import { useDisciplinasTurmaAno } from "../hooks/useFirestore";
import { calcularHorasRestantes } from "../services/firestoreService";

function HorasRestantesAdmin() {
  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [recalculando, setRecalculando] = useState(false);
  
  const { disciplinasTurmaAno, loading } = useDisciplinasTurmaAno();

  // Definição de turmas por professor (mesma estrutura do ProfessorDashboard)
  const Curso_Cabeleireira = ["CC03", "CC04", "CC05"];
  const Curso_Termalismo = ["TE12", "TE13", "TE14"];
  const Curso_Programacao = ["PI01", "PI02"];
  const Curso_InformaticaGestao = ["IG01", "IG02"];

  const PROFESSOR_TURMAS = {
    "João Leite": [Curso_Programacao, Curso_InformaticaGestao],
    "Rui Silva": [Curso_Programacao, Curso_InformaticaGestao, Curso_Termalismo, Curso_Cabeleireira],
    "Telmo Baldaia": [Curso_Programacao, Curso_InformaticaGestao],
    "Sónia Pinto": [Curso_Programacao, Curso_Termalismo],
    "Natália Cardoso": [Curso_Programacao],
    "Rafaela Leite": [Curso_Cabeleireira, Curso_Termalismo],
    "Ana Teixeira": [Curso_Programacao, Curso_Cabeleireira],
    "Ricardo Silveira": [Curso_Programacao, Curso_InformaticaGestao, Curso_Termalismo, Curso_Cabeleireira],
    "Vera Rafaela": [Curso_Programacao, Curso_Termalismo],
    "Guilherme": [Curso_Termalismo, Curso_Cabeleireira],
    "Ana Costa": [Curso_Cabeleireira],
    "Catia": [Curso_Cabeleireira],
    "Madalena": [Curso_Cabeleireira],
    "Manuela Monteiro": [Curso_Programacao, Curso_Cabeleireira],
    "Carmen": [Curso_Cabeleireira, Curso_Termalismo],
    "Alexandra Cristina": [Curso_Cabeleireira, Curso_Termalismo],
    "Andreza": [Curso_Termalismo],
  };

  // Obter turmas do professor selecionado
  const turmasDoProfessor = professorSelecionado 
    ? (PROFESSOR_TURMAS[professorSelecionado] || []).flat()
    : [];

  // Resetar turma selecionada quando mudar o professor
  useEffect(() => {
    setTurmaSelecionada("");
  }, [professorSelecionado]);

  // Obter disciplinas do professor na turma selecionada
  const getDisciplinasProfessor = () => {
    if (!professorSelecionado || !turmaSelecionada || !disciplinasTurmaAno[turmaSelecionada]) {
      return [];
    }

    const turmaData = disciplinasTurmaAno[turmaSelecionada];
    const disciplinas = turmaData.disciplinas || [];

    // Filtrar disciplinas do professor
    return disciplinas.filter(d => d.professor === professorSelecionado);
  };

  const disciplinas = getDisciplinasProfessor();

  // Função para obter cor do badge baseado nas horas restantes
  const getCorBadge = (horasRestantes) => {
    if (horasRestantes === undefined || horasRestantes === null) {
      return "bg-gray-100 text-gray-600";
    }
    if (horasRestantes < 0) return "bg-red-100 text-red-700";
    if (horasRestantes === 0) return "bg-gray-100 text-gray-600";
    if (horasRestantes <= 10) return "bg-orange-100 text-orange-700";
    if (horasRestantes <= 20) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  // Função para recalcular horas
  const handleRecalcular = async () => {
    if (!window.confirm("Recalcular as horas restantes de todas as turmas?\n\nIsso irá atualizar os contadores baseado nos horários já atribuídos.")) {
      return;
    }
    
    setRecalculando(true);
    console.log("[HorasRestantesAdmin] Iniciando recálculo de horas...");
    
    try {
      const result = await calcularHorasRestantes();
      
      if (result.success) {
        alert("✅ Horas restantes recalculadas com sucesso!");
      } else {
        alert("❌ Erro ao recalcular horas: " + result.error);
      }
    } catch (error) {
      console.error("[HorasRestantesAdmin] Erro:", error);
      alert("❌ Erro ao recalcular horas: " + error.message);
    } finally {
      setRecalculando(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Carregando dados das disciplinas...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-2xl shadow-md"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ⏱️ Verificar Horas das Disciplinas
        </h2>
        <p className="text-gray-600">
          Selecione um professor e uma turma para visualizar as horas restantes de cada disciplina.
        </p>
      </div>

      {/* Botão de Recalcular */}
      <div className="mb-6">
        <button
          onClick={handleRecalcular}
          disabled={recalculando}
          className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
            recalculando 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 hover:shadow-xl"
          }`}
        >
          {recalculando ? "⏳ Recalculando..." : "🔄 Recalcular Horas Restantes"}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Clique para recalcular as horas de todas as turmas baseado nos horários atribuídos.
        </p>
      </div>

      {/* Seleção de Professor */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          👨‍🏫 Selecione o Professor:
        </label>
        <select
          value={professorSelecionado}
          onChange={(e) => setProfessorSelecionado(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">-- Selecione um professor --</option>
          {PROFESSORES_EXEMPLO.map((prof) => (
            <option key={prof} value={prof}>
              {prof}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de Turma */}
      {professorSelecionado && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <label className="block mb-2 font-semibold text-gray-700">
            📚 Selecione a Turma:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {turmasDoProfessor.map((turma) => {
              const isSelected = turmaSelecionada === turma;
              const temDados = disciplinasTurmaAno[turma] !== undefined;
              
              return (
                <button
                  key={turma}
                  onClick={() => setTurmaSelecionada(turma)}
                  disabled={!temDados}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg"
                      : temDados
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {turma}
                  {!temDados && " ⚠️"}
                </button>
              );
            })}
          </div>
          {turmasDoProfessor.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Este professor não tem turmas atribuídas.
            </p>
          )}
        </motion.div>
      )}

      {/* Tabela de Disciplinas */}
      {professorSelecionado && turmaSelecionada && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Disciplinas de {professorSelecionado} na Turma {turmaSelecionada}
          </h3>

          {disciplinas.length === 0 ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700 font-semibold">
                ⚠️ Nenhuma disciplina encontrada para este professor nesta turma.
              </p>
              <p className="text-yellow-600 text-sm mt-2">
                Verifique se as disciplinas foram configuradas corretamente no Firebase.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: Tabela */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
                    <tr>
                      <th className="px-4 py-3 border text-left font-bold text-gray-700">
                        Disciplina
                      </th>
                      <th className="px-4 py-3 border text-center font-bold text-gray-700">
                        Total (h)
                      </th>
                      <th className="px-4 py-3 border text-center font-bold text-gray-700">
                        Atribuídas (h)
                      </th>
                      <th className="px-4 py-3 border text-center font-bold text-gray-700">
                        Restantes (h)
                      </th>
                      <th className="px-4 py-3 border text-center font-bold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {disciplinas.map((disc, index) => {
                      const horasTotal = disc.horas || 0;
                      const horasAtribuidas = disc.horasAtribuidas || 0;
                      const horasRestantes = disc.horasRestantes !== undefined 
                        ? disc.horasRestantes 
                        : horasTotal;

                      return (
                        <tr key={index} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 border font-medium text-gray-800">
                            {disc.disciplina}
                          </td>
                          <td className="px-4 py-3 border text-center">
                            <span className="font-semibold text-gray-700">
                              {horasTotal}h
                            </span>
                          </td>
                          <td className="px-4 py-3 border text-center">
                            <span className="font-semibold text-blue-600">
                              {horasAtribuidas}h
                            </span>
                          </td>
                          <td className="px-4 py-3 border text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${getCorBadge(horasRestantes)}`}>
                              {horasRestantes}h
                            </span>
                          </td>
                          <td className="px-4 py-3 border text-center">
                            {horasRestantes < 0 ? (
                              <span className="text-red-600 font-bold">⚠️ Excedido</span>
                            ) : horasRestantes === 0 ? (
                              <span className="text-gray-600 font-bold">✅ Completo</span>
                            ) : (
                              <span className="text-green-600 font-bold">🟢 Em Progresso</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="md:hidden space-y-3">
                {disciplinas.map((disc, index) => {
                  const horasTotal = disc.horas || 0;
                  const horasAtribuidas = disc.horasAtribuidas || 0;
                  const horasRestantes = disc.horasRestantes !== undefined 
                    ? disc.horasRestantes 
                    : horasTotal;

                  return (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3">{disc.disciplina}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-700">{horasTotal}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Atribuídas:</span>
                          <span className="font-semibold text-blue-600">{horasAtribuidas}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Restantes:</span>
                          <span className={`px-3 py-1 rounded-full font-bold text-sm ${getCorBadge(horasRestantes)}`}>
                            {horasRestantes}h
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-gray-600">Status:</span>
                          {horasRestantes < 0 ? (
                            <span className="text-red-600 font-bold text-sm">⚠️ Excedido</span>
                          ) : horasRestantes === 0 ? (
                            <span className="text-gray-600 font-bold text-sm">✅ Completo</span>
                          ) : (
                            <span className="text-green-600 font-bold text-sm">🟢 Em Progresso</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="mt-6 bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-700 mb-2">📖 Legenda de Cores:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">
                      &gt;20h
                    </span>
                    <span className="text-gray-600">Muitas horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                      10-20h
                    </span>
                    <span className="text-gray-600">Moderado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-green-700 font-bold">
                      1-10h
                    </span>
                    <span className="text-gray-600">Poucas horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                      0h
                    </span>
                    <span className="text-gray-600">Completo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">
                      &lt;0h
                    </span>
                    <span className="text-gray-600">Excedido ⚠️</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Instruções */}
      {!professorSelecionado && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-500 text-lg">
            👆 Selecione um professor acima para começar
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default HorasRestantesAdmin;