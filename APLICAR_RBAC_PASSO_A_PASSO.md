# 🔐 Guia Passo a Passo: Implementar RBAC (Controle de Acesso por Função)

## 📋 O que é RBAC?

**RBAC** (Role-Based Access Control) é um sistema de controle de acesso baseado em funções que garante que:

- **👨‍💼 Admin**: Tem acesso total (pode fazer tudo)
- **👨‍🏫 Professor**: Pode ler tudo, mas só pode modificar seus próprios horários e horas restantes
- **👨‍🎓 Aluno**: Pode apenas ver horários e cardápios (sem poder modificar nada)

---

## ⏱️ Tempo Estimado

**15-20 minutos** (incluindo testes)

---

## 📝 PASSO 1: Aplicar Regras do Firestore

### 1.1 Acessar o Firebase Console

1. Abra o navegador e acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto **portal-horarios**

### 1.2 Navegar até Firestore Database

1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Clique na aba **"Regras"** (Rules) no topo da página

### 1.3 Substituir as Regras

1. **SELECIONE TODO O CONTEÚDO** da caixa de texto (Ctrl+A)
2. **DELETE** o conteúdo antigo
3. **COPIE** as regras do arquivo `FIREBASE_REGRAS_RBAC.md` (seção "Regras Completas do Firestore")
4. **COLE** na caixa de texto
5. Clique no botão **"Publicar"** (Publish) no canto superior direito

### 1.4 Verificar Publicação

✅ Você deve ver uma mensagem de sucesso: "Regras publicadas com sucesso"

⚠️ **IMPORTANTE**: Se aparecer algum erro de sintaxe, verifique se copiou as regras corretamente.

---

## 📦 PASSO 2: Aplicar Regras do Storage

### 2.1 Navegar até Storage

1. No menu lateral esquerdo, clique em **"Storage"**
2. Clique na aba **"Regras"** (Rules) no topo da página

### 2.2 Substituir as Regras

1. **SELECIONE TODO O CONTEÚDO** da caixa de texto (Ctrl+A)
2. **DELETE** o conteúdo antigo
3. **COPIE** as regras do arquivo `FIREBASE_REGRAS_RBAC.md` (seção "Regras do Storage com RBAC")
4. **COLE** na caixa de texto
5. Clique no botão **"Publicar"** (Publish) no canto superior direito

### 2.3 Verificar Publicação

✅ Você deve ver uma mensagem de sucesso: "Regras publicadas com sucesso"

---

## 🚀 PASSO 3: Reiniciar a Aplicação

### 3.1 Parar o Servidor (se estiver rodando)

No terminal onde o app está rodando:
1. Pressione **Ctrl+C** para parar o servidor
2. Aguarde até o servidor parar completamente

### 3.2 Iniciar o Servidor Novamente

```bash
npm start
```

Aguarde até o navegador abrir automaticamente.

---

## 🧪 PASSO 4: Testar com Admin

### 4.1 Fazer Login como Admin

1. Na tela de login, selecione **"👨‍💼 Administração"**
2. Digite a senha: **admin123**
3. Clique em **"🚀 Entrar"**

### 4.2 Executar Diagnóstico de Permissões

1. Clique na aba **"🔐 Permissões RBAC"**
2. Clique no botão **"▶️ Executar Diagnóstico"**
3. Aguarde os testes serem executados

### 4.3 Verificar Resultados

✅ **Todos os testes devem passar** (ícone ✅ verde)

Você deve ver:
- ✅ Autenticação: Sucesso
- ✅ Documento do Usuário: Sucesso (Role: admin)
- ✅ Verificação de Role: ADMIN
- ✅ Funções de Permissão: isAdmin: true
- ✅ Permissões de Modificação: Pode modificar tudo

### 4.4 Testar Upload de Cardápio

1. Clique na aba **"🍽️ Gerir Cardápio"**
2. Preencha as datas
3. Escolha uma imagem
4. Clique em **"✅ Publicar Cardápio"**

✅ **Deve funcionar normalmente** (cardápio publicado com sucesso)

---

## 🧪 PASSO 5: Testar com Professor

### 5.1 Fazer Logout

1. Clique no botão **"🚪 Sair"** no canto superior direito

### 5.2 Fazer Login como Professor

1. Na tela de login, selecione **"👨‍🏫 Professores"**
2. Selecione um nome de professor (ex: "João Silva")
3. Digite a senha: **prof123**
4. Clique em **"🚀 Entrar"**

### 5.3 Executar Diagnóstico de Permissões

1. Clique na aba **"🔐 Permissões RBAC"** (se disponível)
2. Clique no botão **"▶️ Executar Diagnóstico"**
3. Aguarde os testes serem executados

### 5.4 Verificar Resultados

✅ **Todos os testes devem passar** (ícone ✅ verde)

Você deve ver:
- ✅ Autenticação: Sucesso
- ✅ Documento do Usuário: Sucesso (Role: professor)
- ✅ Verificação de Role: PROFESSOR
- ✅ Funções de Permissão: isProfessor: true
- ✅ Permissões de Modificação: 
  - ❌ Modificar cardápio: NÃO
  - ✅ Modificar próprio horário: SIM
  - ❌ Modificar horário de outro: NÃO

### 5.5 Testar Restrições

**Teste 1: Tentar publicar cardápio**
1. Clique na aba **"🍽️ Gerir Cardápio"**
2. Tente publicar um cardápio

