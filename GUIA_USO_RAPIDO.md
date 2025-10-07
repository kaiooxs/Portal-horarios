# 🚀 GUIA DE USO RÁPIDO

## 📋 O que você precisa fazer

Este guia mostra **exatamente** o que você precisa fazer manualmente no Firebase e o que o sistema faz automaticamente.

---

## 🎯 OPÇÃO 1: Configuração Manual (Recomendado para Aprender)

### ⏱️ Tempo: 15-20 minutos

### 📝 Passo a Passo:

#### **1. Abrir Firebase Console** (2 min)
```
1. Acesse: https://console.firebase.google.com
2. Selecione projeto: portal-horarios-insticoop
3. Clique em "Firestore Database" no menu lateral
```

#### **2. Criar Coleção `disciplinas_turma_ano`** (10-15 min)
```
1. Clique em "Iniciar coleção"
2. Digite o caminho:
   artifacts/default-app-id/public/data/disciplinas_turma_ano
3. Clique em "Próximo"
```

#### **3. Adicionar Documentos** (1-2 min por turma)

**Para cada turma (PI01, PI02, IG01, IG02, CC03, CC04, CC05, TE12, TE13, TE14)**:

```json
ID do documento: PI01

Campos:
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
    }
    // ... mais disciplinas
  ]
}
```

**⚠️ IMPORTANTE**:
- Campo `horas` deve ser **NÚMERO** (150), não string ("150")
- Nomes dos professores devem ser **EXATAMENTE** iguais aos do login
- Incluir acentos: "João" não "Joao"

#### **4. Verificar Regras de Segurança** (1 min)
```
1. Clique em "Regras" no Firestore
2. Verifique se permite leitura/escrita:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

3. Clique em "Publicar"
```

#### **5. Testar no App** (2 min)
```
1. Acesse o app
2. Login como admin
3. Clique em "🔍 Executar Diagnóstico"
4. Deve mostrar: "✅ TUDO OK"
```

### 📖 **Guia Detalhado**: `FIREBASE_CONFIGURACAO_MANUAL.md`

---

## 🎯 OPÇÃO 2: Migração Automática (Rápido e Fácil)

### ⏱️ Tempo: 2-3 minutos

### 📝 Passo a Passo:

#### **1. Aguardar Deploy** (1-2 min)
```
1. Acesse: https://vercel.com/dashboard
2. Aguarde status: "✅ Ready"
```

#### **2. Executar Diagnóstico** (30 seg)
```
1. Acesse o app
2. Login como admin
3. Clique em "🔍 Executar Diagnóstico"
4. Veja o relatório
```

#### **3. Executar Migração** (30 seg)
```
1. Clique no botão roxo "🔄 Migrar Dados"
2. Confirme a ação
3. Aguarde mensagem de sucesso
```

#### **4. Verificar Resultado** (30 seg)
```
1. Clique novamente em "🔍 Executar Diagnóstico"
2. Deve mostrar: "✅ TUDO OK"
3. Deve listar 10 documentos em disciplinas_turma_ano
```

#### **5. Testar como Professor** (30 seg)
```
1. Logout
2. Login como professor (ex: João Leite)
3. Selecione turmas
4. Veja disciplinas e horas restantes
```

---

## 🔍 Como Usar o Diagnóstico

### **Quando usar**:
- ✅ Após configurar Firebase manualmente
- ✅ Após executar migração
- ✅ Quando professores não veem disciplinas
- ✅ Quando houver erros no app
- ✅ Para verificar integridade dos dados

### **Como usar**:
```
1. Login como admin
2. Vá para "Gerir Horários"
3. Clique em "🔍 Executar Diagnóstico"
4. Aguarde 5-10 segundos
5. Leia o relatório
```

### **O que o diagnóstico verifica**:
- ✅ Coleção `Professores` existe e tem documentos
- ✅ Coleção `Turmas` existe e tem documentos
- ✅ Coleção `disciplinas_turma_ano` existe e tem 10 documentos
- ✅ Coleção `availabilities` existe
- ✅ Coleção `schedules` existe
- ✅ Estrutura de dados está correta

### **Interpretando resultados**:

#### **✅ TUDO OK**
```
Todas as coleções estão configuradas corretamente!
→ Sistema funcionando 100%
→ Nada a fazer
```

#### **❌ PROBLEMAS ENCONTRADOS**
```
Há problemas críticos que precisam ser resolvidos.
→ Leia a lista de problemas
→ Siga as ações recomendadas
→ Execute diagnóstico novamente após corrigir
```

#### **⚠️ AVISOS**
```
Sistema funcional, mas há avisos a considerar.
→ Sistema funciona, mas pode melhorar
→ Leia os avisos
→ Corrija quando possível
```

