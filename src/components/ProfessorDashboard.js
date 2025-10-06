import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseConfig";
import { doc, setDoc, onSnapshot, collection, query, where, serverTimestamp } from "firebase/firestore";
import { DAYS_OF_WEEK, TIME_SLOTS, TURMAS } from "../constants";
import { normalizarNome } from "../utils/helpers";
import ScheduleGrid from "./ScheduleGrid";
import MenuSemanal from "./MenuSemanal";
import { useDisciplinasTurmaAno } from "../hooks/useFirestore";

function ProfessorDashboard({ professorNameFromLogin }) {
  const [nome, setNome] = useState(professorNameFromLogin || "");
  const [minhasTurmas, setMinhasTurmas] = useState([]);
  const [disciplinaByTurma, setDisciplinaByTurma] = useState({});
  const [slotsMap, setSlotsMap] = useState({});
  const [meusHorarios, setMeusHorarios] = useState([]);
  const [msgConfirmacao, setMsgConfirmacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvamentoManual, setSalvamentoManual] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  //Buscar dados do Firebase
  const { disciplinasTurmaAno, loading: loadingDisciplinas } = useDisciplinasTurmaAno();
  const [erroCarregamento, setErroCarregamento] = useState(false);
  
  // Debug: Verificar dados carregados
  useEffect(() => {
    if (!loadingDisciplinas) {
      console.log("[ProfessorDashboard] Disciplinas carregadas:", disciplinasTurmaAno);
      console.log("[ProfessorDashboard] Total de turmas com dados:", Object.keys(disciplinasTurmaAno).length);
      
      // Verificar se há dados
      if (Object.keys(disciplinasTurmaAno).length === 0) {
        console.warn("[ProfessorDashboard] ⚠️ AVISO: Nenhuma disciplina encontrada no Firebase!");
        console.warn("[ProfessorDashboard] Verifique se a coleção 'disciplinas_turma_ano' existe no Firestore");
        setErroCarregamento(true);
      } else {
        setErroCarregamento(false);
      }
    }
  }, [disciplinasTurmaAno, loadingDisciplinas]);

  // Definição de turmas por curso
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

  // Carregar dados do professor
  useEffect(() => {
    if (!nome) return;
    const docId = nome.toLowerCase().replace(/\s+/g, "_");
    const docRef = doc(db, "artifacts/default-app-id/public/data/availabilities", docId);
    
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMinhasTurmas(data.turmas || []);
        setDisciplinaByTurma(data.disciplinaByTurma || {});
        const m = {};
        (data.slots || []).forEach((s) => {
          if (!m[s.dia]) m[s.dia] = [];
          if (!m[s.dia].includes(s.hora)) m[s.dia].push(s.hora);
        });
        (data.almocosAgendados || []).forEach((dia) => {
          if (!m[dia]) m[dia] = [];
          if (!m[dia].includes("Almoço")) m[dia].push("Almoço");
        });
        setSlotsMap(m);

        if (salvamentoManual) {
          const agora = new Date().toLocaleTimeString("pt-PT");
          setMsgConfirmacao(`✅ Disponibilidades guardadas em ${agora}`);
          setSalvamentoManual(false);
          setTimeout(() => setMsgConfirmacao(""), 3000);
        }
      }
    });
    return () => unsub();
  }, [nome, salvamentoManual]);

  // Carregar horários publicados
  useEffect(() => {
    if (!nome) return;
    const q = query(
      collection(db, "artifacts/default-app-id/public/data/schedules"),
      where("published", "==", true)
    );
    const unsub = onSnapshot(q, (snap) => {
      const mySchedules = snap.docs
        .map((d) => ({ turma: d.id, ...d.data() }))
        .map((s) => ({
          ...s,
          entries: (s.entries || []).filter((e) => e.professor === nome),
        }))
        .filter((s) => (s.entries || []).length > 0);
      setMeusHorarios(mySchedules);
    });
    return () => unsub();
  }, [nome]);

  const turmasDoProfessor = (PROFESSOR_TURMAS[nome] || TURMAS).flat();
  const disciplinasDoProfessor = PROFESSOR_DISCIPLINAS[nome] || [];

  const toggleTurma = (t) =>
    setMinhasTurmas((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t]
    );

  const toggleHora = (dia, hora) => {
    setSlotsMap((p) => {
      const copy = { ...p };
      if (!Array.isArray(copy[dia])) copy[dia] = [];
      copy[dia] = copy[dia].includes(hora)
        ? copy[dia].filter((h) => h !== hora)
        : [...copy[dia], hora];
      return copy;
    });
  };

  const handleToggleAllDay = (dia) => {
    setSlotsMap((p) => ({
      ...p,
      [dia]: TIME_SLOTS.every((h) => (p[dia] || []).includes(h))
        ? []
        : [...TIME_SLOTS],
    }));
  };

  const handleSelectAllTurmas = () => {
    if (minhasTurmas.length === TURMAS.length) {
      setMinhasTurmas([]);
    } else {
      setMinhasTurmas([...TURMAS]);
    }
  };

  const handleApplyDisciplineToAll = () => {
    if (minhasTurmas.length === 0) return;
    const disciplinaBase = disciplinaByTurma[minhasTurmas[0]] || "";
    const todasIguais = minhasTurmas.every(
      (t) => disciplinaByTurma[t] === disciplinaBase && disciplinaBase !== ""
    );
    if (todasIguais) {
      const novas = {};
      minhasTurmas.forEach((t) => {
        novas[t] = "";
      });
      setDisciplinaByTurma(novas);
    } else {
      if (!disciplinaBase) {
        alert("Selecione uma disciplina para a primeira turma.");
        return;
      }
      const novas = {};
      minhasTurmas.forEach((t) => {
        novas[t] = disciplinaBase;
      });
      setDisciplinaByTurma(novas);
    }
  };

  const handleSaveDisponibilidades = async () => {
    if (!nome) return alert("Preencha o seu nome.");

    setSalvando(true);
    setMsgConfirmacao("⏳ Salvando...");
    setSalvamentoManual(true);

    const slots = [];
    const almocosAgendados = [];

    Object.entries(slotsMap).forEach(([dia, horas]) => {
      (horas || []).forEach((hora) => {
        if (hora === "Almoço") {
          if (!almocosAgendados.includes(dia)) almocosAgendados.push(dia);
        } else {
          minhasTurmas.forEach((t) => {
            slots.push({
              dia,
              hora,
              turma: t,
              disciplina: disciplinaByTurma[t] || "",
            });
          });
        }
      });
    });

    const id = (nome || "").toLowerCase().replace(/\s+/g, "_");

    try {
      await setDoc(
        doc(db, "artifacts/default-app-id/public/data/availabilities", id),
        {
          nome,
          turmas: minhasTurmas,
          disciplinaByTurma,
          slots,
          almocosAgendados,
          lastUpdated: serverTimestamp(),
        }
      );
    } catch (err) {
      console.error("Erro ao salvar disponibilidades:", err);
      setMsgConfirmacao("❌ Erro ao salvar disponibilidades");
      setSalvamentoManual(false);
      setTimeout(() => setMsgConfirmacao(""), 10000);
    }
    setSalvando(false);
  };

  return (
    <div className="space-y-6">
      {/* 🔥 Botões de navegação */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setMostrarMenu(false)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            !mostrarMenu
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          📅 Disponibilidades & Horários
        </button>
        <button
          onClick={() => setMostrarMenu(true)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            mostrarMenu
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          🍽️ Cardápio
        </button>
      </div>

      {/*Conteúdo condicional */}
      {mostrarMenu ? (
        <MenuSemanal />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">
            Professor — Minhas Disponibilidades
          </h2>

          <label className="block mb-2 font-medium">Seu nome</label>
          <input
            value={nome}
            readOnly
            className="border p-2 rounded w-full mb-3 bg-gray-100 text-gray-600"
          />

      {/*NOVA SEÇÃO: Seleção Múltipla de Turmas para Comparação */}
      <div className="mb-6 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
        <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
          📊 Comparar Disciplinas e Horas entre Turmas
        </h3>
        
        {/* Seleção de múltiplas turmas */}
        <div className="mb-3">
          <label className="block mb-2 font-medium text-sm">
            Selecione as turmas que deseja comparar:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {turmasDoProfessor.map((t) => {
              const isSelected = turmaSelecionada.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    if (isSelected) {
                      setTurmaSelecionada(turmaSelecionada.filter(x => x !== t));
                    } else {
                      setTurmaSelecionada([...turmaSelecionada, t]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          
          {/* Botões de ação rápida */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setTurmaSelecionada([...turmasDoProfessor])}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
            >
              ✅ Selecionar Todas
            </button>
            <button
              onClick={() => setTurmaSelecionada([])}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              ❌ Limpar Seleção
            </button>
          </div>
        </div>

        {/* Exibição das disciplinas por turma */}
        {loadingDisciplinas ? (
          <div className="text-gray-500 mt-2 text-center py-4">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2">Carregando disciplinas...</p>
          </div>
        ) : erroCarregamento ? (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-yellow-800 mb-2">Dados de Disciplinas Não Encontrados</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  A coleção <code className="bg-yellow-100 px-2 py-1 rounded">disciplinas_turma_ano</code> não foi encontrada no Firebase.
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Isso significa que as informações sobre disciplinas, professores e horas restantes ainda não foram configuradas no banco de dados.
                </p>
                <details className="text-xs text-yellow-600">
                  <summary className="cursor-pointer font-semibold hover:text-yellow-800">
                    🔧 Como resolver (para administradores)
                  </summary>
                  <div className="mt-2 pl-4 border-l-2 border-yellow-300">
                    <p className="mb-1">1. Acesse o Firebase Console</p>
                    <p className="mb-1">2. Vá em Firestore Database</p>
                    <p className="mb-1">3. Crie a coleção: <code className="bg-yellow-100 px-1 rounded">artifacts/default-app-id/public/data/disciplinas_turma_ano</code></p>
                    <p>4. Adicione documentos para cada turma com as disciplinas e professores</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        ) : turmaSelecionada.length > 0 ? (
          <div className="space-y-4 mt-4">
            {turmaSelecionada.map((turma) => {
              // Buscar disciplinas da turma com comparação melhorada
              const disciplinasDaTurmaAtual = disciplinasTurmaAno[turma]
                ? (disciplinasTurmaAno[turma].disciplinas || []).filter((d) => {
                    if (!d.professor || !nome) return false;
                    
                    // Normalizar ambos os nomes (remove acentos, lowercase, trim)
                    const profNormalizado = normalizarNome(d.professor.trim());
                    const nomeNormalizado = normalizarNome(nome.trim());
                    
                    // Comparação exata
                    if (profNormalizado === nomeNormalizado) return true;
                    
                    // Comparação parcial (caso o nome esteja incompleto)
                    if (profNormalizado.includes(nomeNormalizado) || nomeNormalizado.includes(profNormalizado)) {
                      return true;
                    }
                    
                    return false;
                  })
                : [];

              // Debug: mostrar informações para diagnóstico
              if (turmaSelecionada.length > 0 && disciplinasTurmaAno[turma]) {
                const professoresDaTurma = (disciplinasTurmaAno[turma].disciplinas || []).map(d => d.professor);
                const professoresNormalizados = professoresDaTurma.map(p => normalizarNome(p));
                const nomeNormalizado = normalizarNome(nome);
                
                console.log(`[DEBUG] Turma ${turma}:`, {
                  professorLogado: nome,
                  professorNormalizado: nomeNormalizado,
                  totalDisciplinas: (disciplinasTurmaAno[turma].disciplinas || []).length,
                  disciplinasEncontradas: disciplinasDaTurmaAtual.length,
                  professoresDaTurma: professoresDaTurma,
                  professoresNormalizados: professoresNormalizados,
                  match: professoresNormalizados.includes(nomeNormalizado)
                });
                
                // Aviso se não encontrar disciplinas
                if (disciplinasDaTurmaAtual.length === 0 && professoresDaTurma.length > 0) {
                  console.warn(`[DEBUG] ⚠️ Professor "${nome}" não encontrado na turma ${turma}`);
                  console.warn(`[DEBUG] Professores disponíveis:`, professoresDaTurma);
                }
              }

              return (
                <div key={turma} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                    <h4 className="font-bold text-lg text-blue-700">Turma: {turma}</h4>
                    {disciplinasTurmaAno[turma] && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        📅 Ano Letivo: {disciplinasTurmaAno[turma].ano}
                      </span>
                    )}
                  </div>

                  {disciplinasDaTurmaAtual.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                        <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
                          <tr>
                            <th className="px-3 py-2 border text-left">Disciplina</th>
                            <th className="px-3 py-2 border text-center w-32">Horas Restantes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {disciplinasDaTurmaAtual.map((d, idx) => {
                            // Tentar múltiplos campos possíveis para horas
                            const horasRestantes = d.horasRestantes ?? d.horas ?? d.horasSemanais ?? d.cargaHoraria ?? 0;
                            
                            return (
                              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                <td className="border px-3 py-2">{d.disciplina}</td>
                                <td className="border px-3 py-2 text-center font-bold">
                                  <span className={`inline-block px-3 py-1 rounded-full ${
                                    horasRestantes > 20 ? "bg-green-100 text-green-700" :
                                    horasRestantes > 10 ? "bg-yellow-100 text-yellow-700" :
                                    horasRestantes > 0 ? "bg-red-100 text-red-700" :
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {horasRestantes > 0 ? `${horasRestantes}h` : "Sem dados"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                      <p className="mb-2">ℹ️ Nenhuma disciplina atribuída a você para esta turma.</p>
                      {disciplinasTurmaAno[turma] && (disciplinasTurmaAno[turma].disciplinas || []).length > 0 && (
                        <p className="text-xs text-gray-400">
                          Professores nesta turma: {(disciplinasTurmaAno[turma].disciplinas || []).map(d => d.professor).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            👆 Selecione uma ou mais turmas acima para ver suas disciplinas e horas restantes
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={handleSelectAllTurmas}
          className="bg-blue-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          {minhasTurmas.length === TURMAS.length ? "Desmarcar Todas as Turmas" : "Selecionar Todas as Turmas"}
        </button>
      </div>

      <label className="block mb-2 font-medium">Turmas que leciona</label>
      <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {turmasDoProfessor.map((t) => (
          <label key={t} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={minhasTurmas.includes(t)}
              onChange={() => toggleTurma(t)}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>

      {minhasTurmas.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Disciplina por turma</label>
          </div>
          <button
            onClick={handleApplyDisciplineToAll}
            className="bg-blue-300 px-3 py-1 rounded hover:bg-blue-400 mb-3"
          >
            {minhasTurmas.length > 0 &&
              minhasTurmas.every(
                (t) => disciplinaByTurma[t] === disciplinaByTurma[minhasTurmas[0]] && disciplinaByTurma[minhasTurmas[0]] !== ""
              )
              ? "Limpar Disciplinas de Todas as Turmas"
              : "Mesma Disciplina para Todas as Turmas"}
          </button>
          <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {turmasDoProfessor.filter(t => minhasTurmas.includes(t)).map((t) => (
              <div key={t} className="flex gap-2 items-center">
                <div className="w-24 font-medium">{t}</div>
                <select
                  value={disciplinaByTurma[t] || ""}
                  onChange={(e) =>
                    setDisciplinaByTurma((p) => ({ ...p, [t]: e.target.value }))
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Escolha disciplina</option>
                  {disciplinasDoProfessor.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      <label className="block mb-2 font-medium text-lg">📅 Marque os horários disponíveis</label>
      
      {/*LAYOUT RESPONSIVO: Grid em desktop, scroll horizontal em mobile */}
      <div className="mb-4">
        {/* Desktop: Grid de 5 colunas */}
        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {DAYS_OF_WEEK.map((dia) => {
            const areAllSelected = TIME_SLOTS.every((hora) =>
              (slotsMap[dia] || []).includes(hora)
            );
            return (
              <div
                key={dia}
                className="border-2 border-gray-300 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold mb-3 text-center text-blue-700 text-sm">{dia}</h4>
                <div className="flex flex-col gap-2">
                  {TIME_SLOTS.map((hora) => (
                    <label key={hora} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={(slotsMap[dia] || []).includes(hora)}
                        onChange={() => toggleHora(dia, hora)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs">{hora}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => handleToggleAllDay(dia)}
                  className="mt-3 w-full bg-blue-500 text-white text-xs py-2 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                >
                  {areAllSelected ? "❌ Desmarcar" : "✅ Marcar Todos"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile: Scroll horizontal com cards maiores */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
          {DAYS_OF_WEEK.map((dia) => {
            const areAllSelected = TIME_SLOTS.every((hora) =>
              (slotsMap[dia] || []).includes(hora)
            );
            return (
              <div
                key={dia}
                className="border-2 border-gray-300 p-4 rounded-xl min-w-[280px] flex-shrink-0 bg-white shadow-md snap-center"
              >
                <h4 className="font-bold mb-3 text-center text-blue-700 text-lg">{dia}</h4>
                <div className="flex flex-col gap-2">
                  {TIME_SLOTS.map((hora) => (
                    <label key={hora} className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={(slotsMap[dia] || []).includes(hora)}
                        onChange={() => toggleHora(dia, hora)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-base font-medium">{hora}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => handleToggleAllDay(dia)}
                  className="mt-4 w-full bg-blue-500 text-white text-sm py-3 rounded-lg hover:bg-blue-600 font-bold transition-colors shadow-sm"
                >
                  {areAllSelected ? "❌ Desmarcar Todos" : "✅ Marcar Todos"}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Indicador de scroll para mobile */}
        <div className="md:hidden text-center text-xs text-gray-500 mt-2">
          👈 Deslize para ver todos os dias 👉
        </div>
      </div>

      <AnimatePresence mode="wait">
        {msgConfirmacao && (
          <motion.div
            key={msgConfirmacao}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 p-2 rounded text-white font-medium ${msgConfirmacao.startsWith("✅") ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {msgConfirmacao}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleSaveDisponibilidades}
        disabled={salvando}
        className="w-full bg-green-600 text-white rounded p-3 hover:bg-green-700 font-bold disabled:bg-gray-400"
      >
        {salvando ? "Salvando..." : "Salvar Disponibilidades"}
      </button>

      <h3 className="text-xl font-bold mt-6 mb-3">
        Meus Horários de Aula (Publicados)
      </h3>
      {meusHorarios.length === 0 && (
        <p className="text-gray-600">Nenhuma aula publicada para você ainda.</p>
      )}
      {meusHorarios.length > 0 && (
        <ScheduleGrid
          schedule={{
            entries: meusHorarios.flatMap(h => h.entries)
          }}
          turma="Minhas Turmas"
          hideHeader={false}
          showTurmaInCell={true}
        />
      )}
        </motion.div>
      )}
    </div>
  );
}

export default ProfessorDashboard;