❌ **Deve falhar** com erro de permissão (isso é esperado!)

**Teste 2: Ver horários e cardápios**
1. Clique em **"📅 Meu Horário"**
2. Clique em **"🍽️ Cardápio"**

✅ **Deve funcionar** (professor pode ver tudo)

---

## 🧪 PASSO 6: Testar com Aluno

### 6.1 Fazer Logout

1. Clique no botão **"🚪 Sair"** no canto superior direito

### 6.2 Fazer Login como Aluno

1. Na tela de login, selecione **"👨‍🎓 Alunos"**
2. Digite uma turma (ex: **PI01**)
3. Clique em **"🚀 Entrar"**

### 6.3 Verificar Interface

✅ **O aluno NÃO deve ver**:
- ❌ Aba de administração
- ❌ Botões de edição
- ❌ Opções de publicação

✅ **O aluno DEVE ver**:
- ✅ Horário da turma
- ✅ Cardápio da semana
- ✅ Botões de download

### 6.4 Testar Funcionalidades

**Teste 1: Ver horário**
1. A tela inicial já mostra o horário da turma

✅ **Deve funcionar**

**Teste 2: Ver cardápio**
1. Clique em **"🍽️ Cardápio"**
2. Veja o cardápio publicado
3. Teste os botões "Ver em Tamanho Real" e "Baixar"

✅ **Deve funcionar**

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Marque cada item conforme completa:

### Configuração do Firebase
- [ ] Regras do Firestore aplicadas
- [ ] Regras do Storage aplicadas
- [ ] Aplicação reiniciada

### Testes com Admin
- [ ] Login como admin funcionou
- [ ] Diagnóstico de permissões passou
- [ ] Upload de cardápio funcionou
- [ ] Todas as funcionalidades disponíveis

### Testes com Professor
- [ ] Login como professor funcionou
- [ ] Diagnóstico de permissões passou
- [ ] Professor NÃO pode publicar cardápio
- [ ] Professor PODE ver horários e cardápios

### Testes com Aluno
- [ ] Login como aluno funcionou
- [ ] Aluno NÃO vê opções de administração
- [ ] Aluno PODE ver horário da turma
- [ ] Aluno PODE ver e baixar cardápio

---

## 🔍 TROUBLESHOOTING

### Problema 1: "Missing or insufficient permissions"

**Causa**: As regras do Firebase não foram aplicadas corretamente

**Solução**:
1. Volte ao Firebase Console
2. Verifique se as regras foram publicadas
3. Copie e cole as regras novamente
4. Clique em "Publicar"

### Problema 2: "Property role is undefined"

**Causa**: O documento do usuário não foi criado no Firestore

**Solução**:
1. Faça logout
2. Faça login novamente
3. O código criará o documento automaticamente

### Problema 3: Diagnóstico falha no teste de "Documento do Usuário"

**Causa**: O documento não existe na coleção `users`

**Solução**:
1. Acesse Firebase Console → Firestore
2. Navegue até `artifacts/default-app-id/public/data/`
3. Verifique se existe a coleção `users`
4. Se não existir, faça logout e login novamente

### Problema 4: Admin não consegue publicar cardápio

**Causa**: As regras do Storage não foram aplicadas corretamente

**Solução**:
1. Volte ao Firebase Console → Storage → Regras
2. Verifique se as regras incluem a função `getUserRole()`
3. Copie e cole as regras novamente
4. Clique em "Publicar"

### Problema 5: Professor consegue publicar cardápio (não deveria)

**Causa**: As regras do Storage estão incorretas

**Solução**:
1. Verifique se a regra de escrita em `/cardapios/{imageId}` inclui `isAdmin()`
2. A regra deve ser: `allow write: if isAdmin() && ...`
3. Não deve ser: `allow write: if request.auth != null && ...`

---

## 📊 Resumo das Permissões Implementadas

| Recurso | Admin | Professor | Aluno |
|---------|-------|-----------|-------|
| **Ver Horários** | ✅ | ✅ | ✅ |
| **Ver Cardápios** | ✅ | ✅ | ✅ |
| **Baixar Cardápios** | ✅ | ✅ | ✅ |
| **Publicar Cardápios** | ✅ | ❌ | ❌ |
| **Modificar Horários** | ✅ Todos | ⚠️ Apenas os seus | ❌ |
| **Modificar Horas Restantes** | ✅ Todos | ⚠️ Apenas as suas | ❌ |
| **Modificar Professores/Turmas** | ✅ | ❌ | ❌ |
| **Upload de Imagens** | ✅ | ❌ | ❌ |

---

## 🎉 CONCLUSÃO

Se todos os testes passaram, **parabéns!** 🎊

Você implementou com sucesso o sistema de controle de acesso baseado em funções (RBAC) no Portal de Horários!

Agora:
- ✅ Admin tem controle total
- ✅ Professor pode gerenciar apenas seus próprios dados
- ✅ Aluno pode apenas visualizar informações

O sistema está **seguro** e **pronto para uso em produção**! 🚀

---

## 📚 Documentos Relacionados

- `FIREBASE_REGRAS_RBAC.md` - Documentação completa das regras
- `src/utils/userManager.js` - Código de gerenciamento de usuários
- `src/components/DiagnosticoPermissoes.js` - Ferramenta de diagnóstico

---

**Data**: Janeiro 2025  
**Versão**: 2.0 - RBAC Implementation  
**Status**: ✅ Guia Completo