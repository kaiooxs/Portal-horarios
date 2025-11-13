import { useState, useEffect } from "react";
import {
  subscribeToProfessores,
  subscribeToDisciplinas,
  subscribeToTurmas,
  subscribeToDisciplinasTurmaAno,
  subscribeToAllSchedules,
  subscribeToAllAvailabilities,
  subscribeToAvailability,
} from "../services/firestoreService";

/**
 * Hook para buscar professores do Firestore
 */
export const useProfessores = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToProfessores((data) => {
      setProfessores(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { professores, loading, error };
};

/**
 * Hook para buscar disciplinas do Firestore
 */
export const useDisciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToDisciplinas((data) => {
      setDisciplinas(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { disciplinas, loading, error };
};

/**
 * Hook para buscar turmas do Firestore
 */
export const useTurmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToTurmas((data) => {
      setTurmas(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { turmas, loading, error };
};

/**
 * Hook para buscar disciplinas por turma/ano do Firestore
 * Inclui tratamento de erros e retry automático
 */
export const useDisciplinasTurmaAno = () => {
  const [disciplinasTurmaAno, setDisciplinasTurmaAno] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let unsubscribe = null;
    
    try {
      unsubscribe = subscribeToDisciplinasTurmaAno((data) => {
        setDisciplinasTurmaAno(data);
        setLoading(false);
        setError(null);
        setRetryCount(0);
      });
    } catch (err) {
      console.error("[useDisciplinasTurmaAno] Erro ao subscrever:", err);
      setError(err.message);
      setLoading(false);
      
      // Retry automático após 3 segundos (máximo 3 tentativas)
      if (retryCount < 3) {
        setTimeout(() => {
          console.log(`[useDisciplinasTurmaAno] Tentativa ${retryCount + 1} de reconexão...`);
          setRetryCount(retryCount + 1);
          setLoading(true);
        }, 3000);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [retryCount]);

  return { disciplinasTurmaAno, loading, error };
};

/**
 * Hook para buscar todos os horários do Firestore
 */
export const useSchedules = (turmas) => {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    if (!turmas || turmas.length === 0) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAllSchedules(turmas, (data) => {
      setSchedules(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [turmas]);

  return { schedules, loading, error };
};

/**
 * Hook para buscar todas as disponibilidades do Firestore
 */
export const useAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllAvailabilities((data) => {
      setAvailabilities(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { availabilities, loading, error };
};

/**
 * Hook para buscar disponibilidade de um professor específico
 */
export const useProfessorAvailability = (professorId) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    if (!professorId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAvailability(professorId, (data) => {
      setAvailability(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [professorId]);

  return { availability, loading, error };
};