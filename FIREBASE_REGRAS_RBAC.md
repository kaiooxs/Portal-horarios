# 🔐 Regras do Firebase com Controle de Acesso por Função (RBAC)

## 📋 Visão Geral

Este documento contém as **novas regras de segurança** do Firebase que implementam controle de acesso baseado em funções:

- **👨‍💼 Admin**: Acesso total (leitura e escrita em tudo)
- **👨‍🏫 Professor**: Pode ler tudo, mas só pode modificar seus próprios horários e horas restantes
- **👨‍🎓 Aluno**: Apenas leitura de horários e cardápios (sem poder modificar nada)

---

## 🗂️ Nova Estrutura de Dados

### Coleção de Usuários (NOVA)

```
artifacts/
  └── default-app-id/
      └── public/
          └── data/
              ├── users/                    ← NOVA COLEÇÃO
              │   └── {uid}/
              │       ├── role: "admin" | "professor" | "aluno"
              │       ├── name: string (nome do professor ou turma do aluno)
              │       └── createdAt: timestamp
              ├── menus/
              ├── horarios/
              ├── horasRestantes/
              ├── professores/
              ├── turmas/
              └── disciplinas/
```

---

## 🔒 REGRAS DO FIRESTORE (NOVAS)

### 📍 Como Aplicar

1. Acesse o **Firebase Console**: https://console.firebase.google.com/
2. Selecione seu projeto
3. No menu lateral, clique em **"Firestore Database"**
4. Clique na aba **"Regras"** (Rules)
5. **SUBSTITUA TODO O CONTEÚDO** pelas regras abaixo
6. Clique em **"Publicar"** (Publish)

### 📝 Regras Completas com RBAC

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================
    
    // Verifica se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Obtém o role do usuário atual
    function getUserRole() {
      return get(/databases/$(database)/documents/artifacts/default-app-id/public/data/users/$(request.auth.uid)).data.role;
    }
    
    // Verifica se o usuário é admin
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    // Verifica se o usuário é professor
    function isProfessor() {
      return isAuthenticated() && getUserRole() == 'professor';
    }
    
    // Verifica se o usuário é aluno
    function isAluno() {
      return isAuthenticated() && getUserRole() == 'aluno';
    }
    
    // Verifica se o usuário é admin ou professor
    function isAdminOrProfessor() {
      return isAdmin() || isProfessor();
    }
    
    // Obtém o nome do professor do usuário atual
    function getProfessorName() {
      return get(/databases/$(database)/documents/artifacts/default-app-id/public/data/users/$(request.auth.uid)).data.name;
    }
    
    // ========================================
    // REGRAS PARA USUÁRIOS (NOVA COLEÇÃO)
    // ========================================
    match /artifacts/default-app-id/public/data/users/{userId} {
      // Qualquer usuário autenticado pode ler seu próprio documento
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // Qualquer usuário autenticado pode criar seu próprio documento (no primeiro login)
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Apenas o próprio usuário pode atualizar seu documento
      allow update: if isAuthenticated() && request.auth.uid == userId;
      
      // Ninguém pode deletar (apenas admin via console)
      allow delete: if false;
    }
    
    // ========================================
    // REGRAS PARA CARDÁPIOS (MENUS)
    // ========================================
    match /artifacts/default-app-id/public/data/menus/{document=**} {
      // LEITURA: Todos podem ler (admin, professor, aluno)
      allow read: if true;
      
      // ESCRITA: Apenas admin pode modificar cardápios
      allow write: if isAdmin();
    }
    
    // ========================================
    // REGRAS PARA HORÁRIOS
    // ========================================
    match /artifacts/default-app-id/public/data/horarios/{document=**} {
      // LEITURA: Todos podem ler
      allow read: if true;
      
      // ESCRITA: Admin pode tudo, professor pode modificar apenas seus próprios horários
      allow write: if isAdmin() || 
                      (isProfessor() && 
                       request.resource.data.professor == getProfessorName());
    }
    
    // ========================================
    // REGRAS PARA HORAS RESTANTES
    // ========================================
    match /artifacts/default-app-id/public/data/horasRestantes/{document=**} {
      // LEITURA: Todos podem ler
      allow read: if true;
      
      // ESCRITA: Admin pode tudo, professor pode modificar apenas suas próprias horas
      allow write: if isAdmin() || 
                      (isProfessor() && 
                       request.resource.data.professor == getProfessorName());
    }
    
    // ========================================
    // REGRAS PARA PROFESSORES
    // ========================================
    match /artifacts/default-app-id/public/data/professores/{document=**} {
      // LEITURA: Todos podem ler
      allow read: if true;
      
      // ESCRITA: Apenas admin
      allow write: if isAdmin();
    }
    
    // ========================================
    // REGRAS PARA TURMAS
    // ========================================
    match /artifacts/default-app-id/public/data/turmas/{document=**} {
      // LEITURA: Todos podem ler
      allow read: if true;
      
      // ESCRITA: Apenas admin
      allow write: if isAdmin();
    }
    
    // ========================================
    // REGRAS PARA DISCIPLINAS
    // ========================================
    match /artifacts/default-app-id/public/data/disciplinas/{document=**} {
      // LEITURA: Todos podem ler
      allow read: if true;
      
      // ESCRITA: Apenas admin
      allow write: if isAdmin();
    }
    
    // ========================================
    // BLOQUEAR TUDO O RESTO
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📦 REGRAS DO FIREBASE STORAGE (ATUALIZADAS)

