# ✅ Checklist de Deploy - Portal de Horários EPALC v1.2.0

## 📋 Antes de Começar

### Verificações Locais
- [ ] Aplicação funciona localmente (`npm start`)
- [ ] Build funciona sem erros (`npm run build`)
- [ ] Todas as funcionalidades testadas
- [ ] Imagens carregam corretamente
- [ ] Firebase conectado e funcionando
- [ ] Firebase Storage ativado

### Arquivos Essenciais
- [ ] `package.json` existe
- [ ] `.gitignore` configurado
- [ ] `public/imagens/logo-epalc.png` existe
- [ ] `public/imagens/logo-parcerias.png` existe
- [ ] `src/firebaseConfig.js` configurado
- [ ] `README.md` atualizado

---

## 🔐 Segurança

### Credenciais Firebase
- [ ] Credenciais do Firebase anotadas em local seguro
- [ ] API Key copiada
- [ ] Auth Domain copiado
- [ ] Project ID copiado
- [ ] Storage Bucket copiado
- [ ] Messaging Sender ID copiado
- [ ] App ID copiado

### Proteção de Dados
- [ ] `.gitignore` inclui `.env`
- [ ] `.gitignore` inclui `node_modules`
- [ ] Nenhuma senha no código
- [ ] Nenhuma credencial exposta

---

## 📤 GitHub

### Preparação
- [ ] Conta GitHub criada/acessível
- [ ] Repositório criado no GitHub
- [ ] Git instalado localmente
- [ ] Git configurado (nome e email)

### Comandos Executados
```powershell
# Verificar status
git status

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "v1.2.0 - Sistema de Cardápio + Identidade Visual"

# Adicionar remote (primeira vez)
git remote add origin https://github.com/SEU-USUARIO/portal-horarios.git

# Enviar para GitHub
git push origin main
```

### Verificação GitHub
- [ ] Código aparece no GitHub
- [ ] Todos os arquivos enviados
- [ ] Imagens visíveis no repositório
- [ ] README.md renderizado corretamente

---

## 🌐 Vercel

### Configuração Inicial
- [ ] Conta Vercel criada (login com GitHub)
- [ ] Acesso a https://vercel.com/
- [ ] Repositório visível no Vercel

### Import do Projeto
- [ ] Clicado em "Add New Project"
- [ ] Repositório `portal-horarios` selecionado
- [ ] Framework detectado: Create React App
- [ ] Root Directory: `.` (padrão)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`

### Variáveis de Ambiente
- [ ] `REACT_APP_FIREBASE_API_KEY` adicionada
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN` adicionada
- [ ] `REACT_APP_FIREBASE_PROJECT_ID` adicionada
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET` adicionada
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` adicionada
- [ ] `REACT_APP_FIREBASE_APP_ID` adicionada
- [ ] Todas marcadas para Production, Preview e Development

### Deploy
- [ ] Clicado em "Deploy"
- [ ] Build iniciado
- [ ] Build concluído sem erros
- [ ] URL gerada: `https://______.vercel.app`

---

## 🔥 Firebase

### Configurações Necessárias
- [ ] Firebase Storage ativado
- [ ] Regras de Storage configuradas
- [ ] Domínio Vercel adicionado aos Authorized Domains
  - Firebase Console → Authentication → Settings → Authorized domains
  - Adicionar: `seu-projeto.vercel.app`

### Regras de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cardapios/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- [ ] Regras publicadas no Firebase Console

---

## 🧪 Testes Pós-Deploy

### Desktop (Computador)

#### Página de Login
- [ ] URL abre corretamente
- [ ] Logo EPALC aparece
- [ ] Logos de parcerias aparecem
- [ ] Formulário de login visível
- [ ] Dropdown de tipo de acesso funciona

#### Login Admin
- [ ] Selecionar "Administração"
- [ ] Digitar senha: `admin123`
- [ ] Login bem-sucedido
- [ ] Dashboard carrega
- [ ] Botão "Gerir Cardápio" visível

#### Login Professor
- [ ] Selecionar "Professores"
- [ ] Selecionar nome do professor
- [ ] Digitar senha: `prof123`
- [ ] Login bem-sucedido
- [ ] Dashboard carrega
- [ ] Botão "Cardápio" visível (se cardápio publicado)

#### Login Aluno
- [ ] Selecionar "Alunos"
- [ ] Digitar turma (ex: PI01)
- [ ] Login bem-sucedido
- [ ] Dashboard carrega
- [ ] Botão "Cardápio" visível (se cardápio publicado)

#### Funcionalidade de Cardápio (Admin)
- [ ] Clicar em "Gerir Cardápio"
- [ ] Formulário de upload aparece
- [ ] Selecionar imagem funciona
- [ ] Preview da imagem aparece
- [ ] Publicar cardápio funciona
- [ ] Mensagem de sucesso aparece
- [ ] Cardápio aparece na lista

