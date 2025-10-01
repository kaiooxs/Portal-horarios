# 🚀 Guia de Deploy no Vercel

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Vercel (pode usar login do GitHub)
- ✅ Repositório no GitHub atualizado
- ✅ Firebase configurado e funcionando

---

## 📦 Passo 1: Preparar o Projeto

### 1.1 Verificar Arquivos Essenciais

Certifique-se de que estes arquivos existem:

```
✅ package.json
✅ .gitignore
✅ public/imagens/logo-epalc.png
✅ public/imagens/logo-parcerias.png
✅ src/firebaseConfig.js
```

### 1.2 Verificar .gitignore

O arquivo `.gitignore` deve conter:

```
# dependencies
/node_modules

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

⚠️ **IMPORTANTE**: Nunca faça commit do arquivo `firebaseConfig.js` com credenciais reais!

---

## 🔐 Passo 2: Proteger Credenciais Firebase

### 2.1 Criar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto (NÃO faça commit deste arquivo):

```env
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

### 2.2 Atualizar firebaseConfig.js

Modifique `src/firebaseConfig.js` para usar variáveis de ambiente:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 📤 Passo 3: Atualizar GitHub

### 3.1 Verificar Status

```powershell
git status
```

### 3.2 Adicionar Arquivos

```powershell
git add .
```

### 3.3 Fazer Commit

```powershell
git commit -m "v1.2.0 - Sistema de Cardápio + Identidade Visual"
```

### 3.4 Push para GitHub

```powershell
git push origin main
```

Se for a primeira vez:
```powershell
git remote add origin https://github.com/seu-usuario/portal-horarios.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 4: Deploy no Vercel

### 4.1 Acessar Vercel

1. Acesse: https://vercel.com/
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"** ou **"Import Project"**

### 4.2 Importar Repositório

1. Selecione o repositório **portal-horarios**
2. Clique em **"Import"**

### 4.3 Configurar Projeto

**Framework Preset**: Vercel detectará automaticamente como **Create React App**

**Root Directory**: `.` (deixe como está)

**Build Command**: `npm run build` (padrão)

**Output Directory**: `build` (padrão)

### 4.4 Adicionar Variáveis de Ambiente

⚠️ **PASSO CRÍTICO!**

Antes de fazer deploy, adicione as variáveis de ambiente:

1. Clique em **"Environment Variables"**
2. Adicione cada variável:

| Name | Value |
|------|-------|
| `REACT_APP_FIREBASE_API_KEY` | Sua API Key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | seu-projeto.firebaseapp.com |
| `REACT_APP_FIREBASE_PROJECT_ID` | seu-projeto-id |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | seu-projeto.appspot.com |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Seu Sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Seu App ID |

3. Para cada variável:
   - Digite o **Name**
   - Digite o **Value**
   - Selecione **Production**, **Preview**, e **Development**
   - Clique em **"Add"**

### 4.5 Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Quando concluído, você verá: **"🎉 Congratulations!"**

---

## ✅ Passo 5: Verificar Deploy

### 5.1 Acessar URL

Vercel fornecerá uma URL como:
```
https://portal-horarios.vercel.app
```

### 5.2 Testar Funcionalidades

**No Desktop:**
- [ ] Página de login carrega
- [ ] Logos aparecem corretamente
- [ ] Login como Admin funciona
- [ ] Login como Professor funciona
- [ ] Login como Aluno funciona
- [ ] Dashboard carrega corretamente
- [ ] Cardápio aparece (se já publicado)

**No Mobile:**
- [ ] Abra no celular
- [ ] Teste responsividade
- [ ] Teste navegação
- [ ] Teste visualização de cardápio

### 5.3 Verificar Console

Abra o Console do navegador (F12) e verifique:
- ❌ Não deve haver erros vermelhos
- ⚠️ Avisos amarelos são aceitáveis

---

## 🔧 Passo 6: Configurações Adicionais

### 6.1 Domínio Personalizado (Opcional)

1. No Vercel, vá para **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 6.2 Configurar Redirects

Se necessário, crie `vercel.json` na raiz:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 6.3 Otimizações

**Build Settings:**
- Node.js Version: 18.x (recomendado)
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `build`

---

## 🐛 Resolução de Problemas

### Problema 1: Build Failed

**Erro**: `npm ERR! code ELIFECYCLE`

**Solução**:
1. Verifique se `package.json` está correto
2. Teste localmente: `npm run build`
3. Corrija erros antes de fazer deploy

---

### Problema 2: Página em Branco

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. Vá para Vercel → Settings → Environment Variables
2. Adicione todas as variáveis do Firebase
3. Faça redeploy: Deployments → ⋯ → Redeploy

---

### Problema 3: Imagens Não Aparecem

**Causa**: Caminho incorreto das imagens

**Solução**:
1. Verifique se as imagens estão em `public/imagens/`
2. Use caminhos absolutos: `/imagens/logo-epalc.png`
3. Não use `./` ou `../`

---

### Problema 4: Firebase Não Conecta

**Causa**: Credenciais incorretas ou domínio não autorizado

**Solução**:
1. Verifique variáveis de ambiente no Vercel
2. No Firebase Console:
   - Authentication → Settings → Authorized domains
   - Adicione: `seu-projeto.vercel.app`

---

### Problema 5: Erro 404 em Rotas

**Causa**: SPA routing não configurado

**Solução**:
Crie `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📊 Monitoramento

