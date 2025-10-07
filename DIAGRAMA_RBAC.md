# 🔐 Diagrama do Sistema RBAC

## 📊 Fluxo de Autenticação e Autorização

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUÁRIO ABRE O APP                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              Firebase Auth - Login Anônimo                      │
│              signInAnonymously()                                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         App.js - onAuthStateChanged()                           │
│         Verifica se usuário está autenticado                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
              ┌───────┴───────┐
              │               │
              ▼               ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ Usuário Existe  │  │ Usuário Novo    │
    │ no Firestore?   │  │ (Primeiro Login)│
    └────────┬────────┘  └────────┬────────┘
             │                    │
             │ SIM                │ NÃO
             │                    │
             ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ getUserFrom     │  │ Mostrar         │
    │ Firestore()     │  │ LoginScreen     │
    └────────┬────────┘  └────────┬────────┘
             │                    │
             │                    │
             ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ Auto-Login      │  │ Usuário Preenche│
    │ com role do     │  │ Formulário      │
    │ Firestore       │  │ (role, senha)   │
    └────────┬────────┘  └────────┬────────┘
             │                    │
             │                    ▼
             │           ┌─────────────────┐
             │           │ Verificar Senha │
             │           │ (Frontend)      │
             │           └────────┬────────┘
             │                    │
             │                    ▼
             │           ┌─────────────────┐
             │           │ saveUserTo      │
             │           │ Firestore()     │
             │           └────────┬────────┘
             │                    │
             └────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              USUÁRIO AUTENTICADO E AUTORIZADO                   │
│              Estado: { role, name, ... }                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
              ┌───────┴───────┐
              │               │
              ▼               ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ role = "admin"  │  │ role = "professor"│
    └────────┬────────┘  └────────┬────────┘
             │                    │
             ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ AdminDashboard  │  │ ProfessorDashboard│
    └─────────────────┘  └─────────────────┘
                      
                      ▼
              ┌─────────────────┐
              │ role = "aluno"  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ AlunoDashboard  │
              └─────────────────┘
```

---

## 🔒 Fluxo de Verificação de Permissões

```
┌─────────────────────────────────────────────────────────────────┐
│         USUÁRIO TENTA REALIZAR UMA AÇÃO                         │
│         (ex: publicar cardápio, modificar horário)              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              Firebase Recebe a Requisição                       │
│              (Firestore ou Storage)                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         Firebase Rules - Verificar Autenticação                 │
│         request.auth != null ?                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
         ┌─────────┐     ┌─────────┐
         │   SIM   │     │   NÃO   │
         └────┬────┘     └────┬────┘
              │               │
              │               ▼
              │          ┌─────────────────┐
              │          │ ❌ NEGADO       │
              │          │ "Not authenticated"│
              │          └─────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│         Firebase Rules - Obter Role do Usuário                  │
│         getUserRole() → Lê documento em users/{uid}             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         Firebase Rules - Verificar Permissão                    │
│         Baseado no tipo de operação e role                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ ADMIN           │  │ PROFESSOR       │
    │ Pode tudo       │  │ Verificar       │
    │                 │  │ ownership       │
    └────────┬────────┘  └────────┬────────┘
             │                    │
             │                    ▼
             │           ┌─────────────────┐
             │           │ É o dono do     │
             │           │ recurso?        │
             │           └────────┬────────┘
             │                    │
             │            ┌───────┴───────┐
             │            │               │
             │            ▼               ▼
             │       ┌─────────┐     ┌─────────┐
             │       │   SIM   │     │   NÃO   │
             │       └────┬────┘     └────┬────┘
             │            │               │
             ▼            ▼               ▼
    ┌─────────────────────────────┐  ┌─────────────────┐
    │ ✅ PERMITIDO                │  │ ❌ NEGADO       │
    │ Operação executada          │  │ "Insufficient   │
    │                             │  │  permissions"   │
    └─────────────────────────────┘  └─────────────────┘
                      
                      ▼
              ┌─────────────────┐
              │ ALUNO           │
              │ Apenas leitura  │
              └────────┬────────┘
                       │
               ┌───────┴───────┐
               │               │
               ▼               ▼
          ┌─────────┐     ┌─────────┐
          │  READ   │     │  WRITE  │
          └────┬────┘     └────┬────┘
               │               │
               ▼               ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ ✅ PERMITIDO    │  │ ❌ NEGADO       │
    └─────────────────┘  └─────────────────┘
