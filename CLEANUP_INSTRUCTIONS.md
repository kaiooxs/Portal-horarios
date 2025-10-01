# 🧹 Instruções de Limpeza - Remover Código Antigo

Após testar e confirmar que tudo funciona corretamente, você pode remover os arquivos antigos que não são mais necessários.

---

## ⚠️ **IMPORTANTE: Faça Backup Antes!**

Antes de deletar qualquer arquivo, certifique-se de que:
1. ✅ A aplicação está funcionando corretamente
2. ✅ Todos os dados estão no Firebase
3. ✅ Você testou todas as funcionalidades
4. ✅ Você tem um backup do código (Git ou cópia manual)

---

## 📋 **Arquivos para Remover**

### **1. Arquivo de Dados Hardcoded**
```
src/Disciplinas_Turma_Ano
```
**Motivo:** Os dados agora estão no Firebase na coleção `disciplinas_turma_ano`

**Como remover:**
```powershell
Remove-Item "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios\src\Disciplinas_Turma_Ano"
```

---

### **2. Botão de Migração (Opcional)**
```
src/components/MigrationButton.js
```
**Motivo:** A migração já foi feita, não é mais necessário

**Como remover:**
```powershell
Remove-Item "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios\src\components\MigrationButton.js"
```

**E remover a importação no App.js:**
```javascript
// REMOVER esta linha:
import MigrationButton from "./components/MigrationButton";

// REMOVER estas linhas:
{/* Botão temporário para migração de dados - REMOVER APÓS MIGRAÇÃO */}
{user.role === "admin" && <MigrationButton />}
```

---

### **3. Script de Migração (Opcional)**
```
src/scripts/migrateDataToFirebase.js
```
**Motivo:** A migração já foi feita, não é mais necessário

**Como remover:**
```powershell
Remove-Item "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios\src\scripts\migrateDataToFirebase.js"
```

---

### **4. Arquivos de Backup (Opcional)**
```
src/backup1.txt
src/backup1.1.txt
src/backup1.2.txt
src/backup1.3.txt
```
**Motivo:** Backups antigos que não são mais necessários

**Como remover:**
```powershell
Remove-Item "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios\src\backup*.txt"
```

---

## 🔄 **Passo a Passo para Limpeza**

### **Passo 1: Testar Tudo**
Antes de remover qualquer arquivo, teste:
- ✅ Login como Admin
- ✅ Login como Professor (teste com vários professores)
- ✅ Login como Aluno (teste com várias turmas)
- ✅ Seleção de turma no ProfessorDashboard
- ✅ Visualização de disciplinas e horas
- ✅ Salvamento de disponibilidades
- ✅ Criação de horários no AdminDashboard
- ✅ Publicação de horários
- ✅ Exportação de PDF

### **Passo 2: Fazer Backup**
```powershell
# Criar backup do projeto
Copy-Item -Path "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios" -Destination "c:\Users\Utilizador\OneDrive - INSTICOOP\Documentos\Aplicações\portal-horarios-backup" -Recurse
```

### **Passo 3: Remover Arquivos**
Execute os comandos acima para remover os arquivos desnecessários.

### **Passo 4: Atualizar App.js**
Remova as linhas relacionadas ao `MigrationButton`:

**Arquivo:** `src/App.js`

**Remover:**
```javascript
import MigrationButton from "./components/MigrationButton";
```

**E remover:**
```javascript
{/* Botão temporário para migração de dados - REMOVER APÓS MIGRAÇÃO */}
{user.role === "admin" && <MigrationButton />}
```

**Resultado final do App.js:**
```javascript
import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import AdminDashboard from "./components/AdminDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AlunoDashboard from "./components/AlunoDashboard";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        signInAnonymously(auth).catch((err) => console.error("Erro auth anon:", err));
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Portal de Horários — {user.role.toUpperCase()}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "professor" && (
          <ProfessorDashboard professorNameFromLogin={user.professorName} />
        )}
        {user.role === "aluno" && <AlunoDashboard turma={user.turma} />}
      </div>
    </div>
  );
}
```

### **Passo 5: Testar Novamente**
Após remover os arquivos, teste tudo novamente para garantir que nada quebrou.

---

## 📊 **Resultado da Limpeza**

### **Antes:**
```
src/
├── Disciplinas_Turma_Ano          ❌ (167 linhas)
├── backup1.txt                    ❌
├── backup1.1.txt                  ❌
├── backup1.2.txt                  ❌
├── backup1.3.txt                  ❌
├── components/
│   └── MigrationButton.js         ❌ (38 linhas)
└── scripts/
    └── migrateDataToFirebase.js   ❌ (285 linhas)
```

### **Depois:**
```
src/
├── components/
│   ├── AdminDashboard.js          ✅
│   ├── ProfessorDashboard.js      ✅
│   ├── AlunoDashboard.js          ✅
│   ├── LoginScreen.js             ✅
│   └── ScheduleGrid.js            ✅
├── constants/
│   └── index.js                   ✅
├── utils/
│   ├── helpers.js                 ✅
│   └── pdfExport.js               ✅
├── services/
│   └── firestoreService.js        ✅
├── hooks/
│   └── useFirestore.js            ✅
└── App.js                         ✅ (60 linhas - ainda mais limpo!)
```

---

## ⚠️ **Avisos Importantes**

1. **Não remova os arquivos antes de testar tudo!**
2. **Faça backup antes de deletar qualquer coisa!**
3. **Se algo der errado, você pode restaurar do backup**
4. **Os dados no Firebase são permanentes - não delete as coleções!**

---

## 🎯 **Quando Fazer a Limpeza?**

Faça a limpeza quando:
- ✅ Você testou todas as funcionalidades
- ✅ Tudo está funcionando perfeitamente
- ✅ Você tem certeza de que não vai precisar dos arquivos antigos
- ✅ Você fez backup do projeto

**Não faça a limpeza se:**
- ❌ Ainda está testando
- ❌ Encontrou algum bug
- ❌ Não tem certeza se tudo funciona
- ❌ Não fez backup

---

## 💡 **Dica**

Você pode manter os arquivos de migração por mais algum tempo, caso precise migrar dados novamente no futuro. Eles não atrapalham em nada!

---

## 📞 **Precisa de Ajuda?**

Se tiver dúvidas sobre o que remover ou não, me avise! 🙂

---

**Boa limpeza! 🧹✨**