import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseConfig";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

function MenuAdmin() {
  const [menuData, setMenuData] = useState({
    semanas: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [imagemPreview, setImagemPreview] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Carregar dados do Firebase
  useEffect(() => {
    console.log("[MenuAdmin] Configurando listener do Firebase...");
    const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
    
    const unsub = onSnapshot(
      docRef, 
      (snap) => {
        console.log("[MenuAdmin] 📡 onSnapshot disparado");
        console.log("[MenuAdmin] - Documento existe?", snap.exists());
        
        if (snap.exists()) {
          const data = snap.data();
          console.log("[MenuAdmin] ✅ Dados recebidos do Firestore:");
          console.log("[MenuAdmin] - Número de semanas:", data.semanas?.length || 0);
          setMenuData(data);
        } else {
          console.log("[MenuAdmin] ⚠️ Documento não existe no Firestore, inicializando vazio");
          setMenuData({ semanas: [] });
        }
        setLoading(false);
      },
      (error) => {
        console.error("[MenuAdmin] ❌ Erro no onSnapshot:", error);
        console.error("[MenuAdmin] Código do erro:", error.code);
        console.error("[MenuAdmin] Mensagem:", error.message);
        setLoading(false);
      }
    );

    return () => {
      console.log("[MenuAdmin] 🧹 Limpando listener");
      unsub();
    };
  }, []); // Remover dependência de uploading para evitar loop

  // Lidar com seleção de arquivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)");
      return;
    }

    // Validar tamanho (máx 1MB para Base64)
    if (file.size > 1 * 1024 * 1024) {
      alert("A imagem é muito grande. Por favor, selecione uma imagem menor que 1MB.");
      return;
    }

    // Criar preview e converter para Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result); // Já está em Base64
    };
    reader.readAsDataURL(file);
  };

  // Publicar cardápio (usando Base64)
  const publicarCardapio = async (e) => {
    e.preventDefault();

    if (!imagemPreview) {
      alert("Por favor, selecione uma imagem da ementa.");
      return;
    }

    if (!dataInicio || !dataFim) {
      alert("Por favor, preencha as datas de início e fim da semana.");
      return;
    }

    console.log("[MenuAdmin] 🚀 Iniciando publicação da ementa (Base64)...");
    console.log("[MenuAdmin] - Data Início:", dataInicio);
    console.log("[MenuAdmin] - Data Fim:", dataFim);
    console.log("[MenuAdmin] - Tamanho da imagem Base64:", imagemPreview.length, "caracteres");
    
    setUploading(true);
    setMensagem("");

    try {
      // Criar nova semana com a imagem em Base64
      const novaSemana = {
        dataInicio,
        dataFim,
        imagemBase64: imagemPreview, // Salvar diretamente o Base64
        dataPublicacao: new Date().toISOString()
      };

      console.log("[MenuAdmin] 📖 Lendo dados atuais do Firestore...");
      const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
      
      // Ler o estado atual antes de salvar
      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.exists() ? currentDoc.data() : { semanas: [] };
      const semanasAtuais = Array.isArray(currentData.semanas) ? [...currentData.semanas] : [];
      
      console.log("[MenuAdmin] - Semanas atuais no Firestore:", semanasAtuais.length);
      
      const novasSemanas = [novaSemana, ...semanasAtuais];

      console.log("[MenuAdmin] 💾 Salvando no Firestore...");
      console.log("[MenuAdmin] Total de semanas:", novasSemanas.length);
      
      // Salvar no Firestore
      await setDoc(docRef, { semanas: novasSemanas }, { merge: false });
      
      console.log("[MenuAdmin] ✅ Documento salvo no Firestore!");

      // Limpar formulário IMEDIATAMENTE após salvar
      setImagemPreview(null);
      setDataInicio("");
      setDataFim("");
      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = "";
      }

      // Mostrar mensagem de sucesso
      setMensagem("✅ Ementa publicada com sucesso!");
      console.log("[MenuAdmin] ✅ Ementa publicada com sucesso!");

      // Limpar mensagem após 3 segundos
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("[MenuAdmin] ❌ Erro ao publicar ementa:", error);
      console.error("[MenuAdmin] Stack trace:", error.stack);
      setMensagem("❌ Erro ao publicar ementa: " + error.message);
      setTimeout(() => setMensagem(""), 5000);
    } finally {
      console.log("[MenuAdmin] 🏁 Finalizando publicação...");
      setUploading(false);
    }
  };

  // Remover semana
  const removerSemana = async (index) => {
    if (!window.confirm("Tem certeza que deseja remover esta ementa?")) return;

    try {
      const novasSemanas = menuData.semanas.filter((_, i) => i !== index);
      const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
      await setDoc(docRef, { semanas: novasSemanas });
      setMensagem("✅ Ementa removida com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao remover ementa:", error);
      setMensagem("❌ Erro ao remover ementa");
      setTimeout(() => setMensagem(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          🍽️ Gestão de Ementas
        </h2>
        <p className="text-gray-600">
          Faça upload da imagem da ementa semanal da Scolarest.
        </p>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg font-semibold ${
            mensagem.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensagem}
        </motion.div>
      )}

      {/* Formulário de Upload */}
      <form onSubmit={publicarCardapio} className="mb-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📤 Publicar Nova Ementa
          </h3>

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Data de Início
              </label>
              <input
                type="text"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="Ex: 23 de Setembro"
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Data de Fim
              </label>
              <input
                type="text"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="Ex: 27 de Setembro"
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Upload de Imagem */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🖼️ Imagem da Ementa
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos aceitos: JPG, PNG, GIF (máx. 1MB)
            </p>
          </div>

          {/* Preview da Imagem */}
          {imagemPreview && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                👁️ Pré-visualização:
              </p>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                <img
                  src={imagemPreview}
                  alt="Preview do cardápio"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? "📤 Publicando..." : "✅ Publicar Ementa"}
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📋 Ementas Publicadas ({menuData.semanas.length})
        </h3>

        {menuData.semanas.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">
              📭 Nenhuma ementa publicada ainda.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Faça upload da primeira imagem acima.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {menuData.semanas.map((semana, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      📅 {semana.dataInicio} - {semana.dataFim}
                    </h4>
                    {semana.dataPublicacao && (
                      <p className="text-xs text-gray-500">
                        Publicado em: {new Date(semana.dataPublicacao).toLocaleString("pt-PT")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removerSemana(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm"
                  >
                    🗑️ Remover
                  </button>
                </div>

                {/* Imagem do Cardápio */}
                {(semana.imagemBase64 || semana.imagemUrl) && (
                  <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                    <img
                      src={semana.imagemBase64 || semana.imagemUrl}
                      alt={`Cardápio ${semana.dataInicio} - ${semana.dataFim}`}
                      className="w-full h-auto rounded"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-800 mb-2">💡 Dicas:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Tire uma foto nítida da ementa da Scolarest</li>
          <li>Certifique-se de que o texto está legível</li>
          <li>Publique a ementa no início de cada semana</li>
          <li>As ementas antigas ficam salvas no histórico</li>
          <li>Alunos e professores verão automaticamente a ementa da semana atual</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default MenuAdmin;