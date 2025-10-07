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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Turma: {turma}</h3>
          <button
            onClick={() => downloadSchedulePDF(ref, `horario-${turma}.pdf`)}
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto"
          >
            📄 Baixar PDF
          </button>
        </div>
      )}
      <div ref={ref} className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
        {/* Versão Desktop - Grid completo */}
        <div className="hidden md:block overflow-x-auto">
          <div className="grid grid-cols-6 gap-px bg-gray-200 border border-gray-200 min-w-[800px]">
            <div className="bg-gray-100 p-2 font-bold text-center text-sm">Horas</div>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="bg-gray-100 p-2 font-bold text-center text-sm">
                {day}
              </div>
            ))}

            {TIME_SLOTS.map((time) => (
              <React.Fragment key={time}>
                <div className="bg-gray-100 p-2 font-bold text-center text-xs sm:text-sm">{time}</div>
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
                        <div className="text-xs sm:text-sm text-gray-700">— Almoço —</div>
                      ) : entry ? (
                        <>
                          <p className="font-semibold text-xs sm:text-sm">{entry.disciplina}</p>
                          <p className="text-xs text-gray-600">{entry.professor}</p>
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

        {/* Versão Mobile - Lista por dia */}
        <div className="md:hidden space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-3 font-bold text-center">
                {day}
              </div>
              <div className="divide-y divide-gray-200">
                {TIME_SLOTS.map((time) => {
                  const entry = (schedule.entries || []).find(
                    (it) => it.dia === day && it.hora === time
                  );
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`p-3 ${time === "Almoço" ? "bg-amber-50" : "bg-white"}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-gray-700 text-sm min-w-[80px]">
                          {time}
                        </div>
                        <div className="flex-1 text-right">
                          {time === "Almoço" ? (
                            <div className="text-sm text-gray-600 italic">Almoço</div>
                          ) : entry ? (
                            <>
                              <p className="font-semibold text-sm text-gray-800">
                                {entry.disciplina}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {entry.professor}
                              </p>
                              {showTurmaInCell && (
                                <p className="text-xs text-blue-700 font-bold mt-1">
                                  {entry.turma}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-400 text-sm">-</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;