import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CursoManager({ 
  cursos, 
  onSave, 
  onDelete, 
  saving 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    sigla: ""
  });

  const resetForm = () => {
    setFormData({ nome: "", sigla: "" });
    setShowAddForm(false);
    setEditingCurso(null);
  };

  const handleEdit = (curso, index) => {
    setEditingCurso(index);
    setFormData({
      nome: curso.nome || curso,
      sigla: curso.sigla || ""
    });
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      alert("O nome do curso é obrigatório!");
      return;
    }

    if (!formData.sigla.trim()) {
      alert("A sigla do curso é obrigatória!");
      return;
    }

    const novoCurso = {
      id: formData.nome.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ''),
      nome: formData.nome.trim(),
      sigla: formData.sigla.trim().toUpperCase()
    };

    let novaLista;
    if (editingCurso !== null) {
      novaLista = [...cursos];
      novaLista[editingCurso] = novoCurso;
    } else {
      novaLista = [...cursos, novoCurso];
    }

    await onSave(novaLista);
    resetForm();
  };

  return (
    <div className="space-y-4">
      {/* Botão para adicionar novo curso */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 font-semibold transition-all shadow-md"
        >
          ➕ Adicionar Novo Curso
        </button>
      )}

      {/* Formulário de adicionar/editar */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl shadow-lg">
              <h4 className="font-bold text-amber-900 mb-4 text-lg">
                {editingCurso !== null ? "✏️ Editar Curso" : "➕ Novo Curso"}
              </h4>

              {/* Nome do Curso */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Curso *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Programação Informática"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sigla do Curso */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sigla do Curso *
                </label>
                <input
                  type="text"
                  value={formData.sigla}
                  onChange={(e) => setFormData(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                  placeholder="Ex: PI"
                  maxLength={10}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A sigla será usada para identificar turmas (ex: PI01, PI02)
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "⏳ Salvando..." : editingCurso !== null ? "💾 Salvar Alterações" : "➕ Adicionar Curso"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de cursos */}
      <div className="space-y-2">
        {cursos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📭 Nenhum curso cadastrado</p>
            <p className="text-sm mt-2">Adicione o primeiro curso acima</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cursos.map((curso, index) => {
              const cursoData = typeof curso === 'string' ? { nome: curso, sigla: "" } : curso;
              
              return (
                <motion.div
                  key={cursoData.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-gray-900 text-lg">
                          🎯 {cursoData.nome}
                        </h5>
                        {cursoData.sigla && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-bold">
                            {cursoData.sigla}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        ID: {cursoData.id || "N/A"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(cursoData, index)}
                        className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold transition-colors text-sm whitespace-nowrap"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja realmente excluir o curso ${cursoData.nome}?\n\nAVISO: Isso pode afetar disciplinas e turmas associadas!`)) {
                            const novaLista = cursos.filter((_, i) => i !== index);
                            onDelete(novaLista);
                          }
                        }}
                        disabled={saving}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CursoManager;