import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ProfessorManager from "./ProfessorManager";
import DisciplinaManager from "./DisciplinaManager";
import TurmaManager from "./TurmaManager";
import CursoManager from "./CursoManager";
import { 
  FIRESTORE_PATHS, 
  PROFESSORES_EXEMPLO, 
  DISCIPLINAS, 
  TURMAS, 
  CURSOS,
  TIME_SLOTS,
  DISCIPLINA_CURSO_MAP,
  TURMA_CURSO_MAP,
  DISCIPLINAS_COMPLETAS,
  TURMAS_COMPLETAS,
  CURSOS_COMPLETOS
} from "../constants";

const ADDED_DOC_IDS = {
  professores: "professorAdicionado",
  disciplinas: "disciplinaAdicionada",
  turmas: "turmaAdicionada",
  cursos: "cursoAdicionado",
  timeSlots: "horarioAdicionado"
};

const toSlug = (value) => (value || "").toString().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

const normalizeProfessor = (prof) => {
  if (!prof) {
    return null;
  }
  if (typeof prof === "string") {
    const id = toSlug(prof);
    return {
      id,
      nome: prof,
      disciplinas: [],
      turmas: []
    };
  }
  const nome = prof.nome || prof.nomeProfessor || "";
  const id = prof.id || toSlug(nome);
  return {
    id,
    nome: nome || prof.id || "",
    disciplinas: Array.isArray(prof.disciplinas) ? prof.disciplinas : [],
    turmas: Array.isArray(prof.turmas) ? prof.turmas : []
  };
};

const normalizeDisciplina = (disc) => {
  if (!disc) {
    return null;
  }
  if (typeof disc === "string") {
    const id = toSlug(disc);
    return {
      id,
      nome: disc,
      curso: DISCIPLINA_CURSO_MAP[disc] || "Geral"
    };
  }
  const nome = disc.nome || disc.nomeDisciplina || "";
  const id = disc.id || toSlug(nome);
  return {
    id,
    nome: nome || disc.id || "",
    curso: disc.curso || disc.cursoDisciplina || DISCIPLINA_CURSO_MAP[nome] || "Geral"
  };
};

const normalizeTurma = (turma) => {
  if (!turma) {
    return null;
  }
  if (typeof turma === "string") {
    return {
      id: turma,
      nome: turma,
      curso: TURMA_CURSO_MAP[turma] || "Sem Curso",
      ano: 1
    };
  }
  const nome = turma.nome || turma.id || turma.nomeTurma || "";
  return {
    id: turma.id || nome,
    nome,
    curso: turma.curso || turma.cursoTurma || TURMA_CURSO_MAP[nome] || "Sem Curso",
    ano: turma.ano || turma.anoTurma || 1
  };
};

const normalizeCurso = (curso) => {
  if (!curso) {
    return null;
  }
  if (typeof curso === "string") {
    const id = toSlug(curso);
    return {
      id,
      nome: curso,
      sigla: curso.split(" ").map((p) => p[0]).join("").toUpperCase().substring(0, 5)
    };
  }
  const nome = curso.nome || curso.nomeCurso || "";
  const siglaBase = curso.sigla || curso.siglaCurso || (nome.split(" ").map((p) => p[0]).join("").toUpperCase().substring(0, 5) || "");
  return {
    id: curso.id || toSlug(nome),
    nome: nome || curso.id || "",
    sigla: siglaBase
  };
};

