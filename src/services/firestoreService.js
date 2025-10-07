import { db } from "../firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { FIRESTORE_PATHS } from "../constants";

/**
 * Serviço para interagir com o Firestore
 * Inclui cache local para melhorar performance
 */

// ==================== CACHE LOCAL ====================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = {
  disciplinasTurmaAno: { data: null, timestamp: null },
  professores: { data: null, timestamp: null },
  turmas: { data: null, timestamp: null },
};

const isCacheValid = (cacheKey) => {
  const cached = cache[cacheKey];
  if (!cached.data || !cached.timestamp) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
};

const setCache = (cacheKey, data) => {
  cache[cacheKey] = { data, timestamp: Date.now() };
  console.log(`[Cache] ✅ ${cacheKey} armazenado em cache`);
};

const getCache = (cacheKey) => {
  if (isCacheValid(cacheKey)) {
    console.log(`[Cache] ✅ ${cacheKey} recuperado do cache`);
    return cache[cacheKey].data;
  }
  return null;
};

// ==================== PROFESSORES ====================

export const getProfessores = async () => {
  const snapshot = await getDocs(collection(db, FIRESTORE_PATHS.PROFESSORES));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProfessor = async (professorId) => {
  const docRef = doc(db, FIRESTORE_PATHS.PROFESSORES, professorId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const subscribeToProfessores = (callback) => {
  return onSnapshot(collection(db, FIRESTORE_PATHS.PROFESSORES), (snapshot) => {
    const professores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(professores);
  });
};

// ==================== DISCIPLINAS ====================

export const getDisciplinas = async () => {
  const snapshot = await getDocs(collection(db, FIRESTORE_PATHS.DISCIPLINAS));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToDisciplinas = (callback) => {
  return onSnapshot(collection(db, FIRESTORE_PATHS.DISCIPLINAS), (snapshot) => {
    const disciplinas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(disciplinas);
  });
};

// ==================== TURMAS ====================

export const getTurmas = async () => {
  const snapshot = await getDocs(collection(db, FIRESTORE_PATHS.TURMAS));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToTurmas = (callback) => {
  return onSnapshot(collection(db, FIRESTORE_PATHS.TURMAS), (snapshot) => {
    const turmas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(turmas);
  });
};

// ==================== DISCIPLINAS POR TURMA/ANO ====================

export const getDisciplinasTurmaAno = async () => {
  // Verificar cache primeiro
  const cached = getCache('disciplinasTurmaAno');
  if (cached) return cached;

  // Buscar do Firebase
  const snapshot = await getDocs(collection(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO));
  const data = {};
  snapshot.docs.forEach(doc => {
    data[doc.id] = doc.data();
  });
  
  // Armazenar em cache
  setCache('disciplinasTurmaAno', data);
  
  return data;
};

export const getDisciplinasPorTurma = async (turmaId) => {
  const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turmaId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const subscribeToDisciplinasTurmaAno = (callback) => {
  return onSnapshot(
    collection(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO), 
    (snapshot) => {
      const data = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data();
      });
      console.log("[FirestoreService] ✅ Disciplinas por turma/ano carregadas:", {
        totalTurmas: Object.keys(data).length,
        turmas: Object.keys(data),
        timestamp: new Date().toLocaleTimeString()
      });
      callback(data);
    },
    (error) => {
      console.error("[FirestoreService] ❌ Erro ao carregar disciplinas_turma_ano:", error);
      console.error("[FirestoreService] Verifique se a coleção existe no Firebase Console");
      callback({});
    }
  );
};

// ==================== SCHEDULES ====================

export const getSchedule = async (turmaId) => {
  const docRef = doc(db, FIRESTORE_PATHS.SCHEDULES, turmaId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : { entries: [], published: false };
};

export const updateSchedule = async (turmaId, scheduleData) => {
  const docRef = doc(db, FIRESTORE_PATHS.SCHEDULES, turmaId);
  await setDoc(docRef, scheduleData, { merge: true });
};

export const subscribeToSchedule = (turmaId, callback) => {
  const docRef = doc(db, FIRESTORE_PATHS.SCHEDULES, turmaId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ entries: [], published: false });
    }
  });
};

export const subscribeToAllSchedules = (turmas, callback) => {
  const unsubscribers = [];
  const schedulesData = {};

  turmas.forEach((turma) => {
    const docRef = doc(db, FIRESTORE_PATHS.SCHEDULES, turma);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        schedulesData[turma] = snap.data();
      } else {
        schedulesData[turma] = { entries: [], published: false };
      }
      callback({ ...schedulesData });
    });
    unsubscribers.push(unsub);
  });

  return () => unsubscribers.forEach(unsub => unsub());
};