```

---

## 🗂️ Estrutura de Dados no Firestore

```
artifacts/
  └── default-app-id/
      └── public/
          └── data/
              │
              ├── users/                    ← NOVA COLEÇÃO (RBAC)
              │   ├── {uid_admin}/
              │   │   ├── role: "admin"
              │   │   ├── name: ""
              │   │   ├── createdAt: timestamp
              │   │   └── lastLogin: timestamp
              │   │
              │   ├── {uid_professor}/
              │   │   ├── role: "professor"
              │   │   ├── name: "João Silva"
              │   │   ├── createdAt: timestamp
              │   │   └── lastLogin: timestamp
              │   │
              │   └── {uid_aluno}/
              │       ├── role: "aluno"
              │       ├── name: "PI01"
              │       ├── createdAt: timestamp
              │       └── lastLogin: timestamp
              │
              ├── menus/
              │   └── current/
              │       └── semanas: [...]
              │
              ├── horarios/
              │   └── {turma}/
              │       ├── entries: [...]
              │       ├── professor: "João Silva"  ← Usado para verificar ownership
              │       └── published: boolean
              │
              ├── horasRestantes/
              │   └── {professor_id}/
              │       ├── professor: "João Silva"  ← Usado para verificar ownership
              │       └── horas: {...}
              │
              ├── professores/
              │   └── {professor_id}/
              │       └── nome: "João Silva"
              │
              ├── turmas/
              │   └── {turma_id}/
              │       └── nome: "PI01"
              │
              └── disciplinas/
                  └── {disciplina_id}/
                      └── nome: "Matemática"
```

---

## 🔐 Funções de Verificação de Permissões

```
┌─────────────────────────────────────────────────────────────────┐
│                    userManager.js                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  saveUserToFirestore(uid, userData)                             │
│  ├─ Salva role e name no Firestore                             │
│  └─ Atualiza lastLogin                                          │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  getUserFromFirestore(uid)                                      │
│  ├─ Busca documento em users/{uid}                             │
│  └─ Retorna { role, name, createdAt, lastLogin }               │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Funções de Verificação de Role                                │
│  ├─ isAdmin() → boolean                                         │
│  ├─ isProfessor() → boolean                                     │
│  ├─ isAluno() → boolean                                         │
│  ├─ getCurrentUserRole() → "admin" | "professor" | "aluno"     │
│  └─ getCurrentUserName() → string                               │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  canModifyResource(resourceType, resourceData)                  │
│  ├─ Admin: sempre true                                          │
│  ├─ Aluno: sempre false                                         │
│  └─ Professor: true se resourceData.professor === userName      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Matriz de Permissões Detalhada

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARDÁPIOS (MENUS)                            │
├─────────────────────┬───────────┬───────────┬───────────────────┤
│ Operação            │   Admin   │ Professor │      Aluno        │
├─────────────────────┼───────────┼───────────┼───────────────────┤
│ Ler (read)          │     ✅    │     ✅    │        ✅         │
│ Criar (create)      │     ✅    │     ❌    │        ❌         │
│ Atualizar (update)  │     ✅    │     ❌    │        ❌         │
│ Deletar (delete)    │     ✅    │     ❌    │        ❌         │
│ Upload imagem       │     ✅    │     ❌    │        ❌         │
└─────────────────────┴───────────┴───────────┴───────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    HORÁRIOS                                     │
├─────────────────────┬───────────┬───────────┬───────────────────┤
│ Operação            │   Admin   │ Professor │      Aluno        │
├─────────────────────┼───────────┼───────────┼───────────────────┤
│ Ler (read)          │     ✅    │     ✅    │        ✅         │
│ Criar (create)      │     ✅    │  ⚠️ Seus  │        ❌         │
│ Atualizar (update)  │     ✅    │  ⚠️ Seus  │        ❌         │
│ Deletar (delete)    │     ✅    │  ⚠️ Seus  │        ❌         │
│ Publicar            │     ✅    │  ⚠️ Seus  │        ❌         │
└─────────────────────┴───────────┴───────────┴───────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    HORAS RESTANTES                              │
├─────────────────────┬───────────┬───────────┬───────────────────┤
│ Operação            │   Admin   │ Professor │      Aluno        │
├─────────────────────┼───────────┼───────────┼───────────────────┤
│ Ler (read)          │     ✅    │     ✅    │        ✅         │
│ Atualizar (update)  │     ✅    │  ⚠️ Suas  │        ❌         │
│ Recalcular          │     ✅    │  ⚠️ Suas  │        ❌         │
└─────────────────────┴───────────┴───────────┴───────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            PROFESSORES / TURMAS / DISCIPLINAS                   │
├─────────────────────┬───────────┬───────────┬───────────────────┤
│ Operação            │   Admin   │ Professor │      Aluno        │
├─────────────────────┼───────────┼───────────┼───────────────────┤
│ Ler (read)          │     ✅    │     ✅    │        ✅         │
│ Criar (create)      │     ✅    │     ❌    │        ❌         │
│ Atualizar (update)  │     ✅    │     ❌    │        ❌         │
│ Deletar (delete)    │     ✅    │     ❌    │        ❌         │
└─────────────────────┴───────────┴───────────┴───────────────────┘

