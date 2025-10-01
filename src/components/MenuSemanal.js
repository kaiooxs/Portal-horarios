import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

function MenuSemanal() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semanaAtual, setSemanaAtual] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
    
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMenuData(data);
        
        // Encontrar semana atual
        if (data.semanas && data.semanas.length > 0) {
          // Pegar a primeira semana (mais recente)
          setSemanaAtual(data.semanas[0]);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!semanaAtual) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cardápio não disponível
          </h2>
          <p className="text-gray-600">
            O cardápio desta semana ainda não foi publicado.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Por favor, volte mais tarde ou contacte a administração.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              🍽️ Cardápio da Semana
            </h2>
            <p className="text-gray-600 font-semibold">
              📅 {semanaAtual.dataInicio} - {semanaAtual.dataFim}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold text-sm">
            🍴 Fornecido por Scolarest
          </div>
        </div>
      </div>

      {/* Imagem do Cardápio */}
      {semanaAtual.imagemUrl ? (
        <div className="mb-6">
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <img
              src={semanaAtual.imagemUrl}
              alt={`Cardápio ${semanaAtual.dataInicio} - ${semanaAtual.dataFim}`}
              className="w-full h-auto"
              style={{ maxHeight: "80vh", objectFit: "contain" }}
            />
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href={semanaAtual.imagemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm flex items-center gap-2"
            >
              🔍 Ver em Tamanho Real
            </a>
            <a
              href={semanaAtual.imagemUrl}
              download={`cardapio_${semanaAtual.dataInicio}.jpg`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm flex items-center gap-2"
            >
              💾 Baixar Imagem
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-semibold">
            ⚠️ Imagem do cardápio não disponível
          </p>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="mt-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <h3 className="font-bold text-gray-800 mb-2">ℹ️ Informações:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>O cardápio é atualizado semanalmente</li>
          <li>Fornecido pela Scolarest - Serviços de Alimentação</li>
          <li>Em caso de dúvidas sobre alergénios, contacte a cantina</li>
          <li>Opções vegetarianas disponíveis diariamente</li>
        </ul>
      </div>

      {/* Histórico de Cardápios */}
      {menuData?.semanas && menuData.semanas.length > 1 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            📚 Cardápios Anteriores
          </h3>
          <div className="space-y-3">
            {menuData.semanas.slice(1).map((semana, index) => (
              <details key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600">
                  📅 {semana.dataInicio} - {semana.dataFim}
                </summary>
                <div className="mt-3 border-t border-gray-200 pt-3">
                  {semana.imagemUrl && (
                    <img
                      src={semana.imagemUrl}
                      alt={`Cardápio ${semana.dataInicio} - ${semana.dataFim}`}
                      className="w-full h-auto rounded"
                    />
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default MenuSemanal;