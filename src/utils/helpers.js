// Funções utilitárias

/**
 * Formata Firestore Timestamp para Date
 */
export const timestampToDate = (ts) => {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return new Date(ts);
};

/**
 * Normaliza nome removendo acentos e convertendo para minúsculas
 */
export const normalizarNome = (nome) => {
  if (!nome) return "";
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Compara dois nomes ignorando acentos e case
 */
export const compararNomes = (nome1, nome2) => {
  return normalizarNome(nome1) === normalizarNome(nome2);
};

/**
 * Gera ID do documento baseado no nome
 */
export const gerarDocId = (nome) => {
  return nome.toLowerCase().replace(/\s+/g, "_");
};