### Analytics do Vercel

1. Acesse: Vercel Dashboard → Analytics
2. Veja:
   - Número de visitantes
   - Tempo de carregamento
   - Erros

### Firebase Analytics

1. Ative Firebase Analytics
2. Monitore:
   - Usuários ativos
   - Páginas mais visitadas
   - Tempo de sessão

---

## 🔄 Atualizações Futuras

### Deploy Automático

Vercel faz deploy automático quando você faz push para GitHub:

```powershell
# Fazer alterações no código
git add .
git commit -m "Descrição das alterações"
git push origin main
```

Vercel detectará o push e fará deploy automaticamente! 🎉

### Deploy Manual

Se precisar fazer deploy manual:

1. Acesse Vercel Dashboard
2. Vá para o projeto
3. Clique em **"Redeploy"**

---

## 📱 Testar em Dispositivos Móveis

### Método 1: URL Direta

1. Abra o navegador no celular
2. Digite: `https://seu-projeto.vercel.app`
3. Teste todas as funcionalidades

### Método 2: QR Code

1. No Vercel, clique no projeto
2. Clique em **"Visit"**
3. Use um gerador de QR Code
4. Escaneie com o celular

### Método 3: Compartilhar Link

1. Copie a URL do Vercel
2. Envie para seu WhatsApp/Email
3. Abra no celular

---

## ✅ Checklist Final

### Antes do Deploy
- [ ] Código testado localmente
- [ ] Build funciona: `npm run build`
- [ ] Variáveis de ambiente preparadas
- [ ] Imagens no lugar correto
- [ ] Firebase configurado
- [ ] Firebase Storage ativado
- [ ] Código no GitHub atualizado

### Durante o Deploy
- [ ] Variáveis de ambiente adicionadas no Vercel
- [ ] Framework detectado corretamente
- [ ] Build concluído sem erros

### Após o Deploy
- [ ] Site acessível
- [ ] Login funciona
- [ ] Dashboards carregam
- [ ] Imagens aparecem
- [ ] Cardápio funciona
- [ ] Responsivo no mobile
- [ ] Sem erros no console

---

## 🎉 Conclusão

Após seguir este guia, você terá:

- ✅ Aplicação no GitHub
- ✅ Deploy automático no Vercel
- ✅ URL pública acessível
- ✅ Funcionando em desktop e mobile
- ✅ Variáveis de ambiente seguras
- ✅ Atualizações automáticas

**URL de Produção**: `https://seu-projeto.vercel.app`

---

## 📞 Suporte

### Vercel
- 📖 Documentação: https://vercel.com/docs
- 💬 Comunidade: https://github.com/vercel/vercel/discussions

### Firebase
- 📖 Documentação: https://firebase.google.com/docs
- 💬 Stack Overflow: https://stackoverflow.com/questions/tagged/firebase

---

**Versão do Documento:** 1.0  
**Data:** Janeiro 2025  
**Sistema:** Portal de Horários EPALC v1.2.0