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

/**
 * Calcula o intervalo da semana atual (Segunda a Sexta)
 * @returns {string} Intervalo formatado como "DD/MM - DD/MM"
 */
export const getIntervaloSemanaAtual = () => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  
  // Calcular a segunda-feira da semana atual
  const diasAteSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() + diasAteSegunda);
  
  // Calcular a sexta-feira da semana atual
  const sexta = new Date(segunda);
  sexta.setDate(segunda.getDate() + 4);
  
  // Formatar datas
  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  };
  
  return `${formatarData(segunda)} - ${formatarData(sexta)}`;
};

/**
 * Retorna o nome do mês atual em português
 * @returns {string} Nome do mês
 */
export const getMesAtual = () => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[new Date().getMonth()];
};