import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ProfessorManager({ 
  professores, 
  disciplinas, 
  turmas, 
  onSave, 
  onDelete, 
  saving 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProf, setEditingProf] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    disciplinas: [],
    turmas: []
  });

  const resetForm = () => {
    setFormData({ nome: "", disciplinas: [], turmas: [] });
    setShowAddForm(false);
    setEditingProf(null);
  };

  const handleEdit = (prof, index) => {
    setEditingProf(index);
    setFormData({
      nome: prof.nome || prof,
      disciplinas: prof.disciplinas || [],
      turmas: prof.turmas || []
    });
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      alert("O nome do professor é obrigatório!");
      return;
    }

    const novoProfessor = {
      id: formData.nome.toLowerCase().replace(/\s+/g, "_"),
      nome: formData.nome.trim(),
      disciplinas: formData.disciplinas,
      turmas: formData.turmas
    };

    let novaLista;
    if (editingProf !== null) {
      novaLista = [...professores];
      novaLista[editingProf] = novoProfessor;
    } else {
      novaLista = [...professores, novoProfessor];
    }

    await onSave(novaLista);
    resetForm();
  };

  const toggleDisciplina = (disc) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(disc)
        ? prev.disciplinas.filter(d => d !== disc)
        : [...prev.disciplinas, disc]
    }));
  };

  const toggleTurma = (turma) => {
    setFormData(prev => ({
      ...prev,
      turmas: prev.turmas.includes(turma)
        ? prev.turmas.filter(t => t !== turma)
        : [...prev.turmas, turma]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Botão para adicionar novo professor */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 font-semibold transition-all shadow-md"
        >
          ➕ Adicionar Novo Professor
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
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl shadow-lg">
              <h4 className="font-bold text-blue-900 mb-4 text-lg">
                {editingProf !== null ? "✏️ Editar Professor" : "➕ Novo Professor"}
              </h4>

              {/* Nome do Professor */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Disciplinas */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Disciplinas que Leciona
                </label>
                <div className="max-h-48 overflow-y-auto p-3 bg-white border-2 border-gray-300 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {disciplinas.map((disc) => (
                      <label key={disc} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.disciplinas.includes(disc)}
                          onChange={() => toggleDisciplina(disc)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{disc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecionadas: {formData.disciplinas.length}
                </p>
              </div>

              {/* Turmas */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Turmas Atribuídas
                </label>
                <div className="p-3 bg-white border-2 border-gray-300 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {turmas.map((turma) => (
                      <label
                        key={turma}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          formData.turmas.includes(turma)
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.turmas.includes(turma)}
                          onChange={() => toggleTurma(turma)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium">{turma}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecionadas: {formData.turmas.length}
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "⏳ Salvando..." : editingProf !== null ? "💾 Salvar Alterações" : "➕ Adicionar Professor"}
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

      {/* Lista de professores */}
      <div className="space-y-2">
        {professores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📭 Nenhum professor cadastrado</p>
            <p className="text-sm mt-2">Adicione o primeiro professor acima</p>
          </div>
        ) : (
          professores.map((prof, index) => {
            const profData = typeof prof === 'string' ? { nome: prof, disciplinas: [], turmas: [] } : prof;
            
            return (
              <motion.div
                key={profData.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 text-lg mb-2">
                      👨‍🏫 {profData.nome}
                    </h5>
                    
                    {profData.disciplinas && profData.disciplinas.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-600 mb-1">📚 Disciplinas:</p>
                        <div className="flex flex-wrap gap-1">
                          {profData.disciplinas.map((disc, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {disc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profData.turmas && profData.turmas.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">🎓 Turmas:</p>
                        <div className="flex flex-wrap gap-1">
                          {profData.turmas.map((turma, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              {turma}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(profData, index)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors text-sm whitespace-nowrap"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja realmente excluir o professor ${profData.nome}?`)) {
                          const novaLista = professores.filter((_, i) => i !== index);
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
          })
        )}
      </div>
    </div>
  );
}

export default ProfessorManager;