// ==================== AVAILABILITIES ====================

export const getAvailability = async (professorId) => {
  const docRef = doc(db, FIRESTORE_PATHS.AVAILABILITIES, professorId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateAvailability = async (professorId, availabilityData) => {
  const docRef = doc(db, FIRESTORE_PATHS.AVAILABILITIES, professorId);
  await setDoc(docRef, {
    ...availabilityData,
    lastUpdated: serverTimestamp(),
  }, { merge: true });
};

export const subscribeToAvailability = (professorId, callback) => {
  const docRef = doc(db, FIRESTORE_PATHS.AVAILABILITIES, professorId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
};

export const subscribeToAllAvailabilities = (callback) => {
  return onSnapshot(
    collection(db, FIRESTORE_PATHS.AVAILABILITIES), 
    (snapshot) => {
      const availabilities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("[FirestoreService] ✅ Disponibilidades carregadas:", {
        totalProfessores: availabilities.length,
        professores: availabilities.map(a => a.nome || a.id),
        timestamp: new Date().toLocaleTimeString()
      });
      callback(availabilities);
    },
    (error) => {
      console.error("[FirestoreService] ❌ Erro ao carregar disponibilidades:", error);
      callback([]);
    }
  );
};

// ==================== CLEANUP ====================

export const cleanUpSchedulesAfterUpdate = async (professorNome, newAvailableSlots) => {
  try {
    const schedulesRef = collection(db, FIRESTORE_PATHS.SCHEDULES);
    const schedulesSnap = await getDocs(schedulesRef);
    const batch = writeBatch(db);

    schedulesSnap.forEach((docSnap) => {
      const scheduleData = docSnap.data() || {};
      const originalEntries = scheduleData.entries || [];

      const cleanedEntries = originalEntries.filter((entry) => {
        if (entry.professor !== professorNome) return true;
        
        const stillAvailable = newAvailableSlots.some(
          (slot) =>
            slot.dia === entry.dia &&
            slot.hora === entry.hora &&
            slot.turma === entry.turma
        );
        return stillAvailable;
      });

      if (cleanedEntries.length !== originalEntries.length) {
        const scheduleRefToUpdate = doc(db, FIRESTORE_PATHS.SCHEDULES, docSnap.id);
        batch.update(scheduleRefToUpdate, { entries: cleanedEntries });
      }
    });

    await batch.commit();
  } catch (err) {
    console.error("cleanUpSchedulesAfterUpdate erro:", err);
  }
};

// ==================== HORAS RESTANTES ====================

/**
 * Calcula as horas restantes de cada disciplina para cada professor
 * baseado nas aulas já atribuídas nos horários
 */
export const calcularHorasRestantes = async () => {
  try {
    console.log("[FirestoreService] 🔄 Calculando horas restantes...");
    
    // 1. Buscar dados iniciais das disciplinas por turma
    const disciplinasSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO));
    const disciplinasIniciais = {};
    
    disciplinasSnapshot.docs.forEach(doc => {
      disciplinasIniciais[doc.id] = doc.data();
    });

    // 2. Buscar todos os horários publicados
    const schedulesSnapshot = await getDocs(collection(db, FIRESTORE_PATHS.SCHEDULES));
    
    // 3. Contar horas atribuídas por professor/disciplina/turma
    const horasAtribuidas = {}; // { "Professor-Disciplina-Turma": horasCount }
    
    schedulesSnapshot.docs.forEach(scheduleDoc => {
      const turma = scheduleDoc.id;
      const scheduleData = scheduleDoc.data();
      const entries = scheduleData.entries || [];
      
      entries.forEach(entry => {
        if (entry.professor && entry.disciplina) {
          const key = `${entry.professor}|||${entry.disciplina}|||${turma}`;
          horasAtribuidas[key] = (horasAtribuidas[key] || 0) + 1;
        }
      });
    });

    console.log("[FirestoreService] 📊 Horas atribuídas:", horasAtribuidas);

    // 4. Atualizar horas restantes no Firebase
    const batch = writeBatch(db);
    
    Object.keys(disciplinasIniciais).forEach(turmaId => {
      const turmaData = disciplinasIniciais[turmaId];
      const disciplinasAtualizadas = (turmaData.disciplinas || []).map(disc => {
        const key = `${disc.professor}|||${disc.disciplina}|||${turmaId}`;
        const horasUsadas = horasAtribuidas[key] || 0;
        const horasRestantes = Math.max(0, (disc.horas || 0) - horasUsadas);
        
        return {
          ...disc,
          horasRestantes: horasRestantes,
          horasAtribuidas: horasUsadas
        };
      });
      
      const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turmaId);
      batch.update(docRef, { 
        disciplinas: disciplinasAtualizadas,
        lastCalculated: serverTimestamp()
      });
    });

    await batch.commit();
    console.log("[FirestoreService] ✅ Horas restantes atualizadas com sucesso!");
    
    return { success: true };
  } catch (error) {
    console.error("[FirestoreService] ❌ Erro ao calcular horas restantes:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza as horas restantes de uma turma específica
 */
export const atualizarHorasRestantesTurma = async (turmaId) => {
  try {
    console.log(`[FirestoreService] 🔄 Atualizando horas restantes da turma ${turmaId}...`);
    
    // 1. Buscar dados iniciais da turma
    const turmaDocRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turmaId);
    const turmaDoc = await getDoc(turmaDocRef);
    
    if (!turmaDoc.exists()) {
      console.warn(`[FirestoreService] ⚠️ Turma ${turmaId} não encontrada`);
      return { success: false, error: "Turma não encontrada" };
    }
    
    const turmaData = turmaDoc.data();
    
    // 2. Buscar horário da turma
    const scheduleDocRef = doc(db, FIRESTORE_PATHS.SCHEDULES, turmaId);
    const scheduleDoc = await getDoc(scheduleDocRef);
    
    const entries = scheduleDoc.exists() ? (scheduleDoc.data().entries || []) : [];
    
    // 3. Contar horas atribuídas por professor/disciplina
    const horasAtribuidas = {}; // { "Professor-Disciplina": horasCount }
    
    entries.forEach(entry => {
      if (entry.professor && entry.disciplina) {
        const key = `${entry.professor}|||${entry.disciplina}`;
        horasAtribuidas[key] = (horasAtribuidas[key] || 0) + 1;
      }
    });
    
    // 4. Atualizar horas restantes
    const disciplinasAtualizadas = (turmaData.disciplinas || []).map(disc => {
      const key = `${disc.professor}|||${disc.disciplina}`;
      const horasUsadas = horasAtribuidas[key] || 0;
      const horasRestantes = Math.max(0, (disc.horas || 0) - horasUsadas);
      
      return {
        ...disc,
        horasRestantes: horasRestantes,
        horasAtribuidas: horasUsadas
      };
    });
    
    await updateDoc(turmaDocRef, { 
      disciplinas: disciplinasAtualizadas,
      lastCalculated: serverTimestamp()
    });
    
    console.log(`[FirestoreService] ✅ Horas restantes da turma ${turmaId} atualizadas!`);
    return { success: true };
  } catch (error) {
    console.error(`[FirestoreService] ❌ Erro ao atualizar horas da turma ${turmaId}:`, error);
    return { success: false, error: error.message };
  }
};