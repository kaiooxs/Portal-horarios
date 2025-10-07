/**
 * 🔐 Gerenciador de Usuários - RBAC (Role-Based Access Control)
 * 
 * Este módulo gerencia os usuários e suas permissões no Firestore.
 * Implementa controle de acesso baseado em funções (roles).
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

// Caminho base para a coleção de usuários
const USERS_COLLECTION_PATH = "artifacts/default-app-id/public/data/users";

/**
 * Cria ou atualiza o documento do usuário no Firestore
 * @param {string} uid - UID do usuário no Firebase Auth
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.role - Função do usuário: "admin", "professor" ou "aluno"
 * @param {string} userData.name - Nome do professor ou turma do aluno
 * @returns {Promise<void>}
 */
export async function saveUserToFirestore(uid, userData) {
  try {
    console.log("💾 Salvando usuário no Firestore:", { uid, userData });
    
    const userDocRef = doc(db, USERS_COLLECTION_PATH, uid);
    
    await setDoc(userDocRef, {
      role: userData.role,
      name: userData.name || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }, { merge: true }); // merge: true para não sobrescrever campos existentes
    
    console.log("✅ Usuário salvo com sucesso no Firestore");
  } catch (error) {
    console.error("❌ Erro ao salvar usuário no Firestore:", error);
    throw error;
  }
}

/**
 * Obtém os dados do usuário do Firestore
 * @param {string} uid - UID do usuário no Firebase Auth
 * @returns {Promise<Object|null>} Dados do usuário ou null se não existir
 */
export async function getUserFromFirestore(uid) {
  try {
    console.log("🔍 Buscando usuário no Firestore:", uid);
    
    const userDocRef = doc(db, USERS_COLLECTION_PATH, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("✅ Usuário encontrado:", userData);
      return userData;
    } else {
      console.log("⚠️ Usuário não encontrado no Firestore");
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuário no Firestore:", error);
    throw error;
  }
}

/**
 * Verifica se o usuário atual é admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const userData = await getUserFromFirestore(user.uid);
    return userData?.role === "admin";
  } catch (error) {
    console.error("❌ Erro ao verificar se é admin:", error);
    return false;
  }
}

/**
 * Verifica se o usuário atual é professor
 * @returns {Promise<boolean>}
 */
export async function isProfessor() {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const userData = await getUserFromFirestore(user.uid);
    return userData?.role === "professor";
  } catch (error) {
    console.error("❌ Erro ao verificar se é professor:", error);
    return false;
  }
}

/**
 * Verifica se o usuário atual é aluno
 * @returns {Promise<boolean>}
 */
export async function isAluno() {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const userData = await getUserFromFirestore(user.uid);
    return userData?.role === "aluno";
  } catch (error) {
    console.error("❌ Erro ao verificar se é aluno:", error);
    return false;
  }
}

/**
 * Obtém o role do usuário atual
 * @returns {Promise<string|null>} "admin", "professor", "aluno" ou null
 */
export async function getCurrentUserRole() {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const userData = await getUserFromFirestore(user.uid);
    return userData?.role || null;
  } catch (error) {
    console.error("❌ Erro ao obter role do usuário:", error);
    return null;
  }
}

/**
 * Obtém o nome do usuário atual (nome do professor ou turma do aluno)
 * @returns {Promise<string|null>}
 */
export async function getCurrentUserName() {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const userData = await getUserFromFirestore(user.uid);
    return userData?.name || null;
  } catch (error) {
    console.error("❌ Erro ao obter nome do usuário:", error);
    return null;
  }
}

/**
 * Verifica se o usuário tem permissão para modificar um recurso
 * @param {string} resourceType - Tipo do recurso: "menu", "horario", "horasRestantes", etc.
 * @param {Object} resourceData - Dados do recurso (opcional, usado para verificar ownership)
 * @returns {Promise<boolean>}
 */
export async function canModifyResource(resourceType, resourceData = {}) {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const userData = await getUserFromFirestore(user.uid);
    if (!userData) return false;
    
    // Admin pode modificar tudo
    if (userData.role === "admin") {
      return true;
    }
    
    // Aluno não pode modificar nada
    if (userData.role === "aluno") {
      return false;
    }
    
    // Professor pode modificar apenas seus próprios horários e horas restantes
    if (userData.role === "professor") {
      if (resourceType === "horario" || resourceType === "horasRestantes") {
        // Verifica se o recurso pertence ao professor
        return resourceData.professor === userData.name;
      }
      // Professor não pode modificar outros recursos
      return false;
    }
    
    return false;
  } catch (error) {
    console.error("❌ Erro ao verificar permissão:", error);
    return false;
  }
}

/**
 * Atualiza o timestamp do último login do usuário
 * @param {string} uid - UID do usuário
 * @returns {Promise<void>}
 */
export async function updateLastLogin(uid) {
  try {
    const userDocRef = doc(db, USERS_COLLECTION_PATH, uid);
    await setDoc(userDocRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true });
    
    console.log("✅ Último login atualizado");
  } catch (error) {
    console.error("❌ Erro ao atualizar último login:", error);
    // Não lançar erro, pois isso não deve impedir o login
  }
}