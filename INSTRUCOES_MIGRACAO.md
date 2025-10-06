# 🔄 Instruções de Migração de Dados

## 📋 Contexto

Você já tem dados no Firebase, mas eles estão em uma estrutura diferente do que o código espera. Este guia explica como migrar os dados existentes para a estrutura correta.

---

## 🗂️ Estrutura Atual vs. Estrutura Esperada

### ❌ **Estrutura Atual (Existente no Firebase):**

```
public/
  └── data/
      ├── Turmas/
      │   ├── PI01/
      │   │   ├── Ano Letivo: "2024/2025"
      │   │   ├── Curso: "Programação Informática"
      │   │   └── nome: "PI01"
      │   ├── PI02/
      │   └── ...
      │
      └── Professores/
          ├── joao-leite/
          │   ├── nome: "João Leite"
          │   └── disciplinas: ["Redes", "Sistemas Operativos", ...]
          ├── rui-silva/
          └── ...
```

### ✅ **Estrutura Esperada (Necessária para o sistema funcionar):**

```
artifacts/
  └── default-app-id/
      └── public/
          └── data/
              └── disciplinas_turma_ano/
                  ├── PI01/
                  │   ├── ano: "2024/2025"
                  │   ├── curso: "Programação Informática"
                  │   ├── disciplinas: [
                  │   │     {
                  │   │       disciplina: "Redes",
                  │   │       professor: "João Leite",
                  │   │       horas: 150
                  │   │     },
                  │   │     ...
                  │   │   ]
                  │   └── lastUpdated: timestamp
                  ├── PI02/
                  └── ...
```

---

## 🚀 Como Migrar os Dados

### **Opção 1: Usar o Botão no Painel Admin (RECOMENDADO)**

1. **Acesse o painel do admin**
   - Faça login como administrador
   - Vá para a aba "📅 Gerir Horários"

2. **Localize o botão de migração**
   - No topo da página, você verá um card roxo/azul com o título:
     **"🔄 Migrar Dados Existentes do Firebase"**

3. **Clique no botão "🔄 Migrar Dados"**
   - Uma confirmação aparecerá
   - Clique em "✅ Sim, Migrar"

4. **Aguarde o processo**
   - O sistema irá:
     - ✅ Ler dados de `public/data/Turmas`
     - ✅ Ler dados de `public/data/Professores`
     - ✅ Criar estrutura `disciplinas_turma_ano`
     - ✅ Popular com todas as disciplinas e professores

5. **Verifique o resultado**
   - Você verá um resumo com:
     - Número de turmas processadas
     - Número de sucessos/erros
     - Número de professores encontrados
   - Clique em "▶ Ver detalhes" para logs completos

6. **Teste o sistema**
   - Faça logout
   - Faça login como professor
   - Selecione turmas na seção "📊 Comparar Disciplinas"
   - ✅ Agora você deve ver as disciplinas e horas restantes!

---

### **Opção 2: Usar Script Node.js (Alternativo)**

Se preferir executar via linha de comando:

```bash
# 1. Certifique-se de que as variáveis de ambiente estão configuradas
# Verifique o arquivo .env na raiz do projeto

# 2. Execute o script
node src/scripts/migrateDisciplinasFromExistingData.js
```

**Vantagens:**
- ✅ Pode ser executado sem abrir o navegador
- ✅ Útil para automação
- ✅ Logs detalhados no terminal

**Desvantagens:**
- ❌ Requer Node.js instalado
- ❌ Requer configuração de variáveis de ambiente
- ❌ Menos visual que o botão

---

## 🔍 Verificação Pós-Migração

### **1. Verificar no Firebase Console**

Acesse: `https://console.firebase.google.com/project/SEU_PROJECT_ID/firestore`

Navegue até:
```
artifacts → default-app-id → public → data → disciplinas_turma_ano
```

Você deve ver:
- ✅ 10 documentos (um para cada turma: PI01, PI02, IG01, IG02, CC03, CC04, CC05, TE12, TE13, TE14)
- ✅ Cada documento contém:
  - `ano`: "2024/2025"
  - `curso`: Nome do curso
  - `disciplinas`: Array com objetos {disciplina, professor, horas}
  - `lastUpdated`: Timestamp

### **2. Verificar no Painel do Professor**

1. Faça login como professor (ex: "João Leite")
2. Vá para "📅 Disponibilidades & Horários"
3. Na seção "📊 Comparar Disciplinas e Horas entre Turmas":
   - Selecione uma ou mais turmas
   - ✅ Você deve ver uma tabela com:
     - Nome da disciplina
     - Horas restantes
     - Cores indicando urgência (verde/amarelo/vermelho)

### **3. Verificar Logs no Console do Navegador**