function FirestoreDataManager() {
  const [activeTab, setActiveTab] = useState("professores");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  
  // Estados para cada tipo de dado
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [horasDisciplinas, setHorasDisciplinas] = useState({});
  
  // Estados para controle de migração
  const [needsMigration, setNeedsMigration] = useState({
    professores: false,
    disciplinas: false,
    turmas: false,
    cursos: false,
    timeSlots: false
  });
  
  // Estados para edição
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  
  // Estados para adicionar disciplina a turma
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [horasInput, setHorasInput] = useState(0);

  // Estados para formulários estruturados
  const [ setFormData] = useState({
    // Professor
    nome: "",
    disciplinas: [],
    turmas: [],
    // Disciplina
    nomeDisciplina: "",
    cursoDisciplina: "",
    // Turma
    nomeTurma: "",
    cursoTurma: "",
    anoTurma: "",
    // Curso
    nomeCurso: "",
    siglaCurso: ""
  });

  useEffect(() => {
    // Verificar autenticação antes de carregar dados
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Estado de autenticação:", user ? "Autenticado" : "Não autenticado");
      setAuthUser(user);
      if (user) {
        console.log("✅ Usuário autenticado, carregando dados...");
        loadAllData();
      } else {
        console.log("⚠️ Aguardando autenticação...");
      }
    });
    
    return () => unsubscribe();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProfessores(),
        loadDisciplinas(),
        loadTurmas(),
        loadCursos(),
        loadTimeSlots(),
        loadHorasDisciplinas()
      ]);
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      alert("Erro ao carregar dados do Firestore");
    } finally {
      setLoading(false);
    }
  };

  const loadProfessores = async () => {
    try {
      const fullDocRef = doc(db, FIRESTORE_PATHS.PROFESSORES, "Todos_Professores");
      const fullDocSnap = await getDoc(fullDocRef);
      let professoresAtuais = [];
      let usouConstantes = false;

      if (fullDocSnap.exists()) {
        const data = fullDocSnap.data();
        if (Array.isArray(data.professores)) {
          professoresAtuais = data.professores.map((prof) => normalizeProfessor(prof)).filter(Boolean);
          console.log("✅ Professores carregados do Firestore:", professoresAtuais.length);
        } else if (Array.isArray(data.nomes)) {
          professoresAtuais = data.nomes.map((nome) => normalizeProfessor(nome)).filter(Boolean);
          console.log("⚠️ Professores carregados em formato antigo. Convertendo...", professoresAtuais.length);
          usouConstantes = true;
        }
      }

      if (professoresAtuais.length === 0) {
        professoresAtuais = PROFESSORES_EXEMPLO.map((prof) => normalizeProfessor(prof)).filter(Boolean);
        console.log("⚠️ Nenhum professor encontrado no Firestore. Usando dados das constantes.");
        usouConstantes = true;
      }

      const additionsRef = doc(db, FIRESTORE_PATHS.PROFESSORES, ADDED_DOC_IDS.professores);
      const additionsSnap = await getDoc(additionsRef);
      if (additionsSnap.exists()) {
        const additionsData = additionsSnap.data();
        if (Array.isArray(additionsData.professores)) {
          const mapa = new Map(professoresAtuais.map((prof) => [prof.id, prof]));
          additionsData.professores
            .map((prof) => normalizeProfessor(prof))
            .filter(Boolean)
            .forEach((prof) => {
              mapa.set(prof.id, prof);
            });
          professoresAtuais = Array.from(mapa.values());
        }
      }

      setProfessores(professoresAtuais);
      setNeedsMigration((prev) => ({ ...prev, professores: usouConstantes }));
    } catch (error) {
      console.error("❌ Erro ao carregar professores:", error);
      const fallback = PROFESSORES_EXEMPLO.map((prof) => normalizeProfessor(prof)).filter(Boolean);
      setProfessores(fallback);
      setNeedsMigration((prev) => ({ ...prev, professores: true }));
    }
  };

  const loadDisciplinas = async () => {
    try {
      const fullDocRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS, "Todos_Professores");
      const fullDocSnap = await getDoc(fullDocRef);
      let disciplinasAtuais = [];
      let usouConstantes = false;

      if (fullDocSnap.exists()) {
        const data = fullDocSnap.data();
        if (Array.isArray(data.disciplinas)) {
          disciplinasAtuais = data.disciplinas.map((disc) => normalizeDisciplina(disc)).filter(Boolean);
          console.log("✅ Disciplinas carregadas do Firestore:", disciplinasAtuais.length);
        } else if (Array.isArray(data.nomes)) {
          disciplinasAtuais = data.nomes.map((nome) => normalizeDisciplina(nome)).filter(Boolean);
          console.log("⚠️ Disciplinas carregadas em formato antigo. Convertendo...", disciplinasAtuais.length);
          usouConstantes = true;
        }
      }

      if (disciplinasAtuais.length === 0) {
        disciplinasAtuais = DISCIPLINAS_COMPLETAS.map((disc) => normalizeDisciplina(disc)).filter(Boolean);
        console.log("⚠️ Nenhuma disciplina encontrada no Firestore. Usando dados das constantes.");
        usouConstantes = true;
      }

      const additionsRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS, ADDED_DOC_IDS.disciplinas);
      const additionsSnap = await getDoc(additionsRef);
      if (additionsSnap.exists()) {
        const additionsData = additionsSnap.data();
        if (Array.isArray(additionsData.disciplinas)) {
          const mapa = new Map(disciplinasAtuais.map((disc) => [disc.id, disc]));
          additionsData.disciplinas
            .map((disc) => normalizeDisciplina(disc))
            .filter(Boolean)
            .forEach((disc) => {
              mapa.set(disc.id, disc);
            });
          disciplinasAtuais = Array.from(mapa.values());
        }
      }

      setDisciplinas(disciplinasAtuais);
      setNeedsMigration((prev) => ({ ...prev, disciplinas: usouConstantes }));
    } catch (error) {
      console.error("❌ Erro ao carregar disciplinas:", error);
      const fallback = DISCIPLINAS_COMPLETAS.map((disc) => normalizeDisciplina(disc)).filter(Boolean);
      setDisciplinas(fallback);
      setNeedsMigration((prev) => ({ ...prev, disciplinas: true }));
    }
  };

  const loadTurmas = async () => {
    try {
      const docRef = doc(db, FIRESTORE_PATHS.TURMAS, "Todos_Professores");
      const docSnap = await getDoc(docRef);
      let turmasAtuais = [];
      let usouConstantes = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.turmas)) {
          turmasAtuais = data.turmas.map((turma) => normalizeTurma(turma)).filter(Boolean);
          console.log("✅ Turmas carregadas do Firestore:", turmasAtuais.length);
        } else if (Array.isArray(data.nomes)) {
          turmasAtuais = data.nomes.map((nome) => normalizeTurma(nome)).filter(Boolean);
          console.log("⚠️ Turmas carregadas em formato antigo. Convertendo...", turmasAtuais.length);
          usouConstantes = true;
        }
      }

      if (turmasAtuais.length === 0) {
        turmasAtuais = TURMAS_COMPLETAS.map((turma) => normalizeTurma(turma)).filter(Boolean);
        console.log("⚠️ Nenhuma turma encontrada no Firestore. Usando dados das constantes.");
        usouConstantes = true;
      }

      const additionsRef = doc(db, FIRESTORE_PATHS.TURMAS, ADDED_DOC_IDS.turmas);
      const additionsSnap = await getDoc(additionsRef);
      if (additionsSnap.exists()) {
        const additionsData = additionsSnap.data();
        if (Array.isArray(additionsData.turmas)) {
          const mapa = new Map(turmasAtuais.map((turma) => [turma.id, turma]));
          additionsData.turmas
            .map((turma) => normalizeTurma(turma))
            .filter(Boolean)
            .forEach((turma) => {
              mapa.set(turma.id, turma);
            });
          turmasAtuais = Array.from(mapa.values());
        }
      }

      setTurmas(turmasAtuais);
      setNeedsMigration((prev) => ({ ...prev, turmas: usouConstantes }));
    } catch (error) {
      console.error("❌ Erro ao carregar turmas:", error);
      const fallback = TURMAS_COMPLETAS.map((turma) => normalizeTurma(turma)).filter(Boolean);
      setTurmas(fallback);
      setNeedsMigration((prev) => ({ ...prev, turmas: true }));
    }
  };

  const loadCursos = async () => {
    try {
      const docRef = doc(db, FIRESTORE_PATHS.CURSOS, "Todos_Professores");
      const docSnap = await getDoc(docRef);
      let cursosAtuais = [];
      let usouConstantes = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.cursos)) {
          cursosAtuais = data.cursos.map((curso) => normalizeCurso(curso)).filter(Boolean);
          console.log("✅ Cursos carregados do Firestore:", cursosAtuais.length);
        } else if (Array.isArray(data.nomes)) {
          cursosAtuais = data.nomes.map((nome) => normalizeCurso(nome)).filter(Boolean);
          console.log("⚠️ Cursos carregados em formato antigo. Convertendo...", cursosAtuais.length);
          usouConstantes = true;
        }
      }

      if (cursosAtuais.length === 0) {
        cursosAtuais = CURSOS_COMPLETOS.map((curso) => normalizeCurso(curso)).filter(Boolean);
        console.log("⚠️ Nenhum curso encontrado no Firestore. Usando dados das constantes.");
        usouConstantes = true;
      }

      const additionsRef = doc(db, FIRESTORE_PATHS.CURSOS, ADDED_DOC_IDS.cursos);
      const additionsSnap = await getDoc(additionsRef);
      if (additionsSnap.exists()) {
        const additionsData = additionsSnap.data();
        if (Array.isArray(additionsData.cursos)) {
          const mapa = new Map(cursosAtuais.map((curso) => [curso.id, curso]));
          additionsData.cursos
            .map((curso) => normalizeCurso(curso))
            .filter(Boolean)
            .forEach((curso) => {
              mapa.set(curso.id, curso);
            });
          cursosAtuais = Array.from(mapa.values());
        }
      }

      setCursos(cursosAtuais);
      setNeedsMigration((prev) => ({ ...prev, cursos: usouConstantes }));
    } catch (error) {
      console.error("❌ Erro ao carregar cursos:", error);
      const fallback = CURSOS_COMPLETOS.map((curso) => normalizeCurso(curso)).filter(Boolean);
      setCursos(fallback);
      setNeedsMigration((prev) => ({ ...prev, cursos: true }));
    }
  };

  const loadTimeSlots = async () => {
    try {
      const basePath = "artifacts/default-app-id/public/data/config";
      const docRef = doc(db, basePath, "timeSlots");
      const docSnap = await getDoc(docRef);
      let slotsAtuais = [];
      let usouConstantes = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        slotsAtuais = Array.isArray(data.slots) ? data.slots : [];
        console.log("✅ Horários carregados do Firestore:", slotsAtuais.length);
      }

      if (slotsAtuais.length === 0) {
        slotsAtuais = [...TIME_SLOTS];
        console.log("⚠️ Nenhum horário encontrado no Firestore. Usando dados das constantes.");
        usouConstantes = true;
      }

      const additionsRef = doc(db, basePath, ADDED_DOC_IDS.timeSlots);
      const additionsSnap = await getDoc(additionsRef);
      if (additionsSnap.exists()) {
        const additionsData = additionsSnap.data();
        if (Array.isArray(additionsData.slots)) {
          const conjunto = new Set(slotsAtuais);
          additionsData.slots.forEach((slot) => {
            if (slot) {
              conjunto.add(slot);
            }
          });
          slotsAtuais = Array.from(conjunto);
        }
      }

      setTimeSlots(slotsAtuais);
      setNeedsMigration((prev) => ({ ...prev, timeSlots: usouConstantes }));
    } catch (error) {
      console.error("❌ Erro ao carregar horários:", error);
      setTimeSlots([...TIME_SLOTS]);
      setNeedsMigration((prev) => ({ ...prev, timeSlots: true }));
    }
  };

  const loadHorasDisciplinas = async () => {
    try {
      const collectionRef = collection(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO);
      const snapshot = await getDocs(collectionRef);
      const horas = {};
      snapshot.forEach(doc => {
        horas[doc.id] = doc.data();
      });
      setHorasDisciplinas(horas);
      console.log("✅ Horas de disciplinas carregadas:", Object.keys(horas).length, "turmas");
    } catch (error) {
      console.error("❌ Erro ao carregar horas de disciplinas:", error);
      setHorasDisciplinas({});
    }
  };

  const migrateAllData = async () => {
    if (!window.confirm("Deseja migrar TODOS os dados das constantes para o Firestore? Isso irá sobrescrever dados existentes.")) {
      return;
    }

    setSaving(true);
    try {
      const promises = [];
      
      if (needsMigration.professores) {
        promises.push(saveProfessores(PROFESSORES_EXEMPLO, true));
      }
      if (needsMigration.disciplinas) {
        promises.push(saveDisciplinas(DISCIPLINAS_COMPLETAS, true));
      }
      if (needsMigration.turmas) {
        promises.push(saveTurmas(TURMAS_COMPLETAS, true));
      }
      if (needsMigration.cursos) {
        promises.push(saveCursos(CURSOS_COMPLETOS, true));
      }
      if (needsMigration.timeSlots) {
        promises.push(saveTimeSlots(TIME_SLOTS, true));
      }

      await Promise.all(promises);
      
      setNeedsMigration({
        professores: false,
        disciplinas: false,
        turmas: false,
        cursos: false,
        timeSlots: false
      });

      alert("✅ Migração concluída com sucesso!");
    } catch (error) {
      console.error("❌ Erro na migração:", error);
      alert("❌ Erro ao migrar dados");
    } finally {
      setSaving(false);
    }
  };

  const saveProfessores = async (newList, silent = false) => {
    setSaving(true);
    try {
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        if (!silent) alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }

      const listaNormalizada = (newList || []).map((prof) => normalizeProfessor(prof)).filter(Boolean);
      const baseIds = new Set(PROFESSORES_EXEMPLO.map((prof) => normalizeProfessor(prof).id));
      const adicionados = listaNormalizada.filter((prof) => !baseIds.has(prof.id));

      console.log("💾 Salvando professores no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.PROFESSORES);
      console.log("📊 Total de professores:", listaNormalizada.length);
      console.log("➕ Professores adicionados:", adicionados.length);

      await setDoc(doc(db, FIRESTORE_PATHS.PROFESSORES, ADDED_DOC_IDS.professores), {
        professores: adicionados,
        lastUpdated: new Date()
      });

      await setDoc(doc(db, FIRESTORE_PATHS.PROFESSORES, "Todos_Professores"), {
        professores: listaNormalizada,
        lastUpdated: new Date()
      });

      setProfessores(listaNormalizada);
      if (!silent) alert("✅ Professores atualizados com sucesso!");
      console.log("✅ Professores salvos no Firestore:", listaNormalizada.length);
    } catch (error) {
      console.error("❌ Erro ao salvar professores:", error);
      console.error("❌ Código do erro:", error.code);
      console.error("❌ Mensagem:", error.message);
      
      if (error.code === 'permission-denied') {
        if (!silent) alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        if (!silent) alert("❌ Erro ao salvar professores: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveDisciplinas = async (newList, silent = false) => {
    setSaving(true);
    try {
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        if (!silent) alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }

      const listaNormalizada = (newList || []).map((disc) => normalizeDisciplina(disc)).filter(Boolean);
      const baseIds = new Set(DISCIPLINAS_COMPLETAS.map((disc) => normalizeDisciplina(disc).id));
      const adicionadas = listaNormalizada.filter((disc) => !baseIds.has(disc.id));

      console.log("💾 Salvando disciplinas no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.DISCIPLINAS);
      console.log("📊 Total de disciplinas:", listaNormalizada.length);
      console.log("➕ Disciplinas adicionadas:", adicionadas.length);

      await setDoc(doc(db, FIRESTORE_PATHS.DISCIPLINAS, ADDED_DOC_IDS.disciplinas), {
        disciplinas: adicionadas,
        lastUpdated: new Date()
      });

      await setDoc(doc(db, FIRESTORE_PATHS.DISCIPLINAS, "Todos_Professores"), {
        disciplinas: listaNormalizada,
        lastUpdated: new Date()
      });
      
      setDisciplinas(listaNormalizada);
      if (!silent) alert("✅ Disciplinas atualizadas com sucesso!");
      console.log("✅ Disciplinas salvas no Firestore:", listaNormalizada.length);
    } catch (error) {
      console.error("❌ Erro ao salvar disciplinas:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        if (!silent) alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        if (!silent) alert("❌ Erro ao salvar disciplinas: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveTurmas = async (newList, silent = false) => {
    setSaving(true);
    try {
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        if (!silent) alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }

      const listaNormalizada = (newList || []).map((turma) => normalizeTurma(turma)).filter(Boolean);
      const baseIds = new Set(TURMAS_COMPLETAS.map((turma) => normalizeTurma(turma).id));
      const adicionadas = listaNormalizada.filter((turma) => !baseIds.has(turma.id));

      console.log("💾 Salvando turmas no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.TURMAS);
      console.log("📊 Total de turmas:", listaNormalizada.length);
      console.log("➕ Turmas adicionadas:", adicionadas.length);

      await setDoc(doc(db, FIRESTORE_PATHS.TURMAS, ADDED_DOC_IDS.turmas), {
        turmas: adicionadas,
        lastUpdated: new Date()
      });

      await setDoc(doc(db, FIRESTORE_PATHS.TURMAS, "Todos_Professores"), {
        turmas: listaNormalizada,
        lastUpdated: new Date()
      });
      
      setTurmas(listaNormalizada);
      if (!silent) alert("✅ Turmas atualizadas com sucesso!");
      console.log("✅ Turmas salvas no Firestore:", listaNormalizada.length);
    } catch (error) {
      console.error("❌ Erro ao salvar turmas:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        if (!silent) alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        if (!silent) alert("❌ Erro ao salvar turmas: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveCursos = async (newList, silent = false) => {
    setSaving(true);
    try {
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        if (!silent) alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }

      const listaNormalizada = (newList || []).map((curso) => normalizeCurso(curso)).filter(Boolean);
      const baseIds = new Set(CURSOS_COMPLETOS.map((curso) => normalizeCurso(curso).id));
      const adicionados = listaNormalizada.filter((curso) => !baseIds.has(curso.id));

      console.log("💾 Salvando cursos no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.CURSOS);
      console.log("📊 Total de cursos:", listaNormalizada.length);
      console.log("➕ Cursos adicionados:", adicionados.length);

      await setDoc(doc(db, FIRESTORE_PATHS.CURSOS, ADDED_DOC_IDS.cursos), {
        cursos: adicionados,
        lastUpdated: new Date()
      });

      await setDoc(doc(db, FIRESTORE_PATHS.CURSOS, "Todos_Professores"), {
        cursos: listaNormalizada,
        lastUpdated: new Date()
      });
      
      setCursos(listaNormalizada);
      if (!silent) alert("✅ Cursos atualizados com sucesso!");
      console.log("✅ Cursos salvos no Firestore:", listaNormalizada.length);
    } catch (error) {
      console.error("❌ Erro ao salvar cursos:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        if (!silent) alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        if (!silent) alert("❌ Erro ao salvar cursos: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveTimeSlots = async (newList, silent = false) => {
    setSaving(true);
    try {
      // Verificar autenticação
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        if (!silent) alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }
      
      console.log("💾 Salvando horários no Firestore...");
      console.log("📍 Path: artifacts/default-app-id/public/data/config");
      console.log("📊 Total de horários:", newList.length);
      
      await setDoc(doc(db, "artifacts/default-app-id/public/data/config", "timeSlots"), {
        slots: newList,
        lastUpdated: new Date()
      });
      
      setTimeSlots(newList);
      if (!silent) alert("✅ Horários atualizados com sucesso!");
      console.log("✅ Horários salvos no Firestore");
    } catch (error) {
      console.error("❌ Erro ao salvar horários:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        if (!silent) alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        if (!silent) alert("❌ Erro ao salvar horários: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveHorasDisciplina = async (turma, disciplina, novasHoras) => {
    setSaving(true);
    try {
      // Verificar autenticação
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }
      
      console.log("💾 Salvando horas de disciplina no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO);
      console.log("📊 Turma:", turma, "| Disciplina:", disciplina, "| Horas:", novasHoras);
      
      const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turma);
      const currentData = horasDisciplinas[turma] || {};
      
      const updatedData = {
        ...currentData,
        [disciplina]: novasHoras,
        lastUpdated: new Date()
      };

      await setDoc(docRef, updatedData, { merge: true });
      
      setHorasDisciplinas(prev => ({
        ...prev,
        [turma]: updatedData
      }));

      console.log(`✅ Horas salvas: ${turma} - ${disciplina} = ${novasHoras}h`);
    } catch (error) {
      console.error("❌ Erro ao salvar horas:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        alert("❌ Erro ao salvar horas da disciplina: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const addDisciplinaToTurma = async (turma, disciplina, horas) => {
    if (!disciplina || !turma) {
      alert("Selecione uma turma e uma disciplina!");
      return;
    }

    setSaving(true);
    try {
      // Verificar autenticação
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }
      
      console.log("💾 Adicionando disciplina à turma no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO);
      console.log("📊 Turma:", turma, "| Disciplina:", disciplina, "| Horas:", horas);
      
      const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turma);
      const currentData = horasDisciplinas[turma] || {};
      
      if (currentData[disciplina] !== undefined) {
        alert("Esta disciplina já está configurada para esta turma!");
        setSaving(false);
        return;
      }

      const updatedData = {
        ...currentData,
        [disciplina]: horas || 0,
        lastUpdated: new Date()
      };

      await setDoc(docRef, updatedData, { merge: true });
      
      setHorasDisciplinas(prev => ({
        ...prev,
        [turma]: updatedData
      }));

      alert(`✅ Disciplina "${disciplina}" adicionada à turma ${turma}!`);
      console.log(`✅ Disciplina adicionada: ${turma} - ${disciplina} = ${horas}h`);
    } catch (error) {
      console.error("❌ Erro ao adicionar disciplina:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        alert("❌ Erro ao adicionar disciplina à turma: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const removeDisciplinaFromTurma = async (turma, disciplina) => {
    if (!window.confirm(`Deseja remover a disciplina "${disciplina}" da turma ${turma}?`)) {
      return;
    }

    setSaving(true);
    try {
      // Verificar autenticação
      if (!authUser) {
        console.error("❌ Usuário não autenticado!");
        alert("❌ Erro: Você precisa estar autenticado para salvar dados");
        return;
      }
      
      console.log("💾 Removendo disciplina da turma no Firestore...");
      console.log("📍 Path:", FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO);
      console.log("📊 Turma:", turma, "| Disciplina:", disciplina);
      
      const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turma);
      const currentData = horasDisciplinas[turma] || {};
      
      const { [disciplina]: removed, ...updatedData } = currentData;
      updatedData.lastUpdated = new Date();

      await setDoc(docRef, updatedData, { merge: true });
      
      setHorasDisciplinas(prev => ({
        ...prev,
        [turma]: updatedData
      }));

      alert(`✅ Disciplina "${disciplina}" removida da turma ${turma}!`);
      console.log(`✅ Disciplina removida: ${turma} - ${disciplina}`);
    } catch (error) {
      console.error("❌ Erro ao remover disciplina:", error);
      console.error("❌ Código do erro:", error.code);
      
      if (error.code === 'permission-denied') {
        alert("❌ Erro de permissão: Verifique se você está autenticado");
      } else {
        alert("❌ Erro ao remover disciplina da turma: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index, currentValue) => {
    setEditingId(index);
    setEditValue(currentValue);
  };

  const handleSaveEdit = async (index) => {
    if (!editValue.trim()) {
      alert("O valor não pode estar vazio!");
      return;
    }

    let newList;
    switch (activeTab) {
      case "professores":
        newList = [...professores];
        newList[index] = editValue.trim();
        await saveProfessores(newList);
        break;
      case "disciplinas":
        newList = [...disciplinas];
        newList[index] = editValue.trim();
        await saveDisciplinas(newList);
        break;
      case "turmas":
        newList = [...turmas];
        newList[index] = editValue.trim();
        await saveTurmas(newList);
        break;
      case "cursos":
        newList = [...cursos];
        newList[index] = editValue.trim();
        await saveCursos(newList);
        break;
      case "timeSlots":
        newList = [...timeSlots];
        newList[index] = editValue.trim();
        await saveTimeSlots(newList);
        break;
      default:
        break;
    }

    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    let newList;
    switch (activeTab) {
      case "professores":
        newList = professores.filter((_, i) => i !== index);
        await saveProfessores(newList);
        break;
      case "disciplinas":
        newList = disciplinas.filter((_, i) => i !== index);
        await saveDisciplinas(newList);
        break;
      case "turmas":
        newList = turmas.filter((_, i) => i !== index);
        await saveTurmas(newList);
        break;
      case "cursos":
        newList = cursos.filter((_, i) => i !== index);
        await saveCursos(newList);
        break;
      case "timeSlots":
        newList = timeSlots.filter((_, i) => i !== index);
        await saveTimeSlots(newList);
        break;
      default:
        break;
    }
  };

  const handleAddNew = async () => {
    if (!newItemValue.trim()) {
      alert("O valor não pode estar vazio!");
      return;
    }

    let newList;
    switch (activeTab) {
      case "professores":
        newList = [...professores, newItemValue.trim()];
        await saveProfessores(newList);
        break;
      case "disciplinas":
        newList = [...disciplinas, newItemValue.trim()];
        await saveDisciplinas(newList);
        break;
      case "turmas":
        newList = [...turmas, newItemValue.trim()];
        await saveTurmas(newList);
        break;
      case "cursos":
        newList = [...cursos, newItemValue.trim()];
        await saveCursos(newList);
        break;
      case "timeSlots":
        newList = [...timeSlots, newItemValue.trim()];
        await saveTimeSlots(newList);
        break;
      default:
        break;
    }

    setNewItemValue("");
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "professores":
        return "👨‍🏫 Professores";
      case "disciplinas":
        return "📚 Disciplinas por Curso";
      case "turmas":
        return "🎓 Turmas por Curso";
      case "cursos":
        return "🎯 Cursos";
      case "timeSlots":
        return "⏰ Horários da Grelha";
      case "horasDisciplinas":
        return "⏱️ Horas por Disciplina/Turma";
      default:
        return "";
    }
  };

  const getDataSource = () => {
    const key = activeTab;
    if (needsMigration[key]) {
      return "⚠️ Dados das constantes (não salvos no Firestore)";
    }
    return "✅ Dados do Firestore";
  };

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      nome: "",
      disciplinas: [],
      turmas: [],
      nomeDisciplina: "",
      cursoDisciplina: "",
      nomeTurma: "",
      cursoTurma: "",
      anoTurma: "",
      nomeCurso: "",
      siglaCurso: ""
    });

  };

  // Função para lidar com mudanças no formulário
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para adicionar/remover item de array no formulário
  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Carregando dados do Firestore...</p>
      </div>
    );
  }

  const hasMigrationNeeded = Object.values(needsMigration).some(v => v);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-md"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          🔧 Gestão de Dados do Firestore
        </h2>
        
        {hasMigrationNeeded && (
          <button
            onClick={migrateAllData}
            disabled={saving}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            <span>📦</span>
            <span>Migrar Dados Iniciais</span>
          </button>
        )}
      </div>

      {/* Alerta de migração */}
      {hasMigrationNeeded && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>Migração Necessária</span>
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Alguns dados ainda não foram salvos no Firestore. Clique em "Migrar Dados Iniciais" para copiar os dados das constantes do código para o Firestore.
          </p>
          <div className="text-xs text-yellow-600 space-y-1">
            {needsMigration.professores && <p>• Professores: {PROFESSORES_EXEMPLO.length} itens</p>}
            {needsMigration.disciplinas && <p>• Disciplinas: {DISCIPLINAS.length} itens</p>}
            {needsMigration.turmas && <p>• Turmas: {TURMAS.length} itens</p>}
            {needsMigration.cursos && <p>• Cursos: {CURSOS.length} itens</p>}
            {needsMigration.timeSlots && <p>• Horários: {TIME_SLOTS.length} itens</p>}
          </div>
        </div>
      )}

      {/* Abas de navegação */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setActiveTab("professores")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "professores"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👨‍🏫 Professores
        </button>
        <button
          onClick={() => setActiveTab("disciplinas")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "disciplinas"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📚 Disciplinas
        </button>
        <button
          onClick={() => setActiveTab("turmas")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "turmas"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🎓 Turmas
        </button>
        <button
          onClick={() => setActiveTab("cursos")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "cursos"
              ? "bg-amber-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🎯 Cursos
        </button>
        <button
          onClick={() => setActiveTab("timeSlots")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "timeSlots"
              ? "bg-orange-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ⏰ Horários
        </button>
        <button
          onClick={() => setActiveTab("horasDisciplinas")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === "horasDisciplinas"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ⏱️ Horas/Disciplina
        </button>
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="border-2 border-gray-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{getTabTitle()}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {getDataSource()}
          </span>
        </div>

        {activeTab === "horasDisciplinas" ? (
          // Visualização especial para horas por disciplina/turma
          <div className="space-y-6">
            {/* Formulário para adicionar disciplina a turma */}
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">➕ Adicionar Disciplina a Turma</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={selectedTurma}
                  onChange={(e) => setSelectedTurma(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Selecione a Turma</option>
                  {turmas.map((turma) => (
                    <option key={turma} value={turma}>{turma}</option>
                  ))}
                </select>
                <select
                  value={selectedDisciplina}
                  onChange={(e) => setSelectedDisciplina(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Selecione a Disciplina</option>
                  {disciplinas.map((disc) => (
                    <option key={disc} value={disc}>{disc}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={horasInput}
                  onChange={(e) => setHorasInput(parseInt(e.target.value) || 0)}
                  placeholder="Horas"
                  min="0"
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={() => {
                    addDisciplinaToTurma(selectedTurma, selectedDisciplina, horasInput);
                    setSelectedTurma("");
                    setSelectedDisciplina("");
                    setHorasInput(0);
                  }}
                  disabled={saving || !selectedTurma || !selectedDisciplina}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "⏳" : "➕ Adicionar"}
                </button>
              </div>
            </div>

            {/* Lista de turmas com suas disciplinas */}
            {Object.keys(horasDisciplinas).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">📭 Nenhuma turma com horas configuradas</p>
                <p className="text-sm mt-2">Adicione disciplinas às turmas usando o formulário acima</p>
              </div>
            ) : (
              Object.entries(horasDisciplinas).map(([turma, dados]) => (
                <div key={turma} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                  <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2 text-lg">
                    <span>🎓</span>
                    <span>Turma {turma}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(dados)
                      .filter(([key]) => key !== 'lastUpdated')
                      .map(([disciplina, horas]) => (
                        <div key={disciplina} className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                          <span className="text-sm text-gray-700 flex-1 font-medium">{disciplina}</span>
                          <input
                            type="number"
                            value={horas}
                            onChange={(e) => {
                              const novasHoras = parseInt(e.target.value) || 0;
                              saveHorasDisciplina(turma, disciplina, novasHoras);
                            }}
                            className="w-16 px-2 py-1 border-2 border-gray-300 rounded text-center text-sm font-semibold focus:outline-none focus:border-indigo-500"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">h</span>
                          <button
                            onClick={() => removeDisciplinaFromTurma(turma, disciplina)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                            title="Remover disciplina"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Lista de itens - Cada aba agora usa seu próprio manager */}
            {activeTab === "professores" ? (
              // Visualização estruturada para professores
              <ProfessorManager
                professores={professores}
                disciplinas={disciplinas.map(d => typeof d === 'string' ? d : d.nome)}
                turmas={turmas.map(t => typeof t === 'string' ? t : t.nome)}
                onSave={saveProfessores}
                onDelete={saveProfessores}
                saving={saving}
              />
            ) : activeTab === "disciplinas" ? (
              // Visualização estruturada para disciplinas
              <DisciplinaManager
                disciplinas={disciplinas}
                cursos={cursos.map(c => typeof c === 'string' ? c : c.nome)}
                onSave={saveDisciplinas}
                onDelete={saveDisciplinas}
                saving={saving}
              />
            ) : activeTab === "turmas" ? (
              // Visualização estruturada para turmas
              <TurmaManager
                turmas={turmas}
                cursos={cursos.map(c => typeof c === 'string' ? c : c.nome)}
                onSave={saveTurmas}
                onDelete={saveTurmas}
                saving={saving}
              />
            ) : activeTab === "cursos" ? (
              // Visualização estruturada para cursos
              <CursoManager
                cursos={cursos}
                onSave={saveCursos}
                onDelete={saveCursos}
                saving={saving}
              />
            ) : (
              // Visualização padrão para timeSlots
              <>
                {/* Formulário para adicionar novo horário */}
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">➕ Adicionar Novo Horário</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemValue}
                      onChange={(e) => setNewItemValue(e.target.value)}
                      placeholder="Ex: 08:00 - 09:00"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddNew();
                      }}
                    />
                    <button
                      onClick={handleAddNew}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
                    >
                      {saving ? "⏳" : "➕ Adicionar"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {timeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">📭 Nenhum horário encontrado</p>
                    <p className="text-sm mt-2">Adicione o primeiro horário acima</p>
                  </div>
                ) : (
                  timeSlots.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {editingId === index ? (
                        <>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleSaveEdit(index);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(index)}
                            disabled={saving}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
                          >
                            ✅
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium text-gray-800">{item}</span>
                          <button
                            onClick={() => handleEdit(index, item)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors text-sm"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            disabled={saving}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors text-sm disabled:opacity-50"
                          >
                            🗑️ Excluir
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
                </div>
              </>
            )}

            {/* Informação adicional - apenas para timeSlots */}
            {activeTab === "timeSlots" && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Informação:</strong> Total de horários: <strong>{timeSlots.length}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  As alterações são salvas automaticamente no Firestore e refletirão em todo o sistema.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default FirestoreDataManager;