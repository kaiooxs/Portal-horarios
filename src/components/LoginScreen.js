import React, { useState } from "react";
import { motion } from "framer-motion";
import { TURMAS, PROFESSORES_EXEMPLO } from "../constants";

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [turmaInput, setTurmaInput] = useState("");
  const [professorNameInput, setProfessorNameInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!role) return alert("Escolha um tipo de acesso.");

    if (role === "aluno") {
      const turma = (turmaInput || "").toUpperCase().trim();
      if (!turma) return alert("Por favor, digite sua turma (ex: PI01)");
      if (!TURMAS.includes(turma)) return alert(`A turma "${turma}" não existe.`);
      return onLogin({ role: "aluno", turma });
    }

    const senhas = { admin: "admin123", professor: "prof123" };
    if (password !== senhas[role]) return alert("Senha incorreta.");

    if (role === "professor" && !professorNameInput) {
      return alert("Por favor, selecione o seu nome.");
    }

    onLogin({ role, professorName: professorNameInput });
    setPassword("");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4">
      <motion.div
        className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/*HEADER RESPONSIVO */}
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <img 
              src="/imagens/logo-epalc.png" 
              alt="EPALC - Escola Profissional António do Lago Cerqueira" 
              className="h-20 sm:h-24 md:h-28 w-auto object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Portal de Horários da EPALC
          </h1>
          <p className="text-sm sm:text-base text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
            📅 {new Date().toLocaleDateString("pt-PT", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Acesso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border-2 border-gray-300 p-3 sm:p-4 rounded-xl w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              required
            >
              <option value="">Selecione o tipo de acesso</option>
              <option value="admin">👨‍💼 Administração</option>
              <option value="professor">👨‍🏫 Professores</option>
              <option value="aluno">👨‍🎓 Alunos</option>
            </select>
          </div>

          {role === "aluno" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sua Turma
              </label>
              <input
                value={turmaInput}
                onChange={(e) => setTurmaInput(e.target.value)}
                placeholder="Digite sua turma (ex: PI01)"
                className="border-2 border-gray-300 p-3 sm:p-4 rounded-xl w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                required
              />
            </div>
          )}

          {role === "professor" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seu Nome
                </label>
                <select
                  value={professorNameInput}
                  onChange={(e) => setProfessorNameInput(e.target.value)}
                  className="border-2 border-gray-300 p-3 sm:p-4 rounded-xl w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                  required
                >
                  <option value="">Selecione seu nome</option>
                  {PROFESSORES_EXEMPLO.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="border-2 border-gray-300 p-3 sm:p-4 rounded-xl w-full pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 font-semibold text-sm"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </>
          )}

          {role === "admin" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha de admin"
                  className="border-2 border-gray-300 p-3 sm:p-4 rounded-xl w-full pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 font-semibold text-sm"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mt-2"
          >
            🚀 Entrar
          </button>
        </form>

        {/*FOOTER COM PARCERIAS */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="mb-3 flex justify-center">
            <img 
              src="/imagens/logo-parcerias.png" 
              alt="Parcerias: Pessoas 2030, Portugal 2030, União Europeia, República Portuguesa, INSTICOOP" 
              className="w-full max-w-md h-auto object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Portal de Horários v1.2.0 | EPALC &copy; 2025 | Todos os direitos reservados. By Kaio Almeida
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;