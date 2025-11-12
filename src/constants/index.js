export const DAYS_OF_WEEK = ["2ª Feira", "3ª Feira", "4ª Feira", "5ª Feira", "6ª Feira"];

export const TIME_SLOTS = [
  "08:45 - 10:15",
  "10:30 - 12:30",
  "Almoço",
  "13:15 - 14:15",
  "14:15 - 16:30",
];

// Estrutura completa de cursos com todas as informações
export const CURSOS_COMPLETOS = [
  { id: "programacao_informatica", nome: "Programação Informática", sigla: "PI" },
  { id: "gestao_informatica", nome: "Gestão Informática", sigla: "IG" },
  { id: "cabeleireiro", nome: "Cabeleireiro(a)", sigla: "CC" },
  { id: "termalismo", nome: "Termalismo", sigla: "TE" }
];

// Lista de nomes para compatibilidade com código antigo
export const CURSOS = CURSOS_COMPLETOS.map(c => c.nome);

// Estrutura completa de turmas com todas as informações
export const TURMAS_COMPLETAS = [
  { id: "PI01", nome: "PI01", curso: "Programação Informática", ano: 1 },
  { id: "PI02", nome: "PI02", curso: "Programação Informática", ano: 2 },
  { id: "IG01", nome: "IG01", curso: "Gestão Informática", ano: 1 },
  { id: "IG02", nome: "IG02", curso: "Gestão Informática", ano: 2 },
  { id: "CC03", nome: "CC03", curso: "Cabeleireiro(a)", ano: 3 },
  { id: "CC04", nome: "CC04", curso: "Cabeleireiro(a)", ano: 4 },
  { id: "CC05", nome: "CC05", curso: "Cabeleireiro(a)", ano: 5 },
  { id: "TE12", nome: "TE12", curso: "Termalismo", ano: 12 },
  { id: "TE13", nome: "TE13", curso: "Termalismo", ano: 13 },
  { id: "TE14", nome: "TE14", curso: "Termalismo", ano: 14 }
];

// Lista de nomes para compatibilidade com código antigo
export const TURMAS = TURMAS_COMPLETAS.map(t => t.nome);

// Mapeamento de turmas para cursos (baseado nos prefixos)
export const TURMA_CURSO_MAP = {
  "PI01": "Programação Informática",
  "PI02": "Programação Informática",
  "IG01": "Gestão Informática",
  "IG02": "Gestão Informática",
  "CC03": "Cabeleireiro(a)",
  "CC04": "Cabeleireiro(a)",
  "CC05": "Cabeleireiro(a)",
  "TE12": "Termalismo",
  "TE13": "Termalismo",
  "TE14": "Termalismo"
};

// Mapeamento de disciplinas para cursos
export const DISCIPLINA_CURSO_MAP = {
  "CloudOps e Cloud Automation": "Programação Informática",
  "Fundamentos de Python": "Programação Informática",
  "Inglês": "Geral",
  "Matemática": "Geral",
  "Português": "Geral",
  "Educação Física": "Geral",
  "Física e Química": "Geral",
  "Área de Integração": "Geral",
  "TIC": "Geral",
  "Estágio Formativo": "Geral",
  "Prova de Aptidão Profissonal": "Geral",
  "Recuperação": "Geral",
  "Cortes de Cabelo - Principios": "Cabeleireiro(a)",
  "Cortes de Cabelo - Tecnicas": "Cabeleireiro(a)",
  "Postiço - Aplicação - Postiço - Aplicação e Manutenção": "Cabeleireiro(a)",
  "Tecnicas de Cortes de Cabelo Feminino": "Cabeleireiro(a)",
  "Extensões e Alongamento do Cabelo": "Cabeleireiro(a)",
  "Tecnicas de Cortes de Cabelo Masculino": "Cabeleireiro(a)",
  "Cuidados Especificos com a Barba e Bigode": "Cabeleireiro(a)",
  "Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode": "Cabeleireiro(a)"
};

