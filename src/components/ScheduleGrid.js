import React, { useRef } from "react";
import { DAYS_OF_WEEK, TIME_SLOTS } from "../constants";
import { downloadSchedulePDF } from "../utils/pdfExport";

/**
 * Componente para exibir a grade de horários
 */
const ScheduleGrid = ({ 
  schedule = { entries: [] }, 
  turma = "—", 
  hideHeader = false, 
  refForPdf, 
  showTurmaInCell = false 
}) => {
  const localRef = useRef();
  const ref = refForPdf ?? localRef;

  return (
    <div className="mb-4">
      {!hideHeader && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Turma: {turma}</h3>
          <button
            onClick={() => downloadSchedulePDF(ref, `horario-${turma}.pdf`)}
            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
          >
            📄 Baixar PDF
          </button>
        </div>
      )}
      <div ref={ref} className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-6 gap-px bg-gray-200 border border-gray-200">
          <div className="bg-gray-100 p-2 font-bold text-center">Horas</div>
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="bg-gray-100 p-2 font-bold text-center">
              {day}
            </div>
          ))}

          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              <div className="bg-gray-100 p-2 font-bold text-center">{time}</div>
              {DAYS_OF_WEEK.map((day) => {
                const entry = (schedule.entries || []).find(
                  (it) => it.dia === day && it.hora === time
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`p-2 min-h-[80px] flex flex-col justify-center items-center text-center ${
                      time === "Almoço" ? "bg-amber-50" : "bg-white"
                    }`}
                  >
                    {time === "Almoço" ? (
                      <div className="text-sm text-gray-700">— Almoço —</div>
                    ) : entry ? (
                      <>
                        <p className="font-semibold">{entry.disciplina}</p>
                        <p className="text-sm text-gray-600">{entry.professor}</p>
                        {showTurmaInCell && (
                          <p className="text-xs text-blue-700 font-bold">{entry.turma}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400">-</p>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;