### 📍 Como Aplicar

1. No **Firebase Console**, clique em **"Storage"**
2. Clique na aba **"Regras"** (Rules)
3. **SUBSTITUA TODO O CONTEÚDO** pelas regras abaixo
4. Clique em **"Publicar"** (Publish)

### 📝 Regras do Storage com RBAC

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Função auxiliar para obter o role do usuário
    function getUserRole() {
      return firestore.get(/databases/(default)/documents/artifacts/default-app-id/public/data/users/$(request.auth.uid)).data.role;
    }
    
    // Verifica se o usuário é admin
    function isAdmin() {
      return request.auth != null && getUserRole() == 'admin';
    }
    
    // ========================================
    // REGRAS PARA IMAGENS DE CARDÁPIOS
    // ========================================
    match /cardapios/{imageId} {
      // LEITURA: Todos podem ver as imagens (público)
      allow read: if true;
      
      // ESCRITA: Apenas admin pode fazer upload
      allow write: if isAdmin()
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024;  // Máximo 5MB
    }
    
    // ========================================
    // BLOQUEAR TUDO O RESTO
    // ========================================
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📊 Resumo das Permissões

| Recurso | Admin | Professor | Aluno |
|---------|-------|-----------|-------|
| **Cardápios** | ✅ Ler/Escrever | ✅ Ler | ✅ Ler |
| **Horários** | ✅ Ler/Escrever | ✅ Ler / ⚠️ Escrever apenas os seus | ✅ Ler |
| **Horas Restantes** | ✅ Ler/Escrever | ✅ Ler / ⚠️ Escrever apenas as suas | ✅ Ler |
| **Professores** | ✅ Ler/Escrever | ✅ Ler | ✅ Ler |
| **Turmas** | ✅ Ler/Escrever | ✅ Ler | ✅ Ler |
| **Disciplinas** | ✅ Ler/Escrever | ✅ Ler | ✅ Ler |
| **Upload Imagens** | ✅ Sim | ❌ Não | ❌ Não |

---

## 🧪 Como Testar

### Teste 1: Admin
```
1. Login como Admin (senha: admin123)
2. Tentar publicar cardápio → ✅ Deve funcionar
3. Tentar modificar horários → ✅ Deve funcionar
4. Tentar modificar horas restantes → ✅ Deve funcionar
```

### Teste 2: Professor
```
1. Login como Professor (senha: prof123)
2. Tentar publicar cardápio → ❌ Deve falhar (sem permissão)
3. Tentar modificar seus próprios horários → ✅ Deve funcionar
4. Tentar modificar horários de outro professor → ❌ Deve falhar
5. Ver cardápios e horários → ✅ Deve funcionar
```

### Teste 3: Aluno
```
1. Login como Aluno (turma: PI01)
2. Ver cardápios → ✅ Deve funcionar
3. Ver horários → ✅ Deve funcionar
4. Baixar cardápio → ✅ Deve funcionar
5. Tentar modificar qualquer coisa → ❌ Não há interface (protegido)
```

---

## ⚠️ IMPORTANTE

### Migração de Dados

Após aplicar as novas regras, você precisará:

1. **Criar documentos de usuários** para todos os usuários existentes
2. **Atualizar o código do app** para salvar o role no Firestore ao fazer login
3. **Testar todas as funcionalidades** com cada tipo de usuário

O código atualizado será fornecido nos próximos arquivos.

---

## 🔍 Troubleshooting

### Erro: "Missing or insufficient permissions"

**Causa**: O documento do usuário não existe na coleção `users`

**Solução**: 
1. Faça logout
2. Faça login novamente (o código atualizado criará o documento automaticamente)
3. Se persistir, crie o documento manualmente no Firebase Console

### Erro: "Property role is undefined"

**Causa**: O documento do usuário existe mas não tem o campo `role`

**Solução**:
1. Acesse Firebase Console → Firestore
2. Navegue até `artifacts/default-app-id/public/data/users/{uid}`
3. Adicione o campo `role` com valor "admin", "professor" ou "aluno"

### Professor não consegue modificar seus horários

**Causa**: O campo `professor` no documento não corresponde ao nome do professor

**Solução**:
1. Verifique se o nome do professor no documento de horários é exatamente igual ao nome salvo no documento do usuário
2. Os nomes devem ser idênticos (case-sensitive)

---

## 📚 Próximos Passos

1. ✅ Aplicar as regras do Firestore (acima)
2. ✅ Aplicar as regras do Storage (acima)
3. ⏳ Atualizar o código do App.js (próximo arquivo)
4. ⏳ Atualizar o código do LoginScreen.js (próximo arquivo)
5. ⏳ Testar todas as funcionalidades

---

**Data**: Janeiro 2025  
**Versão**: 2.0 - RBAC Implementation  
**Status**: 📝 Documentação Completa