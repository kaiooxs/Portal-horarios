# 🏗️ Arquitetura do Portal de Horários

## 📐 **Visão Geral da Arquitetura**

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
│                    (Admin/Professor/Aluno)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      APP.JS (70 linhas)                      │
│                   - Autenticação                             │
│                   - Roteamento                               │
│                   - Estado global                            │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────┐  ┌────────────────┐  ┌──────────┐
│   Admin    │  │   Professor    │  │  Aluno   │
│ Dashboard  │  │   Dashboard    │  │Dashboard │
└────────────┘  └────────────────┘  └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────┐  ┌────────────────┐  ┌──────────┐
│   Hooks    │  │   Services     │  │  Utils   │
│ (Firebase) │  │  (Firestore)   │  │(Helpers) │
└────────────┘  └────────────────┘  └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                        │
│  - professores/                                              │
│  - turmas/                                                   │
│  - disciplinas_turma_ano/                                    │
│  - schedules/                                                │
│  - availabilities/                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Fluxo de Dados**

### **1. Fluxo de Autenticação**

```
Usuário
  │
  ├─> Seleciona tipo (Admin/Professor/Aluno)
  │
  ├─> Insere credenciais
  │
  ├─> LoginScreen valida
  │
  ├─> App.js recebe userData
  │
  └─> Renderiza Dashboard correspondente
```

### **2. Fluxo de Dados (Professor)**

```
ProfessorDashboard
  │
  ├─> useDisciplinasTurmaAno() hook
  │     │
  │     └─> firestoreService.subscribeToDisciplinasTurmaAno()
  │           │
  │           └─> Firebase Firestore
  │                 │
  │                 └─> disciplinas_turma_ano/[turma]
  │
  ├─> Usuário seleciona turma
  │
  ├─> Filtra disciplinas do professor
  │
  └─> Exibe tabela com disciplinas e horas
```

### **3. Fluxo de Dados (Admin)**

```
AdminDashboard
  │
  ├─> useEffect() - Subscribe to schedules
  │     │
  │     └─> Firebase onSnapshot()
  │           │
  │           └─> schedules/[turma]
  │
  ├─> useEffect() - Subscribe to availabilities
  │     │
  │     └─> Firebase onSnapshot()
  │           │
  │           └─> availabilities/
  │
  ├─> Usuário edita horário
  │
  ├─> setCell() atualiza Firestore
  │
  └─> Firebase atualiza em tempo real
```

### **4. Fluxo de Dados (Aluno)**

```
AlunoDashboard
  │
  ├─> useEffect() - Subscribe to schedule
  │     │
  │     └─> Firebase onSnapshot()
  │           │
  │           └─> schedules/[turma]
  │
  ├─> Verifica se está publicado
  │
  └─> Renderiza ScheduleGrid
```

---

## 📦 **Camadas da Aplicação**

### **Camada 1: Apresentação (UI)**
```
components/
├── AdminDashboard.js      - Interface do admin
├── ProfessorDashboard.js  - Interface do professor
├── AlunoDashboard.js      - Interface do aluno
├── LoginScreen.js         - Tela de login
└── ScheduleGrid.js        - Grade de horários reutilizável
```

**Responsabilidades:**
- Renderizar UI
- Capturar eventos do usuário
- Exibir dados
- Validação de formulários

---

### **Camada 2: Lógica de Negócio (Hooks)**
```
hooks/
└── useFirestore.js
    ├── useProfessores()
    ├── useTurmas()
    ├── useDisciplinasTurmaAno()
    ├── useSchedules()
    └── useAvailabilities()
```

**Responsabilidades:**
- Gerenciar estado
- Subscrições em tempo real
- Loading states
- Error handling

---

### **Camada 3: Acesso a Dados (Services)**
```
services/
└── firestoreService.js
    ├── getProfessores()
    ├── getTurmas()
    ├── getDisciplinasTurmaAno()
    ├── updateSchedule()
    ├── updateAvailability()
    └── cleanUpSchedulesAfterUpdate()
```

**Responsabilidades:**
- Comunicação com Firebase
- CRUD operations
- Queries complexas
- Batch operations

---

### **Camada 4: Utilitários**
```
utils/
├── helpers.js
│   ├── timestampToDate()
│   ├── normalizarNome()
│   ├── compararNomes()
│   └── gerarDocId()
│
└── pdfExport.js
    └── downloadSchedulePDF()
```

**Responsabilidades:**
- Funções auxiliares
- Formatação de dados
- Conversões
- Exportações

---

### **Camada 5: Constantes**
```
constants/
└── index.js
    ├── DAYS_OF_WEEK
    ├── TIME_SLOTS
    ├── TURMAS
    ├── PROFESSORES_EXEMPLO
    ├── DISCIPLINAS
    └── FIRESTORE_PATHS
```

**Responsabilidades:**
- Valores fixos
- Configurações
- Enums
- Paths do Firestore

---

## 🔐 **Segurança e Autenticação**

