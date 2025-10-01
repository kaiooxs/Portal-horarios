import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import ScheduleGrid from "./ScheduleGrid";
import MenuSemanal from "./MenuSemanal";

function AlunoDashboard({ turma }) {
  const [schedule, setSchedule] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    if (!turma) return;
    const docRef = doc(db, "artifacts/default-app-id/public/data/schedules", turma);
    const unsub = onSnapshot(docRef, (snap) => {
      setSchedule(snap.exists() && snap.data().published ? { ...snap.data(), turma } : null);
    });
    return () => unsub();
  }, [turma]);

  if (!schedule) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-md">
          O horário da sua turma ainda não foi publicado.
        </div>
        <MenuSemanal />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botões de navegação */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setMostrarMenu(false)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            !mostrarMenu
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          📅 Horário
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

      {/* Conteúdo */}
      {mostrarMenu ? (
        <MenuSemanal />
      ) : (
        <ScheduleGrid schedule={schedule} turma={turma} />
      )}
    </div>
  );
}

export default AlunoDashboard;