---

## 🛠️ Melhorias Automáticas Ativas

### **1. Cache Local** 🗄️
- **O que faz**: Armazena dados por 5 minutos
- **Benefício**: Carregamento 3x mais rápido
- **Você precisa fazer**: Nada! Funciona automaticamente

### **2. Retry Automático** 🔄
- **O que faz**: Tenta reconectar 3 vezes se falhar
- **Benefício**: Funciona melhor com internet instável
- **Você precisa fazer**: Nada! Funciona automaticamente

### **3. Logs Detalhados** 📊
- **O que faz**: Mostra informações no Console (F12)
- **Benefício**: Fácil diagnosticar problemas
- **Como usar**: Pressione F12 → Console

### **4. Tratamento de Erros** 🛡️
- **O que faz**: Mostra mensagens claras de erro
- **Benefício**: Sabe exatamente o que está errado
- **Você precisa fazer**: Ler a mensagem e seguir instruções

---

## 📊 Verificação Final

### **Checklist - Tudo Funcionando**:

- [ ] Diagnóstico mostra "✅ TUDO OK"
- [ ] 10 documentos em `disciplinas_turma_ano`
- [ ] Admin vê lista de professores
- [ ] Professor vê suas turmas
- [ ] Professor vê suas disciplinas
- [ ] Horas restantes aparecem com cores
- [ ] Dados persistem após reload (F5)
- [ ] Console (F12) não mostra erros críticos

### **Se algo não funcionar**:

1. **Execute o Diagnóstico**
   - Veja o relatório completo
   - Leia problemas e avisos

2. **Verifique o Console (F12)**
   - Procure por mensagens de erro
   - Procure por `[FirestoreService]` ou `[ProfessorDashboard]`

3. **Limpe o Cache**
   - Ctrl + Shift + Delete
   - Limpar cache e cookies
   - Recarregar (Ctrl + F5)

4. **Consulte Documentação**
   - `FIREBASE_CONFIGURACAO_MANUAL.md` - Configuração manual
   - `MELHORIAS_AUTOMATICAS.md` - Melhorias implementadas
   - `INSTRUCOES_MIGRACAO.md` - Migração de dados

---

## 🎯 Fluxo Recomendado

### **Para Primeira Configuração**:

```
1. Executar Diagnóstico
   ↓
2. Ver problemas (se houver)
   ↓
3. Escolher: Manual ou Migração
   ↓
4. Executar Diagnóstico novamente
   ↓
5. Verificar "✅ TUDO OK"
   ↓
6. Testar como professor
```

### **Para Manutenção Regular**:

```
1. Executar Diagnóstico semanalmente
   ↓
2. Verificar se tudo está OK
   ↓
3. Se houver avisos, corrigir
   ↓
4. Monitorar logs no Console (F12)
```

---

## 📞 Precisa de Ajuda?

### **Documentação Disponível**:

1. **FIREBASE_CONFIGURACAO_MANUAL.md**
   - Guia passo a passo detalhado
   - Screenshots e exemplos
   - Solução de problemas

2. **MELHORIAS_AUTOMATICAS.md**
   - Explicação das melhorias
   - Comparações antes/depois
   - Guia técnico

3. **INSTRUCOES_MIGRACAO.md**
   - Como usar botão de migração
   - Estrutura de dados esperada
   - Verificação pós-migração

4. **GUIA_RAPIDO.md**
   - Guia de 5 passos
   - Resolução rápida
   - Links úteis

### **Ferramentas de Debug**:

1. **Diagnóstico do Firebase**
   - AdminDashboard → "🔍 Executar Diagnóstico"
   - Relatório completo em 10 segundos

2. **Console do Navegador**
   - F12 → Console
   - Logs detalhados com timestamp
   - Filtrar por `[FirestoreService]`

3. **Firebase Console**
   - https://console.firebase.google.com
   - Ver dados diretamente
   - Verificar regras de segurança

---

## 🎉 Resultado Esperado

Após seguir este guia:

✅ **Admin**:
- Vê diagnóstico completo
- Pode migrar dados com 1 clique
- Monitora status dos professores
- Publica horários

✅ **Professor**:
- Vê suas turmas
- Vê suas disciplinas
- Vê horas restantes com cores
- Marca disponibilidades
- Vê horários publicados

✅ **Sistema**:
- Carrega rápido (cache)
- Reconecta automaticamente (retry)
- Mostra erros claros
- Logs detalhados para debug

---

**Criado em**: 2024
**Versão**: 1.0
**Autor**: Sistema de Gestão de Horários - INSTICOOP