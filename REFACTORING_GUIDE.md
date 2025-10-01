# 📚 Guia de Refatoração - Portal de Horários

## 🎯 Objetivo

Refatorar o código para:
1. **Mover dados hardcoded para o Firebase Firestore**
2. **Dividir o código em componentes e módulos separados**
3. **Facilitar manutenção e atualizações futuras**

---

## 📁 Nova Estrutura de Pastas

```
src/
├── components/              # Componentes React reutilizáveis
│   ├── ScheduleGrid.js     # Grade de horários
│   ├── AdminDashboard.js   # Painel do administrador
│   ├── ProfessorDashboard.js # Painel do professor
│   ├── LoginScreen.js      # Tela de login
│   └── MigrationButton.js  # Botão temporário de migração
│
├── hooks/                   # Custom React Hooks
│   └── useFirestore.js     # Hooks para acessar Firestore
│
├── services/                # Serviços e lógica de negócio
│   └── firestoreService.js # Funções para interagir com Firestore
│
├── utils/                   # Funções utilitárias
│   ├── helpers.js          # Funções auxiliares gerais
│   └── pdfExport.js        # Exportação para PDF
│
├── constants/               # Constantes da aplicação
│   └── index.js            # Todas as constantes centralizadas
│
├── scripts/                 # Scripts de migração e manutenção
│   └── migrateDataToFirebase.js # Script de migração de dados
│
├── App.js                   # Componente principal (refatorado)
├── firebaseConfig.js        # Configuração do Firebase
└── index.js                 # Ponto de entrada da aplicação
```

---

## 🗄️ Estrutura de Dados no Firestore

### Coleções Criadas:

#### 1. **`professores`**
Armazena informações sobre os professores.

```javascript
{
  id: "rui_silva",
  nome: "Rui Silva",
  disciplinas: ["Fundamentos C/C++", "C / C++ Avançado", ...]
}
```

#### 2. **`turmas`**
Armazena informações sobre as turmas.

```javascript
{
  id: "PI01",
  nome: "PI01",
  curso: "Programação",
  ano: "10º Ano"
}
```

#### 3. **`disciplinas_turma_ano`**
Armazena as disciplinas de cada turma com professores e horas.

```javascript
{
  PI01: {
    ano: "10º Ano",
    curso: "Programação",
    disciplinas: [
      { disciplina: "Algoritmos", professor: "João Leite", horas: 150 },
      { disciplina: "Fundamentos C/C++", professor: "Rui Silva", horas: 100 },
      ...
    ]
  }
}
```

#### 4. **`schedules`** (já existente)
Armazena os horários de cada turma.

#### 5. **`availabilities`** (já existente)
Armazena as disponibilidades dos professores.

---

## 🔧 Como Usar os Novos Módulos

### 1. **Importar Constantes**

```javascript
import { DAYS_OF_WEEK, TIME_SLOTS, TURMAS, FIRESTORE_PATHS } from "./constants";
```

### 2. **Usar Funções Utilitárias**

```javascript
import { normalizarNome, compararNomes, timestampToDate } from "./utils/helpers";

const nome1Normalizado = normalizarNome("João Leite"); // "joao leite"
const saoIguais = compararNomes("João", "Joao"); // true
```

### 3. **Usar Hooks do Firestore**

```javascript
import { useProfessores, useTurmas, useDisciplinasTurmaAno } from "./hooks/useFirestore";

function MeuComponente() {
  const { professores, loading } = useProfessores();
  const { turmas } = useTurmas();
  const { disciplinasTurmaAno } = useDisciplinasTurmaAno();
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {professores.map(prof => (
        <div key={prof.id}>{prof.nome}</div>
      ))}
    </div>
  );
}
```

### 4. **Usar Serviços do Firestore**

```javascript
import { getProfessores, updateSchedule, getDisciplinasPorTurma } from "./services/firestoreService";

// Buscar professores
const professores = await getProfessores();

// Atualizar horário
await updateSchedule("PI01", { entries: [...], published: true });

// Buscar disciplinas de uma turma
const disciplinas = await getDisciplinasPorTurma("PI01");
```

### 5. **Exportar PDF**

```javascript
import { downloadSchedulePDF } from "./utils/pdfExport";

const scheduleRef = useRef();

<div ref={scheduleRef}>
  {/* Conteúdo do horário */}
</div>

<button onClick={() => downloadSchedulePDF(scheduleRef, "horario-PI01.pdf")}>
  Baixar PDF
</button>
```

---

## 🚀 Processo de Migração

### Passo 1: Migrar Dados para o Firebase

1. Faça login como **Admin**
2. Clique no botão **"🚀 Migrar Dados para Firebase"** no canto inferior direito
3. Confirme a migração
4. Aguarde a conclusão (verifique o console do navegador)

### Passo 2: Verificar Dados no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá para **Firestore Database**
3. Verifique se as coleções foram criadas:
   - `artifacts/default-app-id/public/data/professores`
   - `artifacts/default-app-id/public/data/turmas`
   - `artifacts/default-app-id/public/data/disciplinas_turma_ano`

### Passo 3: Remover Código Hardcoded (Após Migração)

Após confirmar que os dados estão no Firebase:

1. Remover o import do `Disciplinas_Turma_Ano`
2. Remover as constantes `PROFESSORES_EXEMPLO`, `DISCIPLINAS`, etc.
3. Remover o componente `MigrationButton`
4. Usar os hooks e serviços para buscar dados do Firebase

---

## 📝 Benefícios da Refatoração

### ✅ **Antes (Código Hardcoded)**
- ❌ Dados no código-fonte
- ❌ Difícil de atualizar
- ❌ Requer recompilação para mudanças
- ❌ Arquivo App.js com 929 linhas
- ❌ Código difícil de manter

### ✅ **Depois (Dados no Firebase)**
- ✅ Dados no banco de dados
- ✅ Fácil de atualizar via Firebase Console
- ✅ Mudanças em tempo real
- ✅ Código modular e organizado
- ✅ Fácil manutenção e extensão

---

## 🔄 Atualizando Dados no Firebase

### Via Firebase Console:

1. Acesse o Firebase Console
2. Vá para Firestore Database
3. Navegue até a coleção desejada
4. Edite os documentos diretamente

### Via Código (Exemplo):

```javascript
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Atualizar horas de uma disciplina
const turmaRef = doc(db, "artifacts/default-app-id/public/data/disciplinas_turma_ano", "PI01");
await updateDoc(turmaRef, {
  "disciplinas.0.horas": 200 // Atualiza as horas da primeira disciplina
});
```

---

## 🛠️ Próximos Passos

1. ✅ Criar estrutura de pastas
2. ✅ Criar módulos e serviços
3. ✅ Criar script de migração
4. ✅ Adicionar botão de migração
5. ⏳ **Executar migração** ← VOCÊ ESTÁ AQUI
6. ⏳ Refatorar componentes principais
7. ⏳ Testar funcionalidades
8. ⏳ Remover código antigo
9. ⏳ Documentar mudanças

---

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique o console do navegador (F12)
2. Verifique o Firebase Console
3. Verifique as permissões do Firestore
4. Consulte os logs de erro

---

**Última atualização:** ${new Date().toLocaleDateString("pt-PT")}