Legenda:
✅ = Permitido
❌ = Negado
⚠️ = Permitido com restrições (apenas recursos próprios)
```

---

## 🔄 Fluxo de Diagnóstico de Permissões

```
┌─────────────────────────────────────────────────────────────────┐
│         USUÁRIO CLICA EM "EXECUTAR DIAGNÓSTICO"                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 1: Verificar Autenticação                                │
│  ├─ auth.currentUser existe?                                    │
│  └─ Resultado: ✅ Autenticado ou ❌ Não autenticado             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 2: Verificar Documento do Usuário                        │
│  ├─ getUserFromFirestore(uid)                                   │
│  └─ Resultado: ✅ Encontrado ou ❌ Não encontrado               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 3: Verificar Role                                        │
│  ├─ getCurrentUserRole()                                        │
│  └─ Resultado: ✅ "admin" | "professor" | "aluno"               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 4: Funções de Permissão                                  │
│  ├─ isAdmin()                                                   │
│  ├─ isProfessor()                                               │
│  ├─ isAluno()                                                   │
│  └─ Resultado: ✅ Funções funcionando corretamente              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 5: Permissões de Modificação                             │
│  ├─ canModifyResource("menu")                                   │
│  ├─ canModifyResource("horario", { professor: name })           │
│  ├─ canModifyResource("horario", { professor: "Outro" })        │
│  └─ Resultado: ✅ Permissões corretas                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  TESTE 6: Resumo das Permissões                                 │
│  ├─ Gera resumo baseado no role                                 │
│  └─ Resultado: ✅ Resumo gerado                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         EXIBIR RESULTADOS COM ESTATÍSTICAS                      │
│         ├─ Sucessos: X                                          │
│         ├─ Erros: Y                                             │
│         └─ Avisos: Z                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Pontos de Decisão nas Regras do Firebase

