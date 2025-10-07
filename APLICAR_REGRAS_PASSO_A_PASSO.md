# 🎯 Guia Passo a Passo: Aplicar Regras do Firebase

## ⏱️ Tempo estimado: 5-10 minutos

---

## 📋 PARTE 1: REGRAS DO FIRESTORE DATABASE

### Passo 1: Acessar Firebase Console

1. Abra seu navegador
2. Acesse: **https://console.firebase.google.com/**
3. Faça login com sua conta Google
4. Clique no seu projeto (Portal de Horários)

### Passo 2: Ir para Firestore Database

1. No menu lateral esquerdo, procure por **"Firestore Database"**
2. Clique em **"Firestore Database"**
3. Você verá a lista de documentos (ou uma tela vazia se não houver dados)

### Passo 3: Acessar as Regras

1. No topo da página, procure pelas abas
2. Clique na aba **"Regras"** (ou **"Rules"** se estiver em inglês)
3. Você verá um editor de código com as regras atuais

### Passo 4: Substituir as Regras

1. **SELECIONE TODO O CONTEÚDO** atual (Ctrl+A)
2. **DELETE** tudo (Delete ou Backspace)
3. **COPIE** o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // CARDÁPIOS
    match /artifacts/default-app-id/public/data/menus/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // HORÁRIOS
    match /artifacts/default-app-id/public/data/horarios/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // HORAS RESTANTES
    match /artifacts/default-app-id/public/data/horasRestantes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // PROFESSORES
    match /artifacts/default-app-id/public/data/professores/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // TURMAS
    match /artifacts/default-app-id/public/data/turmas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // DISCIPLINAS
    match /artifacts/default-app-id/public/data/disciplinas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // NEGAR TUDO O RESTO
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **COLE** no editor (Ctrl+V)

### Passo 5: Publicar as Regras

1. Clique no botão **"Publicar"** (ou **"Publish"**)
2. Aguarde a confirmação (aparecerá uma mensagem verde)
3. ✅ **Pronto!** Regras do Firestore aplicadas!

---

## 📋 PARTE 2: REGRAS DO FIREBASE STORAGE

### Passo 1: Ir para Storage

1. No menu lateral esquerdo, procure por **"Storage"**
2. Clique em **"Storage"**
3. Você verá a lista de arquivos (ou uma tela para ativar o Storage)

### Passo 2: Ativar Storage (Se Necessário)

**Se você ver um botão "Get Started" ou "Começar":**

1. Clique em **"Get Started"** / **"Começar"**
2. Leia as informações sobre regras
3. Clique em **"Next"** / **"Avançar"**
4. Escolha a localização: **"europe-west1"** (Bélgica - mais próximo de Portugal)
5. Clique em **"Done"** / **"Concluído"**
6. Aguarde a criação do bucket (alguns segundos)

**Se você já vê arquivos ou pastas:**
- ✅ Storage já está ativado, pule para o próximo passo

### Passo 3: Acessar as Regras do Storage

1. No topo da página, procure pelas abas
2. Clique na aba **"Regras"** (ou **"Rules"**)
3. Você verá um editor de código com as regras atuais

### Passo 4: Substituir as Regras do Storage

1. **SELECIONE TODO O CONTEÚDO** atual (Ctrl+A)
2. **DELETE** tudo (Delete ou Backspace)
3. **COPIE** o código abaixo:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // PASTA DE CARDÁPIOS
    match /cardapios/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024
                   && imageId.matches('cardapio_[0-9]+\\.(jpg|jpeg|png)');
    }
    
    // NEGAR TUDO O RESTO
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. **COLE** no editor (Ctrl+V)

### Passo 5: Publicar as Regras do Storage

1. Clique no botão **"Publicar"** (ou **"Publish"**)
2. Aguarde a confirmação (aparecerá uma mensagem verde)
3. ✅ **Pronto!** Regras do Storage aplicadas!

---

## 📋 PARTE 3: VERIFICAR AUTENTICAÇÃO ANÔNIMA

### Passo 1: Ir para Authentication

