import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import AdminDashboard from "./components/AdminDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AlunoDashboard from "./components/AlunoDashboard";
import LoginScreen from "./components/LoginScreen";
import { getIntervaloSemanaAtual } from "./utils/helpers";
import { saveUserToFirestore } from "./utils/userManager";

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        // Se não há usuário autenticado, faz login anônimo
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("❌ Erro ao fazer login anônimo:", err);
        }
      }
      // Sempre mostrar tela de login ao recarregar a página
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (userData) => {
    try {
      console.log("🔐 Processando login:", userData);
      
      // Salvar dados do usuário no Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        await saveUserToFirestore(currentUser.uid, {
          role: userData.role,
          name: userData.role === "professor" ? userData.professorName : userData.turma,
        });
      }
      
      // Atualizar estado local
      setUser(userData);
    } catch (error) {
      console.error("❌ Erro ao processar login:", error);
      alert("Erro ao fazer login. Por favor, tente novamente.");
    }
  };

  const handleLogout = async () => {
    console.log("🚪 Fazendo logout...");
    
    try {
      // Limpar dados do usuário do Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "artifacts/default-app-id/public/data/users", currentUser.uid);
        
        console.log("🗑️ Removendo dados do usuário do Firestore...");
        await deleteDoc(userDocRef);
        console.log("✅ Dados do usuário removidos com sucesso");
      }
    } catch (error) {
      console.error("❌ Erro ao remover dados do usuário:", error);
      // Continuar com o logout mesmo se houver erro
    }
    
    // Limpar estado local
    setUser(null);
  };

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      {/*HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 bg-white p-4 rounded-xl shadow-md">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            📚 Portal de Horários da EPALC
            <span className="block sm:inline sm:ml-2 text-sm sm:text-base text-blue-600 mt-1 sm:mt-0">
              {user.role === "admin" ? "👨‍💼 Administração" : 
               user.role === "professor" ? "👨‍🏫 Professor" : 
               "👨‍🎓 Aluno"}
            </span>
          </h1>
          <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
            <span className="font-semibold">📅 Semana:</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {getIntervaloSemanaAtual()}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-red-600 font-semibold transition-colors shadow-sm"
        >
          🚪 Sair
        </button>
      </div>

      {/*CONTEÚDO PRINCIPAL RESPONSIVO */}
      <div className="max-w-7xl mx-auto">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "professor" && (
          <ProfessorDashboard professorNameFromLogin={user.professorName} />
        )}
        {user.role === "aluno" && <AlunoDashboard turma={user.turma} />}
      </div>
    </div>
  );
}