Abra o console (F12) e procure por:

```
[FirestoreService] Disciplinas por turma/ano carregadas: {...}
[ProfessorDashboard] Disciplinas carregadas: {...}
[ProfessorDashboard] Total de turmas com dados: 10
```

Se você ver `Total de turmas com dados: 0`, a migração não funcionou.

---

## ❓ Troubleshooting

### **Problema: Botão não aparece no painel admin**

**Solução:**
1. Certifique-se de que fez commit e push das alterações
2. Aguarde o redeploy do Vercel
3. Limpe o cache do navegador (Ctrl+Shift+R)
4. Faça logout e login novamente

---

### **Problema: Migração retorna "0 turmas processadas"**

**Causa:** Dados não existem em `public/data/Turmas`

**Solução:**
1. Verifique no Firebase Console se a coleção `public/data/Turmas` existe
2. Se não existir, use o botão **"Popular Dados no Firebase"** (card verde abaixo)
3. Esse botão irá criar dados do zero usando o arquivo `Disciplinas_Turma_Ano`

---

### **Problema: Professor não vê disciplinas após migração**

**Possíveis causas:**

1. **Nome do professor não corresponde**
   - Verifique no console do navegador (F12) os logs de debug
   - Procure por: `[DEBUG] Turma PI01: { professorLogado: "...", match: false }`
   - Se `match: false`, o nome do professor no login não corresponde ao nome no Firebase

2. **Dados não foram migrados corretamente**
   - Verifique no Firebase Console se `disciplinas_turma_ano` existe
   - Verifique se há disciplinas dentro de cada turma

3. **Cache do navegador**
   - Limpe o cache (Ctrl+Shift+R)
   - Faça logout e login novamente

---

### **Problema: Erro "Permission denied" durante migração**

**Causa:** Regras de segurança do Firestore bloqueando a escrita

**Solução:**
1. Acesse Firebase Console → Firestore Database → Rules
2. Temporariamente, adicione permissão de escrita:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/default-app-id/public/data/disciplinas_turma_ano/{document=**} {
      allow read, write: if true; // TEMPORÁRIO - apenas para migração
    }
  }
}
```

3. Após a migração, restaure as regras originais

---

## 🆚 Diferença entre os Dois Botões

### **🔄 Migrar Dados Existentes (Roxo)**
- **Quando usar:** Quando você JÁ tem dados em `public/data/Turmas` e `public/data/Professores`
- **O que faz:** Lê dados existentes e cria a estrutura `disciplinas_turma_ano`
- **Vantagem:** Preserva dados que você já configurou manualmente

### **📥 Popular Dados no Firebase (Verde)**
- **Quando usar:** Quando você NÃO tem dados ou quer resetar tudo
- **O que faz:** Lê o arquivo `src/Disciplinas_Turma_Ano` e cria dados do zero
- **Vantagem:** Rápido e simples, usa dados hardcoded

---

## 📊 Fluxo Recomendado

```
┌─────────────────────────────────────┐
│ Você já tem dados no Firebase?      │
└─────────────┬───────────────────────┘
              │
      ┌───────┴───────┐
      │               │
     SIM             NÃO
      │               │
      ▼               ▼
┌─────────────┐  ┌──────────────────┐
│ Use botão   │  │ Use botão        │
│ ROXO        │  │ VERDE            │
│ (Migrar)    │  │ (Popular)        │
└─────────────┘  └──────────────────┘
      │               │
      └───────┬───────┘
              ▼
    ┌─────────────────┐
    │ Teste com       │
    │ login professor │
    └─────────────────┘
              │
              ▼
    ┌─────────────────┐
    │ ✅ Funcionando! │
    └─────────────────┘
```

---

## 🎯 Checklist Final

Após a migração, verifique:

- [ ] Firebase Console mostra coleção `disciplinas_turma_ano`
- [ ] Existem 10 documentos (um por turma)
- [ ] Cada documento tem array `disciplinas` populado
- [ ] Professor consegue ver disciplinas ao selecionar turmas
- [ ] Horas restantes aparecem corretamente
- [ ] Cores (verde/amarelo/vermelho) funcionam
- [ ] Dados persistem após refresh da página
- [ ] Console do navegador não mostra erros

---

## 📞 Próximos Passos

1. ✅ Execute a migração usando o botão roxo
2. ✅ Verifique no Firebase Console
3. ✅ Teste com login de professor
4. ✅ Se tudo funcionar, commit e push
5. ✅ Deploy no Vercel

---

## 🔗 Links Úteis

- **Firebase Console:** https://console.firebase.google.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Firestore:** https://firebase.google.com/docs/firestore

---

**Última atualização:** 2024
**Status:** ✅ Pronto para uso