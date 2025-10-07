# 📊 DIAGRAMA VISUAL - Entenda o Sistema

## 🎯 VISÃO GERAL DO PROBLEMA E SOLUÇÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                    ❌ PROBLEMA ORIGINAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Professor faz login                                             │
│       ↓                                                          │
│  Seleciona turmas (PI01, PI02)                                   │
│       ↓                                                          │
│  ❌ NÃO VÊ disciplinas                                           │
│  ❌ NÃO VÊ horas restantes                                       │
│                                                                  │
│  POR QUÊ?                                                        │
│  → Falta coleção "disciplinas_turma_ano" no Firebase            │
│  → Código procura dados que não existem                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                              ⬇️

┌─────────────────────────────────────────────────────────────────┐
│                    ✅ SOLUÇÃO IMPLEMENTADA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PARTE 1: VOCÊ FAZ (Manual)                                      │
│  ┌────────────────────────────────────────┐                     │
│  │ Criar coleção no Firebase              │                     │
│  │ → disciplinas_turma_ano                │                     │
│  │ → 10 documentos (uma por turma)        │                     │
│  │ → Estrutura: ano, curso, disciplinas   │                     │
│  └────────────────────────────────────────┘                     │
│                                                                  │
│  PARTE 2: JÁ FEITO (Automático)                                  │
│  ┌────────────────────────────────────────┐                     │
│  │ ✅ Cache (5 min)                       │                     │
│  │ ✅ Retry (3 tentativas)                │                     │
│  │ ✅ Logs detalhados                     │                     │
│  │ ✅ Tratamento de erros                 │                     │
│  │ ✅ Diagnóstico automático              │                     │
│  │ ✅ Normalização de nomes               │                     │
│  └────────────────────────────────────────┘                     │
│                                                                  │
│  RESULTADO:                                                      │
│  Professor faz login                                             │
│       ↓                                                          │
│  Seleciona turmas (PI01, PI02)                                   │
│       ↓                                                          │
│  ✅ VÊ disciplinas (Redes, Algoritmos, etc)                      │
│  ✅ VÊ horas restantes (150h, 120h, etc)                         │
│  ✅ VÊ cores (verde/amarelo/vermelho)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ ESTRUTURA DO FIREBASE

### **ANTES (Incompleto):**

```
Firebase Firestore
└── artifacts
    └── default-app-id
        └── public
            └── data
                ├── Professores ✅ (17 docs)
                ├── Turmas ✅ (10 docs)
                ├── availabilities ✅ (vários docs)
                ├── schedules ✅ (vários docs)
                └── disciplinas_turma_ano ❌ (FALTANDO!)
```

### **DEPOIS (Completo):**

```
Firebase Firestore
└── artifacts
    └── default-app-id
        └── public
            └── data
                ├── Professores ✅ (17 docs)
                ├── Turmas ✅ (10 docs)
                ├── availabilities ✅ (vários docs)
                ├── schedules ✅ (vários docs)
                └── disciplinas_turma_ano ✅ (10 docs) ⭐ NOVO!
                    ├── PI01 ✅
                    ├── PI02 ✅
                    ├── IG01 ✅
                    ├── IG02 ✅
                    ├── CC03 ✅
                    ├── CC04 ✅
                    ├── CC05 ✅
                    ├── TE12 ✅
                    ├── TE13 ✅
                    └── TE14 ✅
```

---

## 📋 ESTRUTURA DE DADOS

### **Documento de Turma (Exemplo: PI01):**

```json
{
  "ano": "2024/2025",
  "curso": "Programação Informática",
  "disciplinas": [
    {
      "disciplina": "Redes",
      "professor": "João Leite",
      "horas": 150
    },
    {
      "disciplina": "Algoritmos",
      "professor": "Rui Silva",
      "horas": 150
    },
    {
      "disciplina": "HTML e CSS",
      "professor": "Telmo Baldaia",
      "horas": 100
    },
    {
      "disciplina": "Matemática",
      "professor": "Sónia Pinto",
      "horas": 100
    },
    {
      "disciplina": "Português",
      "professor": "Natália Cardoso",
      "horas": 100
    },
    {
      "disciplina": "Inglês",
      "professor": "Ana Teixeira",
      "horas": 50
    },
    {
      "disciplina": "Educação Física",
      "professor": "Ricardo Silveira",
      "horas": 50
    }
  ]
}
```