// Estrutura completa de professores com todas as informações
export const PROFESSORES_EXEMPLO = [
  {
    id: "joao_leite",
    nome: "João Leite",
    disciplinas: ["Redes", "Arquitetura interna do computador", "Sistemas Operativos", "CloudOps e Cloud Automation"],
    turmas: ["PI01", "PI02", "IG01", "IG02"]
  },
  {
    id: "rui_silva",
    nome: "Rui Silva",
    disciplinas: ["Algoritmos", "TIC", "Fundamentos de Python", "Estágio Formativo"],
    turmas: ["PI01", "PI02", "IG01", "IG02", "TE12", "TE13", "TE14", "CC03", "CC04", "CC05"]
  },
  {
    id: "telmo_baldaia",
    nome: "Telmo Baldaia",
    disciplinas: ["HTML e CSS", "JavaScript", "Desenvolvimento Web", "MySQL"],
    turmas: ["PI01", "PI02", "IG01", "IG02"]
  },
  {
    id: "sonia_pinto",
    nome: "Sónia Pinto",
    disciplinas: ["Matemática"],
    turmas: ["PI01", "PI02", "TE12", "TE13", "TE14"]
  },
  {
    id: "natalia_cardoso",
    nome: "Natália Cardoso",
    disciplinas: ["Português"],
    turmas: ["PI01", "PI02"]
  },
  {
    id: "rafaela_leite",
    nome: "Rafaela Leite",
    disciplinas: ["Português"],
    turmas: ["CC03", "CC04", "CC05", "TE12", "TE13", "TE14"]
  },
  {
    id: "ana_teixeira",
    nome: "Ana Teixeira",
    disciplinas: ["Inglês"],
    turmas: ["PI01", "PI02", "CC03", "CC04", "CC05"]
  },
  {
    id: "ricardo_silveira",
    nome: "Ricardo Silveira",
    disciplinas: ["Educação Física"],
    turmas: ["PI01", "PI02", "IG01", "IG02", "TE12", "TE13", "TE14", "CC03", "CC04", "CC05"]
  },
  {
    id: "vera_rafaela",
    nome: "Vera Rafaela",
    disciplinas: ["Física e Química"],
    turmas: ["PI01", "PI02", "TE12", "TE13", "TE14"]
  },
  {
    id: "guilherme",
    nome: "Guilherme",
    disciplinas: ["Área de Integração", "Prova de Aptidão Profissonal", "Estágio Formativo"],
    turmas: ["TE12", "TE13", "TE14", "CC03", "CC04", "CC05"]
  },
  {
    id: "ana_costa",
    nome: "Ana Costa",
    disciplinas: ["Cortes de Cabelo - Principios", "Cortes de Cabelo - Tecnicas", "Postiço - Aplicação - Postiço - Aplicação e Manutenção"],
    turmas: ["CC03", "CC04", "CC05"]
  },
  {
    id: "catia",
    nome: "Catia",
    disciplinas: ["Tecnicas de Cortes de Cabelo Feminino", "Extensões e Alongamento do Cabelo"],
    turmas: ["CC03", "CC04", "CC05"]
  },
  {
    id: "madalena",
    nome: "Madalena",
    disciplinas: ["Tecnicas de Cortes de Cabelo Masculino", "Cuidados Especificos com a Barba e Bigode", "Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode"],
    turmas: ["CC03", "CC04", "CC05"]
  },
  {
    id: "manuela_monteiro",
    nome: "Manuela Monteiro",
    disciplinas: ["Prova de Aptidão Profissional", "Estágio Formativo"],
    turmas: ["PI01", "PI02", "CC03", "CC04", "CC05"]
  },
  {
    id: "carmen",
    nome: "Carmen",
    disciplinas: ["Física e Química"],
    turmas: ["CC03", "CC04", "CC05", "TE12", "TE13", "TE14"]
  },
  {
    id: "alexandra_cristina",
    nome: "Alexandra Cristina",
    disciplinas: ["Inglês"],
    turmas: ["CC03", "CC04", "CC05", "TE12", "TE13", "TE14"]
  },
  {
    id: "andreza",
    nome: "Andreza",
    disciplinas: ["Termalismo e Hidroginástica"],
    turmas: ["TE12", "TE13", "TE14"]
  }
];

// Lista de nomes para compatibilidade com código antigo
export const PROFESSORES_NOMES = PROFESSORES_EXEMPLO.map(p => p.nome);

// Estrutura completa de disciplinas com todas as informações
export const DISCIPLINAS_COMPLETAS = [
  { id: "cloudops", nome: "CloudOps e Cloud Automation", curso: "Programação Informática" },
  { id: "python", nome: "Fundamentos de Python", curso: "Programação Informática" },
  { id: "ingles", nome: "Inglês", curso: "Geral" },
  { id: "matematica", nome: "Matemática", curso: "Geral" },
  { id: "portugues", nome: "Português", curso: "Geral" },
  { id: "educacao_fisica", nome: "Educação Física", curso: "Geral" },
  { id: "fisica_quimica", nome: "Física e Química", curso: "Geral" },
  { id: "area_integracao", nome: "Área de Integração", curso: "Geral" },
  { id: "tic", nome: "TIC", curso: "Geral" },
  { id: "estagio", nome: "Estágio Formativo", curso: "Geral" },
  { id: "pap", nome: "Prova de Aptidão Profissonal", curso: "Geral" },
  { id: "recuperacao", nome: "Recuperação", curso: "Geral" },
  { id: "cortes_principios", nome: "Cortes de Cabelo - Principios", curso: "Cabeleireiro(a)" },
  { id: "cortes_tecnicas", nome: "Cortes de Cabelo - Tecnicas", curso: "Cabeleireiro(a)" },
  { id: "postico", nome: "Postiço - Aplicação - Postiço - Aplicação e Manutenção", curso: "Cabeleireiro(a)" },
  { id: "cortes_feminino", nome: "Tecnicas de Cortes de Cabelo Feminino", curso: "Cabeleireiro(a)" },
  { id: "extensoes", nome: "Extensões e Alongamento do Cabelo", curso: "Cabeleireiro(a)" },
  { id: "cortes_masculino", nome: "Tecnicas de Cortes de Cabelo Masculino", curso: "Cabeleireiro(a)" },
  { id: "barba_bigode", nome: "Cuidados Especificos com a Barba e Bigode", curso: "Cabeleireiro(a)" },
  { id: "design_barba", nome: "Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode", curso: "Cabeleireiro(a)" }
];

// Lista de nomes para compatibilidade com código antigo
export const DISCIPLINAS = DISCIPLINAS_COMPLETAS.map(d => d.nome);

// Caminhos do Firestore
export const FIRESTORE_PATHS = {
  SCHEDULES: "artifacts/default-app-id/public/data/schedules",
  AVAILABILITIES: "artifacts/default-app-id/public/data/availabilities",
  PROFESSORES: "artifacts/default-app-id/public/data/Professores",
  DISCIPLINAS: "artifacts/default-app-id/public/data/disciplinas",
  TURMAS: "artifacts/default-app-id/public/data/Turmas",
  CURSOS: "artifacts/default-app-id/public/data/cursos",
  DISCIPLINAS_TURMA_ANO: "artifacts/default-app-id/public/data/disciplinas_turma_ano",
  DISCIPLINA_CURSO: "artifacts/default-app-id/public/data/disciplina_curso",
  TURMA_CURSO: "artifacts/default-app-id/public/data/turma_curso",
};