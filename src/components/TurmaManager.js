import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TurmaManager({ 
  turmas, 
  cursos, 
  onSave, 
  onDelete, 
  saving 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    curso: "",
    ano: ""
  });

  const resetForm = () => {
    setFormData({ nome: "", curso: "", ano: "" });
    setShowAddForm(false);
    setEditingTurma(null);
  };

  const handleEdit = (turma, index) => {
    setEditingTurma(index);
    setFormData({
      nome: turma.nome || turma,
      curso: turma.curso || "",
      ano: turma.ano || ""
    });
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      alert("O nome da turma é obrigatório!");
      return;
    }

    if (!formData.curso) {
      alert("O curso é obrigatório!");
      return;
    }

    if (!formData.ano) {
      alert("O ano é obrigatório!");
      return;
    }

    const novaTurma = {
      id: formData.nome.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ''),
      nome: formData.nome.trim(),
      curso: formData.curso,
      ano: parseInt(formData.ano)
    };

    let novaLista;
    if (editingTurma !== null) {
      novaLista = [...turmas];
      novaLista[editingTurma] = novaTurma;
    } else {
      novaLista = [...turmas, novaTurma];
    }

    await onSave(novaLista);
    resetForm();
  };

  // Agrupar turmas por curso
  const groupedTurmas = turmas.reduce((acc, turma) => {
    const turmaData = typeof turma === 'string' ? { nome: turma, curso: "Sem Curso", ano: 1 } : turma;
    const curso = turmaData.curso || "Sem Curso";
    if (!acc[curso]) acc[curso] = [];
    acc[curso].push(turmaData);
    return acc;
  }, {});

  // Ordenar cursos alfabeticamente
  const cursosOrdenados = Object.keys(groupedTurmas).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      {/* Botão para adicionar nova turma */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 font-semibold transition-all shadow-md"
        >
          ➕ Adicionar Nova Turma
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
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-300 rounded-xl shadow-lg">
              <h4 className="font-bold text-purple-900 mb-4 text-lg">
                {editingTurma !== null ? "✏️ Editar Turma" : "➕ Nova Turma"}
              </h4>

              {/* Nome da Turma */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: PI01, CAB02, TERM01"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Curso */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Curso *
                </label>
                <select
                  value={formData.curso}
                  onChange={(e) => setFormData(prev => ({ ...prev, curso: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="">Selecione um curso...</option>
                  {cursos.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ano */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ano *
                </label>
                <select
                  value={formData.ano}
                  onChange={(e) => setFormData(prev => ({ ...prev, ano: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="">Selecione o ano...</option>
                  <option value="1">1º Ano</option>
                  <option value="2">2º Ano</option>
                  <option value="3">3º Ano</option>
                </select>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "⏳ Salvando..." : editingTurma !== null ? "💾 Salvar Alterações" : "➕ Adicionar Turma"}
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

      {/* Lista de turmas agrupadas por curso */}
      <div className="space-y-4">
        {turmas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📭 Nenhuma turma cadastrada</p>
            <p className="text-sm mt-2">Adicione a primeira turma acima</p>
          </div>
        ) : (
          cursosOrdenados.map((curso) => (
            <div key={curso} className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-purple-700">
                  🎓 {curso}
                </h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                  {groupedTurmas[curso].length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {groupedTurmas[curso]
                  .sort((a, b) => a.ano - b.ano || a.nome.localeCompare(b.nome))
                  .map((turma) => {
                    const index = turmas.findIndex(t => 
                      (typeof t === 'string' ? t : t.id) === (typeof turma === 'string' ? turma : turma.id)
                    );
                    
                    return (
                      <motion.div
                        key={turma.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900 text-lg">
                                🎓 {turma.nome}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1">
                                {turma.ano}º Ano
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEdit(turma, index)}
                              className="flex-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors text-xs"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja realmente excluir a turma ${turma.nome}?`)) {
                                  const novaLista = turmas.filter((_, i) => i !== index);
                                  onDelete(novaLista);
                                }
                              }}
                              disabled={saving}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors text-xs disabled:opacity-50"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TurmaManager;