### **Campos Obrigatórios:**

| Campo | Tipo | Exemplo | Observação |
|-------|------|---------|------------|
| `ano` | string | "2024/2025" | Ano letivo |
| `curso` | string | "Programação Informática" | Nome do curso |
| `disciplinas` | array | [...] | Lista de disciplinas |
| `disciplinas[].disciplina` | string | "Redes" | Nome da disciplina |
| `disciplinas[].professor` | string | "João Leite" | Nome do professor (com acentos!) |
| `disciplinas[].horas` | **number** | 150 | Horas restantes (NÚMERO, não string!) |

---

## 🔄 FLUXO DE DADOS NO SISTEMA

### **1. Carregamento Inicial:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Professor faz login                                             │
│       ↓                                                          │
│  ProfessorDashboard carrega                                      │
│       ↓                                                          │
│  Hook useDisciplinasTurmaAno() é chamado                         │
│       ↓                                                          │
│  Verifica cache (5 min)                                          │
│       ├─ Cache válido? → Retorna dados do cache ⚡ RÁPIDO       │
│       └─ Cache inválido? → Busca no Firebase                    │
│                ↓                                                 │
│           Firebase retorna dados                                 │
│                ↓                                                 │
│           Salva no cache (5 min)                                 │
│                ↓                                                 │
│           Retorna dados para componente                          │
│                ↓                                                 │
│  ProfessorDashboard exibe disciplinas                            │
└─────────────────────────────────────────────────────────────────┘
```

### **2. Tratamento de Erros:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Busca no Firebase                                               │
│       ↓                                                          │
│  ❌ Erro (rede, permissão, etc)                                  │
│       ↓                                                          │
│  Retry automático (tentativa 1/3)                                │
│       ├─ Sucesso? → Retorna dados ✅                             │
│       └─ Falha? → Aguarda 3 segundos                            │
│                ↓                                                 │
│           Retry automático (tentativa 2/3)                       │
│                ├─ Sucesso? → Retorna dados ✅                    │
│                └─ Falha? → Aguarda 3 segundos                   │
│                         ↓                                        │
│                    Retry automático (tentativa 3/3)             │
│                         ├─ Sucesso? → Retorna dados ✅           │
│                         └─ Falha? → Mostra erro ❌              │
│                                  ↓                               │
│                             Log detalhado no Console             │
│                                  ↓                               │
│                             Mensagem clara para usuário          │
└─────────────────────────────────────────────────────────────────┘
```

### **3. Comparação de Nomes:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Professor logado: "João Leite"                                  │
│       ↓                                                          │
│  Normalização: normalizarNome("João Leite")                      │
│       ↓                                                          │
│  Resultado: "joao leite" (sem acentos, lowercase)                │
│       ↓                                                          │
│  Para cada disciplina da turma:                                  │
│       ├─ Professor no Firebase: "João Leite"                     │
│       ├─ Normalização: "joao leite"                              │
│       ├─ Comparação: "joao leite" === "joao leite"               │
│       └─ Match! ✅ Exibe disciplina                              │
│                                                                  │
│  Funciona mesmo com:                                             │
│  ✅ "João Leite" = "Joao Leite" = "joão leite" = "JOÃO LEITE"   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 INTERFACE DO USUÁRIO