```
FIRESTORE RULES:

match /artifacts/default-app-id/public/data/menus/{document=**} {
  allow read: if true;                    ← Todos podem ler
  allow write: if isAdmin();              ← Apenas admin pode escrever
}

match /artifacts/default-app-id/public/data/horarios/{document=**} {
  allow read: if true;                    ← Todos podem ler
  allow write: if isAdmin()               ← Admin pode tudo
               || (isProfessor()          ← OU professor...
                   && request.resource.data.professor == getProfessorName());
                                          ← ...mas apenas seus horários
}

match /artifacts/default-app-id/public/data/horasRestantes/{document=**} {
  allow read: if true;                    ← Todos podem ler
  allow write: if isAdmin()               ← Admin pode tudo
               || (isProfessor()          ← OU professor...
                   && request.resource.data.professor == getProfessorName());
                                          ← ...mas apenas suas horas
}

match /artifacts/default-app-id/public/data/{collection}/{document=**} {
  // professores, turmas, disciplinas
  allow read: if true;                    ← Todos podem ler
  allow write: if isAdmin();              ← Apenas admin pode escrever
}
```

```
STORAGE RULES:

match /cardapios/{imageId} {
  allow read: if true;                    ← Todos podem ler
  allow write: if isAdmin()               ← Apenas admin pode fazer upload
               && request.resource.contentType.matches('image/.*')
               && request.resource.size < 5 * 1024 * 1024;
}
```

---

## 📈 Fluxo de Dados Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  App.js                                                         │
│  ├─ onAuthStateChanged() → Detecta usuário autenticado         │
│  ├─ getUserFromFirestore() → Busca role                        │
│  └─ setUser({ role, name }) → Atualiza estado                  │
│                                                                 │
│  LoginScreen.js                                                 │
│  ├─ Usuário preenche formulário                                │
│  ├─ Verifica senha (frontend)                                  │
│  └─ onLogin({ role, name }) → Callback para App.js             │
│                                                                 │
│  AdminDashboard.js / ProfessorDashboard.js / AlunoDashboard.js │
│  ├─ Renderiza interface baseada no role                        │
│  └─ Chama funções do Firestore                                 │
│                                                                 │
│  DiagnosticoPermissoes.js                                       │
│  ├─ Testa todas as permissões                                  │
│  └─ Exibe resultados visuais                                   │
│                                                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ Firebase SDK
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Firebase Authentication                                        │
│  ├─ signInAnonymously() → Cria usuário anônimo                 │
│  └─ onAuthStateChanged() → Monitora estado de autenticação     │
│                                                                 │
│  Firestore Database                                             │
│  ├─ Armazena dados (users, menus, horarios, etc.)              │
│  ├─ Aplica regras de segurança antes de cada operação          │
│  └─ Retorna dados ou erro de permissão                         │
│                                                                 │
│  Firebase Storage                                               │
│  ├─ Armazena imagens de cardápios                              │
│  ├─ Aplica regras de segurança antes de upload/download        │
│  └─ Retorna URL ou erro de permissão                           │
│                                                                 │
│  Firebase Rules (Firestore)                                     │
│  ├─ Verifica autenticação (request.auth != null)               │
│  ├─ Busca role do usuário (getUserRole())                      │
│  ├─ Verifica permissão (isAdmin(), isProfessor(), etc.)        │
│  └─ Permite ou nega operação                                   │
│                                                                 │
│  Firebase Rules (Storage)                                       │
│  ├─ Verifica autenticação (request.auth != null)               │
│  ├─ Busca role do usuário (getUserRole())                      │
│  ├─ Verifica se é admin (isAdmin())                            │
│  └─ Permite ou nega upload/download                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎉 CONCLUSÃO

Este diagrama mostra visualmente como o sistema RBAC funciona em todos os níveis:

1. **Autenticação**: Firebase Auth com login anônimo
2. **Autorização**: Baseada em role armazenado no Firestore
3. **Verificação**: Regras do Firebase verificam permissões antes de cada operação
4. **Interface**: Frontend renderiza componentes baseados no role
5. **Diagnóstico**: Ferramenta automatizada para testar todas as permissões

**Resultado**: Sistema seguro, escalável e fácil de manter! 🚀

---

**Data**: Janeiro 2025  
**Versão**: 2.0 - RBAC Implementation  
**Status**: ✅ DOCUMENTAÇÃO VISUAL COMPLETA