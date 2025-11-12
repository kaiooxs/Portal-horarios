import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function DisciplinaManager({ 
  disciplinas, 
  cursos, 
  onSave, 
  onDelete, 
  saving 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDisc, setEditingDisc] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    curso: ""
  });

  const resetForm = () => {
    setFormData({ nome: "", curso: "" });
    setShowAddForm(false);
    setEditingDisc(null);
  };

  const handleEdit = (disc, index) => {
    setEditingDisc(index);
    setFormData({
      nome: disc.nome || disc,
      curso: disc.curso || ""
    });
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      alert("O nome da disciplina é obrigatório!");
      return;
    }

    if (!formData.curso) {
      alert("O curso é obrigatório!");
      return;
    }

    const novaDisciplina = {
      id: formData.nome.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ''),
      nome: formData.nome.trim(),
      curso: formData.curso
    };

    let novaLista;
    if (editingDisc !== null) {
      novaLista = [...disciplinas];
      novaLista[editingDisc] = novaDisciplina;
    } else {
      novaLista = [...disciplinas, novaDisciplina];
    }

    await onSave(novaLista);
    resetForm();
  };

  // Agrupar disciplinas por curso
  const groupedDisciplinas = disciplinas.reduce((acc, disc) => {
    const discData = typeof disc === 'string' ? { nome: disc, curso: "Geral" } : disc;
    const curso = discData.curso || "Geral";
    if (!acc[curso]) acc[curso] = [];
    acc[curso].push(discData);
    return acc;
  }, {});

  // Ordenar: "Geral" primeiro, depois alfabético
  const cursosOrdenados = Object.keys(groupedDisciplinas).sort((a, b) => {
    if (a === "Geral") return -1;
    if (b === "Geral") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-4">
      {/* Botão para adicionar nova disciplina */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 font-semibold transition-all shadow-md"
        >
          ➕ Adicionar Nova Disciplina
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
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg">
              <h4 className="font-bold text-green-900 mb-4 text-lg">
                {editingDisc !== null ? "✏️ Editar Disciplina" : "➕ Nova Disciplina"}
              </h4>

              {/* Nome da Disciplina */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Disciplina *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Programação Web"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Selecione um curso...</option>
                  <option value="Geral">Geral (Todas as turmas)</option>
                  {cursos.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Disciplinas "Geral" são compartilhadas por todos os cursos (ex: Matemática, Português)
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "⏳ Salvando..." : editingDisc !== null ? "💾 Salvar Alterações" : "➕ Adicionar Disciplina"}
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

      {/* Lista de disciplinas agrupadas por curso */}
      <div className="space-y-4">
        {disciplinas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📭 Nenhuma disciplina cadastrada</p>
            <p className="text-sm mt-2">Adicione a primeira disciplina acima</p>
          </div>
        ) : (
          cursosOrdenados.map((curso) => (
            <div key={curso} className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-bold text-lg ${curso === "Geral" ? "text-gray-700" : "text-green-700"}`}>
                  {curso === "Geral" ? "📚 Disciplinas Gerais" : `📗 ${curso}`}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                  {groupedDisciplinas[curso].length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {groupedDisciplinas[curso].map((disc) => {
                  const index = disciplinas.findIndex(d => 
                    (typeof d === 'string' ? d : d.id) === (typeof disc === 'string' ? disc : disc.id)
                  );
                  
                  return (
                    <motion.div
                      key={disc.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 text-base mb-1">
                            📖 {disc.nome}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {disc.curso === "Geral" ? "Todas as turmas" : disc.curso}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(disc, index)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors text-xs whitespace-nowrap"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja realmente excluir a disciplina ${disc.nome}?`)) {
                                const novaLista = disciplinas.filter((_, i) => i !== index);
                                onDelete(novaLista);
                              }
                            }}
                            disabled={saving}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors text-xs disabled:opacity-50 whitespace-nowrap"
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

export default DisciplinaManager;