import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseConfig";
import { doc, setDoc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import { DAYS_OF_WEEK, TIME_SLOTS, TURMAS, PROFESSORES_EXEMPLO } from "../constants";
import { downloadSchedulePDF } from "../utils/pdfExport";
import MenuAdmin from "./MenuAdmin";
import SeedDisciplinasButton from "./SeedDisciplinasButton";
import MigrateDisciplinasButton from "./MigrateDisciplinasButton";

function AdminDashboard() {
  const [schedules, setSchedules] = useState({});
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("horarios"); // "horarios" ou "cardapio"

  useEffect(() => {
    let unsubscribers = [];
    let schedulesCache = {};
    let loadedCount = 0;
    const totalToLoad = TURMAS.length + 1; // turmas + availabilities

    // Carregar schedules com batching para melhor performance
    TURMAS.forEach((t) => {
      const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, t);
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          schedulesCache[t] = snap.data();
        } else {
          schedulesCache[t] = { entries: [], published: false };
        }
        
        loadedCount++;
        
        // Atualizar estado apenas quando todos os dados estiverem carregados
        // ou a cada 5 turmas para dar feedback visual
        if (loadedCount >= totalToLoad || loadedCount % 5 === 0) {
          setSchedules({ ...schedulesCache });
        }
      }, (error) => {
        console.error(`[AdminDashboard] Erro ao carregar schedule da turma ${t}:`, error);
        loadedCount++;
      });
      unsubscribers.push(unsub);
    });

    const unsubAvail = onSnapshot(
      collection(db, `artifacts/default-app-id/public/data/availabilities`),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("[AdminDashboard] Disponibilidades carregadas:", list.length, "professores");
        setAvailabilities(list);
        loadedCount++;
        
        // Marcar como carregado quando availabilities estiver pronto
        if (loadedCount >= totalToLoad) {
          setLoading(false);
        }
      },
      (error) => {
        console.error("[AdminDashboard] Erro ao carregar availabilities:", error);
        setLoading(false);
      }
    );

    unsubscribers.push(unsubAvail);

    // Timeout de segurança: se demorar mais de 10 segundos, mostrar interface mesmo assim
    const timeoutId = setTimeout(() => {
      console.warn("[AdminDashboard] Timeout atingido, mostrando interface");
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribers.forEach((u) => u && u());
      clearTimeout(timeoutId);
    };
  }, []);

  const setCell = async (turma, dia, hora, professorName, disciplina) => {
    const current = schedules[turma]?.entries || [];
    let updated;
    if (!professorName) {
      updated = current.filter((e) => !(e.dia === dia && e.hora === hora));
    } else {
      const exists = current.some((e) => e.dia === dia && e.hora === hora);
      if (exists) {
        updated = current.map((e) =>
          e.dia === dia && e.hora === hora ? { ...e, professor: professorName, disciplina } : e
        );
      } else {
        updated = [
          ...current,
          { id: Date.now().toString(), turma, dia, hora, professor: professorName, disciplina },
        ];
      }
    }
    await setDoc(
      doc(db, `artifacts/default-app-id/public/data/schedules`, turma),
      { entries: updated, published: schedules[turma]?.published || false },
      { merge: true }
    );
  };

  const togglePublish = async (turma) => {
    const published = !schedules[turma]?.published;
    await updateDoc(doc(db, `artifacts/default-app-id/public/data/schedules`, turma), { published });
  };

  const clearSchedule = async (turma) => {
    if (!window.confirm(`Tem certeza que deseja limpar completamente o horário da turma ${turma}?`)) return;
    await setDoc(doc(db, `artifacts/default-app-id/public/data/schedules`, turma), {
      entries: [],
      published: false,
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-semibold text-gray-700 mb-2">Carregando dados do admin...</p>
        <p className="text-sm text-gray-500">
          Carregando {TURMAS.length} turmas e disponibilidades dos professores
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/*Abas de navegação */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setAbaAtiva("horarios")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            abaAtiva === "horarios"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          📅 Gerir Horários
        </button>
        <button
          onClick={() => setAbaAtiva("cardapio")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            abaAtiva === "cardapio"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          🍽️ Gerir Cardápio
        </button>
      </div>

      {/*Conteúdo condicional */}
      {abaAtiva === "cardapio" ? (
        <MenuAdmin />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-800">
            👨‍💼 Admin — Gerir Horários
          </h2>

      {/* Botões para gerenciar disciplinas */}
      <div className="mb-6 space-y-4">
        <MigrateDisciplinasButton />
        <div className="text-center text-sm text-gray-500">
          <p>ou</p>
        </div>
        <SeedDisciplinasButton />
      </div>

      {/*Status de Disponibilidades - RESPONSIVO */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
          📊 Status de Disponibilidades dos Professores
        </h3>
        
        {/* Desktop: Tabela tradicional */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
              <tr className="text-center">
                <th className="px-3 py-2 border font-semibold">Professor</th>
                <th className="px-3 py-2 border font-semibold">Última Atualização</th>
                <th className="px-3 py-2 border font-semibold">Almoços</th>
                <th className="px-3 py-2 border font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {PROFESSORES_EXEMPLO.map((nome) => {
                // Buscar professor pelo ID normalizado ou pelo nome
                const docId = nome.toLowerCase().replace(/\s+/g, "_");
                const prof = availabilities.find((p) => p.id === docId || p.nome === nome);
                
                // Debug para verificar se o professor foi encontrado
                if (!prof) {
                  console.log(`[AdminDashboard] Professor não encontrado: ${nome} (ID: ${docId})`);
                }
                
                return (
                  <tr key={nome} className="text-center hover:bg-blue-50 transition-colors">
                    <td className="border px-3 py-2 font-medium">{nome}</td>
                    <td className="border px-3 py-2 text-xs">
                      {prof?.lastUpdated?.seconds
                        ? new Date(prof.lastUpdated.seconds * 1000).toLocaleString("pt-PT")
                        : prof?.lastUpdated?.toDate
                        ? prof.lastUpdated.toDate().toLocaleString("pt-PT")
                        : "Nunca"}
                    </td>
                    <td className="border px-3 py-2 text-xs">
                      {(prof?.almocosAgendados || []).length > 0
                        ? prof.almocosAgendados.join(", ")
                        : "Não marcou"}
                    </td>
                    <td className="border px-3 py-2">
                      {prof?.lastUpdated ? (
                        <span className="text-green-600 font-semibold text-xs">
                          ✅ Atualizado
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold text-xs">
                          ⚠️ Pendente
                        </span>
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
          {PROFESSORES_EXEMPLO.map((nome) => {
            // Buscar professor pelo ID normalizado ou pelo nome
            const docId = nome.toLowerCase().replace(/\s+/g, "_");
            const prof = availabilities.find((p) => p.id === docId || p.nome === nome);
            
            // Debug para verificar se o professor foi encontrado
            if (!prof) {
              console.log(`[AdminDashboard Mobile] Professor não encontrado: ${nome} (ID: ${docId})`);
            }
            
            return (
              <div key={nome} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{nome}</h4>
                  {prof?.lastUpdated ? (
                    <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded-full">
                      ✅ Atualizado
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold text-xs bg-red-50 px-2 py-1 rounded-full">
                      ⚠️ Pendente
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold">📅 Última atualização:</span>{" "}
                    {prof?.lastUpdated?.seconds
                      ? new Date(prof.lastUpdated.seconds * 1000).toLocaleString("pt-PT")
                      : prof?.lastUpdated?.toDate
                      ? prof.lastUpdated.toDate().toLocaleString("pt-PT")
                      : "Nunca"}
                  </p>
                  <p>
                    <span className="font-semibold">🍽️ Almoços:</span>{" "}
                    {(prof?.almocosAgendados || []).length > 0
                      ? prof.almocosAgendados.join(", ")
                      : "Não marcou"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/*Horários das turmas - RESPONSIVO */}
      {TURMAS.map((t) => (
        <div key={t} className="mb-6 p-3 sm:p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm">
          {/* Header responsivo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800">
              📋 Horário da Turma {t}
              {schedules[t]?.published && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✅ Publicado
                </span>
              )}
            </h3>
            
            {/* Botões de ação - responsivos */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => clearSchedule(t)} 
                className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-700 font-semibold transition-colors"
              >
                🧹 Limpar
              </button>
              <button 
                onClick={() => togglePublish(t)} 
                className={`flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm rounded-lg ${
                  schedules[t]?.published ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold transition-colors`}
              >
                {schedules[t]?.published ? "❌ Despublicar" : "✅ Publicar"}
              </button>
              <button
                onClick={() => downloadSchedulePDF({ current: document.querySelector(`#pdf-${t}`) }, `horario-${t}.pdf`)}
                className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition-colors"
              >
                📄 PDF
              </button>
            </div>
          </div>

          <div id={`pdf-${t}`} className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-px bg-gray-200 border border-gray-200">
              <div className="bg-gray-100 p-2 font-bold text-center">Horas</div>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="bg-gray-100 p-2 font-bold text-center">{day}</div>
              ))}

              {TIME_SLOTS.map((time) => (
                <React.Fragment key={time}>
                  <div className="bg-gray-100 p-2 font-bold text-center">{time}</div>
                  {DAYS_OF_WEEK.map((day) => {
                    if (time === "Almoço") {
                      return (
                        <div key={`${day}-${time}`} className="bg-amber-100 p-2 text-center font-medium text-gray-700">
                          — Almoço —
                        </div>
                      );
                    } else {
                      const entry = (schedules[t]?.entries || []).find((e) => e.dia === day && e.hora === time);

                      let profs = availabilities
                        .filter((p) => (p.slots || []).some((s) => s.dia === day && s.hora === time && s.turma === t));

                      const alreadyAssigned = Object.values(schedules)
                        .flatMap((sched) => sched?.entries || [])
                        .filter((e) => e.dia === day && e.hora === time && e.turma !== t)
                        .map((e) => e.professor);

                      profs = profs.filter((p) => !alreadyAssigned.includes(p.nome));

                      return (
                        <div key={`${day}-${time}-cell`} className="bg-white p-2 flex flex-col items-center">
                          <select
                            key={`${day}-${time}`}
                            value={entry?.professor || ""}
                            onChange={(e) => {
                              const profName = e.target.value;
                              if (!profName) {
                                setCell(t, day, time, "", "");
                                return;
                              }
                              if (alreadyAssigned.includes(profName)) {
                                alert(`O professor ${profName} já está alocado em outra turma neste horário.`);
                                return;
                              }
                              const profDoc = availabilities.find((p) => p.nome === profName);
                              const slotMatch = (profDoc?.slots || []).find((s) => s.dia === day && s.hora === time && s.turma === t);
                              const suggestedDisc = slotMatch?.disciplina || profDoc?.disciplinaByTurma?.[t] || "";
                              setCell(t, day, time, profName, suggestedDisc);
                            }}
                            className="border p-1 rounded w-full text-sm"
                          >
                            <option value="">Selecione professor...</option>
                            {profs.map((p) => (
                              <option key={p.nome} value={p.nome}>{p.nome}</option>
                            ))}
                          </select>

                          <input
                            type="text"
                            placeholder="Disciplina (editar)"
                            value={entry?.disciplina || ""}
                            onChange={(e) => setCell(t, day, time, entry?.professor || "", e.target.value)}
                            className="border p-1 rounded mt-1 w-full text-sm"
                          />
                        </div>
                      );
                    }
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ))}
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;