1. No menu lateral esquerdo, procure por **"Authentication"**
2. Clique em **"Authentication"**
3. Você verá a lista de usuários (ou uma tela para começar)

### Passo 2: Ativar Authentication (Se Necessário)

**Se você ver um botão "Get Started" ou "Começar":**

1. Clique em **"Get Started"** / **"Começar"**
2. Você será levado para a página de métodos de login

**Se você já vê a lista de usuários:**
- ✅ Authentication já está ativado, pule para o próximo passo

### Passo 3: Habilitar Login Anônimo

1. Clique na aba **"Sign-in method"** (ou **"Método de login"**)
2. Procure na lista por **"Anonymous"** (ou **"Anônimo"**)
3. Clique em **"Anonymous"**
4. Ative o toggle/switch para **"Enable"** (Ativar)
5. Clique em **"Save"** / **"Salvar"**
6. ✅ **Pronto!** Autenticação anônima habilitada!

---

## 📋 PARTE 4: CRIAR DOCUMENTO INICIAL (IMPORTANTE!)

### Por que fazer isso?

O código espera que o documento `current` já exista no Firestore. Se não existir, o primeiro upload pode falhar.

### Passo 1: Ir para Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Você verá a lista de coleções e documentos

### Passo 2: Criar a Estrutura

**Opção A: Se você NÃO vê nenhuma coleção chamada "artifacts":**

1. Clique em **"Start collection"** / **"Iniciar coleção"**
2. **Collection ID**: Digite `artifacts`
3. Clique em **"Next"** / **"Avançar"**
4. **Document ID**: Digite `default-app-id`
5. **Field**: Digite `placeholder`
6. **Type**: Selecione `string`
7. **Value**: Digite `temp`
8. Clique em **"Save"** / **"Salvar"**

**Opção B: Se você JÁ vê a coleção "artifacts":**

1. Clique na coleção **"artifacts"**
2. Procure pelo documento **"default-app-id"**
3. Se não existir, clique em **"Add document"** e crie com ID `default-app-id`

### Passo 3: Criar Subcoleções

Agora vamos criar a estrutura completa:

1. Clique no documento **"default-app-id"**
2. Clique em **"Start collection"** / **"Iniciar coleção"**
3. **Collection ID**: Digite `public`
4. **Document ID**: Digite `data`
5. **Field**: Digite `placeholder`, **Type**: `string`, **Value**: `temp`
6. Clique em **"Save"**

7. Clique no documento **"data"**
8. Clique em **"Start collection"**
9. **Collection ID**: Digite `menus`
10. **Document ID**: Digite `current`
11. **Field**: Digite `semanas`
12. **Type**: Selecione `array` (importante!)
13. **Value**: Deixe vazio (array vazio)
14. Clique em **"Save"**

### Passo 4: Verificar a Estrutura

Você deve ver algo assim no Firestore:

```
📁 artifacts
  └─ 📄 default-app-id
      └─ 📁 public
          └─ 📄 data
              └─ 📁 menus
                  └─ 📄 current
                      └─ semanas: []
```

✅ **Pronto!** Estrutura criada!

---

## 🧪 PARTE 5: TESTAR O SISTEMA

### Teste 1: Abrir o Aplicativo

1. Abra o terminal no diretório do projeto
2. Execute: `npm start`
3. O navegador deve abrir automaticamente
4. Se não abrir, acesse: http://localhost:3000

### Teste 2: Fazer Login como Admin

1. Na tela de login, selecione **"Administração"**
2. Digite a senha: `admin123`
3. Clique em **"Entrar"**
4. Você deve ver o painel de administração

### Teste 3: Abrir Console do Navegador

1. Pressione **F12** no teclado
2. Clique na aba **"Console"**
3. Deixe aberto durante o teste

### Teste 4: Publicar um Cardápio

1. Clique na aba **"🍽️ Gerir Cardápio"**
2. Preencha:
   - **Data Início**: Ex: "13 de Janeiro"
   - **Data Fim**: Ex: "17 de Janeiro"
3. Clique em **"Escolher Arquivo"**
4. Selecione uma imagem (JPG ou PNG, menor que 5MB)
5. Clique em **"✅ Publicar Cardápio"**

