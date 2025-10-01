/**
 * Script para migrar dados hardcoded para o Firebase
 * Execute este script UMA VEZ para popular o banco de dados
 */

import { db } from "../firebaseConfig";
import { doc, setDoc, writeBatch, collection } from "firebase/firestore";
import { FIRESTORE_PATHS } from "../constants";

// Dados a serem migrados
const PROFESSORES_DATA = [
  { id: "joao_leite", nome: "João Leite", disciplinas: ["Algoritmos", "Visual Basic", "CloudOps e Cloud Automation"] },
  { id: "rui_silva", nome: "Rui Silva", disciplinas: ["Fundamentos C/C++", "C / C++ Avançado", "C# Avançado", "Estrutura de Dados", "TIC", "Estágio Formativo"] },
  { id: "telmo_baldaia", nome: "Telmo Baldaia", disciplinas: ["Desenvolvimento de Aplicações Web", "Fundamentos de Python"] },
  { id: "sonia_pinto", nome: "Sónia Pinto", disciplinas: ["Matemática"] },
  { id: "natalia_cardoso", nome: "Natália Cardoso", disciplinas: ["Português"] },
  { id: "rafaela_leite", nome: "Rafaela Leite", disciplinas: ["Português"] },
  { id: "ana_teixeira", nome: "Ana Teixeira", disciplinas: ["Inglês"] },
  { id: "ricardo_silveira", nome: "Ricardo Silveira", disciplinas: ["Educação Física"] },
  { id: "vera_rafaela", nome: "Vera Rafaela", disciplinas: ["Física e Química"] },
  { id: "guilherme", nome: "Guilherme", disciplinas: ["Área de Integração", "Estágio Formativo", "Prova de Aptidão Profissional"] },
  { id: "ana_costa", nome: "Ana Costa", disciplinas: ["Cortes de Cabelo - Principios", "Cortes de Cabelo - Tecnicas", "Postiço - Aplicação - Postiço - Aplicação e Manutenção"] },
  { id: "catia", nome: "Catia", disciplinas: ["Tecnicas de Cortes de Cabelo Feminino", "Extensões e Alongamento do Cabelo"] },
  { id: "madalena", nome: "Madalena", disciplinas: ["Tecnicas de Cortes de Cabelo Masculino", "Cuidados Especificos com a Barba e Bigode", "Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode"] },
  { id: "manuela_monteiro", nome: "Manuela Monteiro", disciplinas: ["Prova de Aptidão Profissional", "Estágio Formativo"] },
  { id: "carmen", nome: "Carmen", disciplinas: ["Física e Química"] },
  { id: "alexandra_cristina", nome: "Alexandra Cristina", disciplinas: ["Inglês"] },
  { id: "andreza", nome: "Andreza", disciplinas: ["Termalismo e Hidroginástica"] },
];

const TURMAS_DATA = [
  { id: "PI01", nome: "PI01", curso: "Programação", ano: "10º Ano" },
  { id: "PI02", nome: "PI02", curso: "Programação", ano: "10º Ano" },
  { id: "IG01", nome: "IG01", curso: "Informática de Gestão", ano: "11º Ano" },
  { id: "IG02", nome: "IG02", curso: "Informática de Gestão", ano: "11º Ano" },
  { id: "CC03", nome: "CC03", curso: "Cabeleireira", ano: "12º Ano" },
  { id: "CC04", nome: "CC04", curso: "Cabeleireira", ano: "12º Ano" },
  { id: "CC05", nome: "CC05", curso: "Cabeleireira", ano: "12º Ano" },
  { id: "TE12", nome: "TE12", curso: "Termalismo", ano: "12º Ano" },
  { id: "TE13", nome: "TE13", curso: "Termalismo", ano: "12º Ano" },
  { id: "TE14", nome: "TE14", curso: "Termalismo", ano: "12º Ano" },
];