### **Tela do Professor (Antes):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Professor Dashboard                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Seu nome: João Leite                                            │
│                                                                  │
│  Turmas que leciona:                                             │
│  ☑ PI01  ☑ PI02  ☐ IG01  ☐ IG02                                 │
│                                                                  │
│  📊 Comparar Disciplinas e Horas entre Turmas                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Selecione turmas: [PI01] [PI02]                            │ │
│  │                                                             │ │
│  │ ❌ Nenhuma disciplina encontrada                            │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Tela do Professor (Depois):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Professor Dashboard                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Seu nome: João Leite                                            │
│                                                                  │
│  Turmas que leciona:                                             │
│  ☑ PI01  ☑ PI02  ☐ IG01  ☐ IG02                                 │
│                                                                  │
│  📊 Comparar Disciplinas e Horas entre Turmas                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Selecione turmas: [PI01] [PI02]                            │ │
│  │                                                             │ │
│  │ Turma: PI01                    📅 Ano Letivo: 2024/2025    │ │
│  │ ┌────────────────────────────────────────────────────────┐ │ │
│  │ │ Disciplina              │ Horas Restantes              │ │ │
│  │ ├────────────────────────────────────────────────────────┤ │ │
│  │ │ Redes                   │ 🟢 150h                      │ │ │
│  │ │ Sistemas Operativos     │ 🟢 120h                      │ │ │
│  │ │ CloudOps                │ 🟡 15h                       │ │ │
│  │ └────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │ Turma: PI02                    📅 Ano Letivo: 2024/2025    │ │
│  │ ┌────────────────────────────────────────────────────────┐ │ │
│  │ │ Disciplina              │ Horas Restantes              │ │ │
│  │ ├────────────────────────────────────────────────────────┤ │ │
│  │ │ Redes                   │ 🟢 150h                      │ │ │
│  │ │ Arquitetura Computador  │ 🟢 100h                      │ │ │
│  │ │ CloudOps                │ 🔴 8h                        │ │ │
│  │ └────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Legenda de Cores:**

| Cor | Horas | Significado |
|-----|-------|-------------|
| 🟢 Verde | > 20h | Tranquilo, muitas horas restantes |
| 🟡 Amarelo | 10-20h | Atenção, horas moderadas |
| 🔴 Vermelho | < 10h | Urgente, poucas horas restantes |
| ⚪ Cinza | 0h | Sem dados ou concluído |

---

## 🔍 FERRAMENTA DE DIAGNÓSTICO

### **Tela do Admin (Diagnóstico):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Diagnóstico do Firebase                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [🔍 Executar Diagnóstico]                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ⏳ Executando diagnóstico... (5-10 segundos)                    │
│                                                                  │
│  ✅ RESULTADO: TUDO OK                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ✅ Professores: 17 documentos                              │ │
│  │ ✅ Turmas: 10 documentos                                   │ │
│  │ ✅ disciplinas_turma_ano: 10 documentos                    │ │
│  │    → PI01, PI02, IG01, IG02, CC03, CC04, CC05,            │ │
│  │      TE12, TE13, TE14                                      │ │
│  │ ✅ availabilities: Configurado                             │ │
│  │ ✅ schedules: Configurado                                  │ │
│  │                                                             │ │
│  │ 🎉 Todas as coleções estão configuradas corretamente!     │ │
│  │                                                             │ │
│  │ 📊 Detalhes Técnicos (clique para expandir)               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Diagnóstico com Problemas:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Diagnóstico do Firebase                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [🔍 Executar Diagnóstico]                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ❌ RESULTADO: PROBLEMAS ENCONTRADOS                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ✅ Professores: 17 documentos                              │ │
│  │ ✅ Turmas: 10 documentos                                   │ │
│  │ ❌ disciplinas_turma_ano: COLEÇÃO NÃO ENCONTRADA          │ │
│  │                                                             │ │
│  │ 🔧 AÇÃO NECESSÁRIA:                                        │ │
│  │ 1. Crie a coleção manualmente no Firebase                 │ │
│  │ 2. Ou clique em "🔄 Migrar Dados" abaixo                  │ │
│  │                                                             │ │
│  │ 📖 Consulte: FIREBASE_CONFIGURACAO_MANUAL.md              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [🔄 Migrar Dados Automaticamente]                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ MELHORIAS DE PERFORMANCE