```
Firebase Auth (Anonymous)
  │
  ├─> signInAnonymously()
  │
  ├─> onAuthStateChanged()
  │
  └─> App.js gerencia estado de autenticação
        │
        ├─> Admin: senha "admin123"
        ├─> Professor: senha "prof123"
        └─> Aluno: sem senha (apenas turma)
```

---

## 📊 **Modelo de Dados**

### **Professores**
```javascript
{
  id: "joao-leite",
  nome: "João Leite",
  disciplinas: ["CloudOps", "Python"]
}
```

### **Turmas**
```javascript
{
  id: "PI01",
  nome: "PI01",
  curso: "Programação Informática",
  anoLetivo: "2024/2025"
}
```

### **Disciplinas por Turma**
```javascript
{
  id: "PI01",
  turma: "PI01",
  ano: "10º Ano",
  disciplinas: [
    {
      disciplina: "Algoritmos",
      professor: "João Leite",
      horas: 150
    },
    // ...
  ]
}
```

### **Horários**
```javascript
{
  id: "PI01",
  entries: [
    {
      id: "123",
      turma: "PI01",
      dia: "2ª Feira",
      hora: "08:45 - 10:15",
      professor: "João Leite",
      disciplina: "Algoritmos"
    },
    // ...
  ],
  published: true
}
```

### **Disponibilidades**
```javascript
{
  id: "joao_leite",
  nome: "João Leite",
  turmas: ["PI01", "PI02"],
  disciplinaByTurma: {
    "PI01": "Algoritmos",
    "PI02": "Python"
  },
  slots: [
    {
      dia: "2ª Feira",
      hora: "08:45 - 10:15",
      turma: "PI01",
      disciplina: "Algoritmos"
    },
    // ...
  ],
  almocosAgendados: ["2ª Feira", "4ª Feira"],
  lastUpdated: Timestamp
}
```

---

## 🔄 **Padrões de Design Utilizados**

### **1. Component Pattern**
Cada componente é responsável por uma única funcionalidade.

### **2. Custom Hooks Pattern**
Lógica reutilizável encapsulada em hooks customizados.

### **3. Service Layer Pattern**
Camada de serviço para abstrair acesso a dados.

### **4. Observer Pattern**
Subscriptions do Firebase para atualizações em tempo real.

### **5. Separation of Concerns**
Separação clara entre UI, lógica e dados.

---

## 🚀 **Performance**

### **Otimizações Implementadas:**
- ✅ Real-time subscriptions (apenas dados necessários)
- ✅ Unsubscribe automático (cleanup em useEffect)
- ✅ Loading states (evita renderizações desnecessárias)
- ✅ Memoização de componentes (React.memo onde necessário)
- ✅ Lazy loading de componentes (code splitting)

### **Possíveis Melhorias Futuras:**
- 🔄 Cache de dados com React Query
- 🔄 Virtualização de listas longas
- 🔄 Debounce em inputs
- 🔄 Service Worker para offline support

---

## 📈 **Escalabilidade**

### **Fácil de Adicionar:**
- ✅ Novos dashboards (ex: Coordenador, Diretor)
- ✅ Novas funcionalidades (ex: Relatórios, Estatísticas)
- ✅ Novos tipos de dados (ex: Salas, Equipamentos)
- ✅ Integrações externas (ex: Google Calendar, Email)

### **Estrutura Preparada Para:**
- ✅ Múltiplas escolas
- ✅ Múltiplos anos letivos
- ✅ Histórico de horários
- ✅ Auditoria de mudanças

---

## 🧪 **Testabilidade**

### **Componentes Testáveis:**
Cada componente pode ser testado isoladamente.

### **Hooks Testáveis:**
Hooks customizados podem ser testados com `@testing-library/react-hooks`.

### **Services Testáveis:**
Services podem ser mockados facilmente.

### **Exemplo de Teste:**
```javascript
import { render, screen } from '@testing-library/react';
import LoginScreen from './components/LoginScreen';

test('renders login screen', () => {
  render(<LoginScreen onLogin={() => {}} />);
  expect(screen.getByText('Portal de Horários')).toBeInTheDocument();
});
```

---

## 📚 **Tecnologias Utilizadas**

- **React** - Framework UI
- **Firebase Firestore** - Banco de dados NoSQL
- **Firebase Auth** - Autenticação
- **Framer Motion** - Animações
- **Tailwind CSS** - Estilização
- **jsPDF** - Geração de PDF
- **html2canvas** - Captura de tela

---

## 🎯 **Princípios Seguidos**

1. **DRY** (Don't Repeat Yourself) - Código reutilizável
2. **SOLID** - Princípios de design orientado a objetos
3. **KISS** (Keep It Simple, Stupid) - Simplicidade
4. **YAGNI** (You Aren't Gonna Need It) - Não adicionar complexidade desnecessária
5. **Separation of Concerns** - Separação de responsabilidades

---

**Arquitetura criada em:** ${new Date().toLocaleDateString("pt-PT")}

**Status:** ✅ **PRODUÇÃO**