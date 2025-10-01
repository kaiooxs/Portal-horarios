import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
    
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setMenuData(snap.data());
      } else {
        setMenuData({ semanas: [] });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Lidar com seleção de arquivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB.");
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Fazer upload e publicar cardápio
  const publicarCardapio = async (e) => {
    e.preventDefault();

    if (!imagemPreview) {
      alert("Por favor, selecione uma imagem do cardápio.");
      return;
    }

    if (!dataInicio || !dataFim) {
      alert("Por favor, preencha as datas de início e fim da semana.");
      return;
    }

    setUploading(true);
    setMensagem("");

    try {
      // Converter base64 para blob
      const response = await fetch(imagemPreview);
      const blob = await response.blob();

      // Criar nome único para o arquivo
      const timestamp = Date.now();
      const fileName = `cardapio_${timestamp}.jpg`;
      const storageRef = ref(storage, `cardapios/${fileName}`);

      // Upload para Firebase Storage
      await uploadBytes(storageRef, blob);
      
      // Obter URL da imagem
      const imageUrl = await getDownloadURL(storageRef);

      // Criar nova semana com a imagem
      const novaSemana = {
        dataInicio,
        dataFim,
        imagemUrl: imageUrl,
        dataPublicacao: new Date().toISOString()
      };

      // Adicionar à lista de semanas (mantém as anteriores)
      const novasSemanas = [novaSemana, ...menuData.semanas];

      // Salvar no Firestore
      const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
      await setDoc(docRef, { semanas: novasSemanas });

      setMensagem("✅ Cardápio publicado com sucesso!");
      
      // Limpar formulário
      setImagemPreview(null);
      setDataInicio("");
      setDataFim("");
      document.getElementById("fileInput").value = "";

      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao publicar cardápio:", error);
      setMensagem("❌ Erro ao publicar cardápio: " + error.message);
      setTimeout(() => setMensagem(""), 5000);
    }

    setUploading(false);
  };

  // Remover semana
  const removerSemana = async (index) => {
    if (!window.confirm("Tem certeza que deseja remover este cardápio?")) return;

    try {
      const novasSemanas = menuData.semanas.filter((_, i) => i !== index);
      const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
      await setDoc(docRef, { semanas: novasSemanas });
      setMensagem("✅ Cardápio removido com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao remover cardápio:", error);
      setMensagem("❌ Erro ao remover cardápio");
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
          🍽️ Gestão de Cardápios
        </h2>
        <p className="text-gray-600">
          Faça upload da imagem do cardápio semanal da Scolarest.
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
            📤 Publicar Novo Cardápio
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
              🖼️ Imagem do Cardápio
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
              Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
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
            {uploading ? "📤 Publicando..." : "✅ Publicar Cardápio"}
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📋 Cardápios Publicados ({menuData.semanas.length})
        </h3>

        {menuData.semanas.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">
              📭 Nenhum cardápio publicado ainda.
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
                {semana.imagemUrl && (
                  <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                    <img
                      src={semana.imagemUrl}
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
          <li>Tire uma foto nítida do cardápio da Scolarest</li>
          <li>Certifique-se de que o texto está legível</li>
          <li>Publique o cardápio no início de cada semana</li>
          <li>Os cardápios antigos ficam salvos no histórico</li>
          <li>Alunos e professores verão automaticamente o cardápio da semana atual</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default MenuAdmin;