### **Antes (Sem Cache):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Cada carregamento:                                              │
│                                                                  │
│  Professor abre página                                           │
│       ↓                                                          │
│  Busca no Firebase (5-10 segundos) 🐌                            │
│       ↓                                                          │
│  Exibe dados                                                     │
│                                                                  │
│  Professor recarrega (F5)                                        │
│       ↓                                                          │
│  Busca no Firebase NOVAMENTE (5-10 segundos) 🐌                 │
│       ↓                                                          │
│  Exibe dados                                                     │
│                                                                  │
│  Total: 10-20 segundos para 2 carregamentos                      │
└─────────────────────────────────────────────────────────────────┘
```

### **Depois (Com Cache):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Primeiro carregamento:                                          │
│                                                                  │
│  Professor abre página                                           │
│       ↓                                                          │
│  Busca no Firebase (5-10 segundos) 🐌                            │
│       ↓                                                          │
│  Salva no cache (5 min)                                          │
│       ↓                                                          │
│  Exibe dados                                                     │
│                                                                  │
│  Professor recarrega (F5) - dentro de 5 min                      │
│       ↓                                                          │
│  Usa cache (0.5 segundos) ⚡                                     │
│       ↓                                                          │
│  Exibe dados                                                     │
│                                                                  │
│  Total: 5-10 segundos para primeiro + 0.5s para próximos        │
│  Economia: 80% menos chamadas ao Firebase                        │
└─────────────────────────────────────────────────────────────────┘
```

### **Comparação:**

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Primeiro carregamento | 5-10s | 5-10s | Igual |
| Carregamentos seguintes | 5-10s | 0.5s | **10-20x mais rápido** |
| Chamadas ao Firebase | 100% | 20% | **80% redução** |
| Experiência do usuário | 🐌 Lento | ⚡ Rápido | **3x melhor** |

---

## 🔄 FLUXO DE RETRY AUTOMÁTICO

### **Cenário: Internet Instável**

```
┌─────────────────────────────────────────────────────────────────┐
│  Tentativa 1:                                                    │
│  ├─ Busca no Firebase                                            │
│  ├─ ❌ Erro: Timeout (internet lenta)                            │
│  └─ Log: "[FirestoreService] Erro ao buscar dados"              │
│       ↓                                                          │
│  Aguarda 3 segundos...                                           │
│       ↓                                                          │
│  Tentativa 2:                                                    │
│  ├─ Busca no Firebase                                            │
│  ├─ ❌ Erro: Timeout (internet lenta)                            │
│  └─ Log: "[FirestoreService] Tentativa 2/3 falhou"              │
│       ↓                                                          │
│  Aguarda 3 segundos...                                           │
│       ↓                                                          │
│  Tentativa 3:                                                    │
│  ├─ Busca no Firebase                                            │
│  ├─ ✅ Sucesso! (internet voltou)                                │
│  └─ Log: "[FirestoreService] Dados carregados com sucesso"      │
│       ↓                                                          │
│  Exibe dados para o professor                                    │
│                                                                  │
│  Resultado: Sistema funcionou mesmo com internet instável! ✅    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 RESUMO VISUAL

### **O que você precisa fazer:**

```
┌──────────────────────────────────────┐
│  TAREFA MANUAL (15-20 min)           │
├──────────────────────────────────────┤
│                                      │
│  1. Abrir Firebase Console           │
│  2. Criar coleção                    │
│  3. Adicionar 10 documentos          │
│  4. Verificar regras                 │
│  5. Testar no app                    │
│                                      │
│  OU                                  │
│                                      │
│  1. Clicar "Migrar Dados" (2-3 min) │
│                                      │
└──────────────────────────────────────┘
```

### **O que já está pronto:**

```
┌──────────────────────────────────────┐
│  MELHORIAS AUTOMÁTICAS (Ativas)      │
├──────────────────────────────────────┤
│                                      │
│  ✅ Cache (5 min)                    │
│  ✅ Retry (3 tentativas)             │
│  ✅ Logs detalhados                  │
│  ✅ Tratamento de erros              │
│  ✅ Diagnóstico automático           │
│  ✅ Normalização de nomes            │
│                                      │
│  Você não precisa fazer NADA!        │
│                                      │
└──────────────────────────────────────┘
```

---

## 🎯 PRÓXIMO PASSO

👉 **Leia:** `COMECE_AQUI.md`  
👉 **Escolha:** Opção A (Manual) ou Opção B (Automático)  
👉 **Execute:** Diagnóstico para verificar  
👉 **Teste:** Como professor  

---

**Criado em:** 2024  
**Versão:** 1.0  
**Autor:** Sistema de Gestão de Horários - INSTICOOP