#### Funcionalidade de Cardápio (Visualização)
- [ ] Fazer logout
- [ ] Login como aluno
- [ ] Clicar em "Cardápio"
- [ ] Imagem do cardápio aparece
- [ ] Botão "Ver em Tamanho Real" funciona
- [ ] Botão "Baixar" funciona
- [ ] Imagem abre em nova aba

### Mobile (Celular/Tablet)

#### Acesso
- [ ] Abrir URL no navegador mobile
- [ ] Página carrega corretamente
- [ ] Layout responsivo

#### Página de Login
- [ ] Logo EPALC visível e proporcional
- [ ] Logos de parcerias visíveis
- [ ] Formulário adaptado ao mobile
- [ ] Campos de input funcionam
- [ ] Teclado virtual não quebra layout

#### Navegação
- [ ] Login funciona
- [ ] Dashboard adaptado ao mobile
- [ ] Botões clicáveis (tamanho adequado)
- [ ] Scroll funciona
- [ ] Logout funciona

#### Cardápio Mobile
- [ ] Imagem do cardápio visível
- [ ] Zoom funciona (pinch to zoom)
- [ ] Botões funcionam
- [ ] Download funciona
- [ ] Visualização em tamanho real funciona

### Performance

#### Tempo de Carregamento
- [ ] Página inicial: < 3 segundos
- [ ] Dashboard: < 2 segundos
- [ ] Imagens: < 2 segundos
- [ ] Transições suaves

#### Console do Navegador (F12)
- [ ] Sem erros vermelhos
- [ ] Sem avisos críticos
- [ ] Firebase conectado
- [ ] Storage acessível

---

## 🐛 Problemas Comuns

### ❌ Página em Branco
**Solução:**
1. Verificar variáveis de ambiente no Vercel
2. Verificar console do navegador (F12)
3. Fazer redeploy no Vercel

### ❌ Imagens Não Aparecem
**Solução:**
1. Verificar se imagens estão em `public/imagens/`
2. Verificar caminhos: `/imagens/logo-epalc.png`
3. Limpar cache do navegador

### ❌ Firebase Não Conecta
**Solução:**
1. Verificar variáveis de ambiente
2. Adicionar domínio Vercel aos Authorized Domains
3. Verificar regras do Firestore

### ❌ Upload de Cardápio Falha
**Solução:**
1. Verificar se Storage está ativado
2. Verificar regras de Storage
3. Verificar tamanho da imagem (< 5MB)

---

## 📊 Métricas de Sucesso

### Funcionalidade
- ✅ 100% das funcionalidades operacionais
- ✅ Login funciona para todos os perfis
- ✅ Cardápio carrega e exibe corretamente
- ✅ Upload de cardápio funciona
- ✅ Responsivo em todos os dispositivos

### Performance
- ✅ Tempo de carregamento < 3s
- ✅ Sem erros no console
- ✅ Imagens otimizadas
- ✅ Navegação fluida

### Segurança
- ✅ Credenciais protegidas
- ✅ Variáveis de ambiente configuradas
- ✅ Regras de Firebase adequadas
- ✅ Sem dados sensíveis expostos

---

## 🎉 Deploy Concluído!

Quando todos os itens estiverem marcados:

### ✅ Seu sistema está:
- 🌐 Online e acessível
- 📱 Funcionando em mobile
- 🔒 Seguro e protegido
- ⚡ Rápido e responsivo
- 🎨 Com identidade visual institucional
- 🍽️ Com sistema de cardápio funcional

### 📢 Próximos Passos:
1. Comunicar URL à comunidade escolar
2. Treinar administradores
3. Publicar primeiro cardápio
4. Monitorar uso e feedback
5. Fazer ajustes conforme necessário

---

## 📞 Suporte

### Documentação
- `DEPLOY_VERCEL.md` - Guia detalhado de deploy
- `CARDAPIO_UPLOAD_GUIA.md` - Guia de uso do cardápio
- `FIREBASE_STORAGE_SETUP.md` - Configuração do Storage
- `README.md` - Documentação geral

### Links Úteis
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com/
- **GitHub Repo**: https://github.com/seu-usuario/portal-horarios

---

**Versão do Checklist:** 1.0  
**Data:** Janeiro 2025  
**Sistema:** Portal de Horários EPALC v1.2.0

---

## 📝 Notas

Use este espaço para anotar informações importantes:

**URL de Produção:**
```
https://_________________________.vercel.app
```

**Data do Deploy:**
```
___/___/2025
```

**Responsável:**
```
_________________________________
```

**Observações:**
```
_________________________________
_________________________________
_________________________________
```