const DISCIPLINAS_TURMA_ANO_DATA = {
  PI01: {
    ano: "10º Ano",
    curso: "Programação",
    disciplinas: [
      { disciplina: "Algoritmos", professor: "João Leite", horas: 150 },
      { disciplina: "Fundamentos C/C++", professor: "Rui Silva", horas: 100 },
      { disciplina: "Visual Basic", professor: "João Leite", horas: 30 },
      { disciplina: "TIC", professor: "Rui Silva", horas: 25 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 100 },
      { disciplina: "Português", professor: "Natália Cardoso", horas: 80 },
      { disciplina: "Inglês", professor: "Ana Teixeira", horas: 60 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 50 },
    ],
  },
  PI02: {
    ano: "10º Ano",
    curso: "Programação",
    disciplinas: [
      { disciplina: "Algoritmos", professor: "João Leite", horas: 150 },
      { disciplina: "Fundamentos C/C++", professor: "Rui Silva", horas: 100 },
      { disciplina: "Visual Basic", professor: "João Leite", horas: 30 },
      { disciplina: "TIC", professor: "Rui Silva", horas: 25 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 100 },
      { disciplina: "Português", professor: "Natália Cardoso", horas: 80 },
      { disciplina: "Inglês", professor: "Ana Teixeira", horas: 60 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 50 },
    ],
  },
  IG01: {
    ano: "11º Ano",
    curso: "Informática de Gestão",
    disciplinas: [
      { disciplina: "C / C++ Avançado", professor: "Rui Silva", horas: 170 },
      { disciplina: "C# Avançado", professor: "Rui Silva", horas: 110 },
      { disciplina: "Estrutura de Dados", professor: "Rui Silva", horas: 50 },
      { disciplina: "Desenvolvimento de Aplicações Web", professor: "Telmo Baldaia", horas: 180 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 90 },
      { disciplina: "Português", professor: "Natália Cardoso", horas: 70 },
      { disciplina: "Inglês", professor: "Ana Teixeira", horas: 60 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 50 },
      { disciplina: "Estágio Formativo", professor: "Rui Silva", horas: 240 },
    ],
  },
  IG02: {
    ano: "11º Ano",
    curso: "Informática de Gestão",
    disciplinas: [
      { disciplina: "C / C++ Avançado", professor: "Rui Silva", horas: 170 },
      { disciplina: "C# Avançado", professor: "Rui Silva", horas: 110 },
      { disciplina: "Estrutura de Dados", professor: "Rui Silva", horas: 50 },
      { disciplina: "Desenvolvimento de Aplicações Web", professor: "Telmo Baldaia", horas: 180 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 90 },
      { disciplina: "Português", professor: "Natália Cardoso", horas: 70 },
      { disciplina: "Inglês", professor: "Ana Teixeira", horas: 60 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 50 },
      { disciplina: "Estágio Formativo", professor: "Rui Silva", horas: 240 },
    ],
  },
  CC03: {
    ano: "12º Ano",
    curso: "Cabeleireira",
    disciplinas: [
      { disciplina: "Cortes de Cabelo - Principios", professor: "Ana Costa", horas: 120 },
      { disciplina: "Cortes de Cabelo - Tecnicas", professor: "Ana Costa", horas: 150 },
      { disciplina: "Postiço - Aplicação e Manutenção", professor: "Ana Costa", horas: 80 },
      { disciplina: "Tecnicas de Cortes de Cabelo Feminino", professor: "Catia", horas: 140 },
      { disciplina: "Extensões e Alongamento do Cabelo", professor: "Catia", horas: 100 },
      { disciplina: "Tecnicas de Cortes de Cabelo Masculino", professor: "Madalena", horas: 130 },
      { disciplina: "Cuidados Especificos com a Barba e Bigode", professor: "Madalena", horas: 90 },
      { disciplina: "Tecnicas de Design e Corte de Barba e Bigode", professor: "Madalena", horas: 110 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Manuela Monteiro", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Manuela Monteiro", horas: 50 },
    ],
  },
  CC04: {
    ano: "12º Ano",
    curso: "Cabeleireira",
    disciplinas: [
      { disciplina: "Cortes de Cabelo - Principios", professor: "Ana Costa", horas: 120 },
      { disciplina: "Cortes de Cabelo - Tecnicas", professor: "Ana Costa", horas: 150 },
      { disciplina: "Postiço - Aplicação e Manutenção", professor: "Ana Costa", horas: 80 },
      { disciplina: "Tecnicas de Cortes de Cabelo Feminino", professor: "Catia", horas: 140 },
      { disciplina: "Extensões e Alongamento do Cabelo", professor: "Catia", horas: 100 },
      { disciplina: "Tecnicas de Cortes de Cabelo Masculino", professor: "Madalena", horas: 130 },
      { disciplina: "Cuidados Especificos com a Barba e Bigode", professor: "Madalena", horas: 90 },
      { disciplina: "Tecnicas de Design e Corte de Barba e Bigode", professor: "Madalena", horas: 110 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Manuela Monteiro", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Manuela Monteiro", horas: 50 },
    ],
  },
  CC05: {
    ano: "12º Ano",
    curso: "Cabeleireira",
    disciplinas: [
      { disciplina: "Cortes de Cabelo - Principios", professor: "Ana Costa", horas: 120 },
      { disciplina: "Cortes de Cabelo - Tecnicas", professor: "Ana Costa", horas: 150 },
      { disciplina: "Postiço - Aplicação e Manutenção", professor: "Ana Costa", horas: 80 },
      { disciplina: "Tecnicas de Cortes de Cabelo Feminino", professor: "Catia", horas: 140 },
      { disciplina: "Extensões e Alongamento do Cabelo", professor: "Catia", horas: 100 },
      { disciplina: "Tecnicas de Cortes de Cabelo Masculino", professor: "Madalena", horas: 130 },
      { disciplina: "Cuidados Especificos com a Barba e Bigode", professor: "Madalena", horas: 90 },
      { disciplina: "Tecnicas de Design e Corte de Barba e Bigode", professor: "Madalena", horas: 110 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Manuela Monteiro", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Manuela Monteiro", horas: 50 },
    ],
  },
  TE12: {
    ano: "12º Ano",
    curso: "Termalismo",
    disciplinas: [
      { disciplina: "Termalismo e Hidroginástica", professor: "Andreza", horas: 200 },
      { disciplina: "Área de Integração", professor: "Guilherme", horas: 80 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 70 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Física e Química", professor: "Vera Rafaela", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Guilherme", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Guilherme", horas: 50 },
    ],
  },
  TE13: {
    ano: "12º Ano",
    curso: "Termalismo",
    disciplinas: [
      { disciplina: "Termalismo e Hidroginástica", professor: "Andreza", horas: 200 },
      { disciplina: "Área de Integração", professor: "Guilherme", horas: 80 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 70 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Física e Química", professor: "Vera Rafaela", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Guilherme", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Guilherme", horas: 50 },
    ],
  },
  TE14: {
    ano: "12º Ano",
    curso: "Termalismo",
    disciplinas: [
      { disciplina: "Termalismo e Hidroginástica", professor: "Andreza", horas: 200 },
      { disciplina: "Área de Integração", professor: "Guilherme", horas: 80 },
      { disciplina: "Português", professor: "Rafaela Leite", horas: 60 },
      { disciplina: "Inglês", professor: "Alexandra Cristina", horas: 50 },
      { disciplina: "Matemática", professor: "Sónia Pinto", horas: 70 },
      { disciplina: "Educação Física", professor: "Ricardo Silveira", horas: 40 },
      { disciplina: "Física e Química", professor: "Carmen", horas: 70 },
      { disciplina: "Física e Química", professor: "Vera Rafaela", horas: 70 },
      { disciplina: "Estágio Formativo", professor: "Guilherme", horas: 300 },
      { disciplina: "Prova de Aptidão Profissional", professor: "Guilherme", horas: 50 },
    ],
  },
};

/**
 * Migra professores para o Firestore
 */
export const migrateProfessores = async () => {
  console.log("🔄 Migrando professores...");
  const batch = writeBatch(db);
  
  PROFESSORES_DATA.forEach((professor) => {
    const docRef = doc(db, FIRESTORE_PATHS.PROFESSORES, professor.id);
    batch.set(docRef, professor);
  });
  
  await batch.commit();
  console.log("✅ Professores migrados com sucesso!");
};

/**
 * Migra turmas para o Firestore
 */
export const migrateTurmas = async () => {
  console.log("🔄 Migrando turmas...");
  const batch = writeBatch(db);
  
  TURMAS_DATA.forEach((turma) => {
    const docRef = doc(db, FIRESTORE_PATHS.TURMAS, turma.id);
    batch.set(docRef, turma);
  });
  
  await batch.commit();
  console.log("✅ Turmas migradas com sucesso!");
};

/**
 * Migra disciplinas por turma/ano para o Firestore
 */
export const migrateDisciplinasTurmaAno = async () => {
  console.log("🔄 Migrando disciplinas por turma/ano...");
  
  for (const [turmaId, data] of Object.entries(DISCIPLINAS_TURMA_ANO_DATA)) {
    const docRef = doc(db, FIRESTORE_PATHS.DISCIPLINAS_TURMA_ANO, turmaId);
    await setDoc(docRef, data);
  }
  
  console.log("✅ Disciplinas por turma/ano migradas com sucesso!");
};

/**
 * Executa todas as migrações
 */
export const migrateAllData = async () => {
  try {
    console.log("🚀 Iniciando migração de dados para o Firebase...");
    
    await migrateProfessores();
    await migrateTurmas();
    await migrateDisciplinasTurmaAno();
    
    console.log("🎉 Migração completa! Todos os dados foram transferidos para o Firebase.");
    alert("✅ Migração concluída com sucesso! Verifique o console para detalhes.");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    alert("❌ Erro durante a migração. Verifique o console para detalhes.");
  }
};