### Teste 5: Verificar os Logs

No Console do navegador (F12), você deve ver:

```
[MenuAdmin] 🚀 Iniciando publicação do cardápio...
[MenuAdmin] 📦 Convertendo imagem para blob...
[MenuAdmin] - Blob criado, tamanho: XXXXX bytes
[MenuAdmin] ☁️ Fazendo upload para Firebase Storage...
[MenuAdmin] - Upload concluído!
[MenuAdmin] 🔗 Obtendo URL da imagem...
[MenuAdmin] - URL obtida: https://firebasestorage.googleapis.com/...
[MenuAdmin] 💾 Salvando no Firestore...
[MenuAdmin] ✅ Documento salvo no Firestore!
[MenuAdmin] ✅ Cardápio publicado com sucesso!
```

### Teste 6: Verificar se Aparece na Lista

1. Role a página para baixo
2. Na seção **"📋 Cardápios Publicados"**
3. Você deve ver a imagem que acabou de publicar
4. Com as datas que você preencheu

### Teste 7: Testar como Aluno

1. Clique em **"🚪 Sair"**
2. Faça login como **"Alunos"**
3. Selecione uma turma (ex: PI01)
4. Clique em **"🍽️ Cardápio"**
5. Você deve ver o cardápio que publicou

---

## ❌ SE ALGO DER ERRADO

### Erro: "Missing or insufficient permissions"

**Solução:**
1. Volte para **Firebase Console → Firestore → Regras**
2. Verifique se as regras foram aplicadas corretamente
3. Clique em **"Publicar"** novamente
4. Aguarde 1-2 minutos para as regras propagarem
5. Tente novamente

### Erro: "Firebase Storage: User does not have permission"

**Solução:**
1. Volte para **Firebase Console → Storage → Regras**
2. Verifique se as regras foram aplicadas corretamente
3. Clique em **"Publicar"** novamente
4. Aguarde 1-2 minutos
5. Tente novamente

### Erro: "Document doesn't exist"

**Solução:**
1. Volte para **PARTE 4** deste guia
2. Crie a estrutura de documentos manualmente
3. Certifique-se de que o documento `current` existe
4. Certifique-se de que tem o campo `semanas` (tipo array)

### Nenhum log aparece no Console

**Solução:**
1. Pressione **F12** novamente
2. Clique na aba **"Console"**
3. Clique no ícone de **"Clear"** (🗑️) para limpar
4. Tente publicar o cardápio novamente
5. Se ainda não aparecer, recarregue a página (F5)

---

## ✅ CHECKLIST FINAL

Marque cada item conforme completa:

### Firebase Console
- [ ] Regras do Firestore aplicadas e publicadas
- [ ] Regras do Storage aplicadas e publicadas
- [ ] Autenticação anônima habilitada
- [ ] Estrutura de documentos criada (`artifacts/.../menus/current`)
- [ ] Documento `current` tem campo `semanas` (array vazio)

### Testes
- [ ] Aplicativo abre sem erros
- [ ] Login como admin funciona
- [ ] Upload de cardápio funciona
- [ ] Logs aparecem no Console (F12)
- [ ] Cardápio aparece na lista de publicados
- [ ] Cardápio aparece para alunos
- [ ] Cardápio aparece para professores

### Firebase Console (Verificação Final)
- [ ] Imagem aparece em **Storage → cardapios/**
- [ ] Documento atualizado em **Firestore → artifacts/.../menus/current**
- [ ] Campo `semanas` tem pelo menos 1 item

---

## 🎉 PARABÉNS!

Se todos os itens do checklist estão marcados, o sistema está funcionando perfeitamente! 🚀

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionou:

1. **Copie TODOS os logs do Console (F12)**
2. **Tire screenshots das regras do Firebase**
3. **Anote exatamente qual erro apareceu**
4. **Me envie essas informações**

Vou ajudar a resolver! 💪

---

**Tempo total**: ~10 minutos
**Dificuldade**: ⭐⭐☆☆☆ (Fácil)
**Última atualização**: Janeiro 2025