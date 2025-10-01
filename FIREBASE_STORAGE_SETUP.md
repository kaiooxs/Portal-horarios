# 🔥 Configuração do Firebase Storage

## 📋 Guia Passo a Passo

Este guia mostra como configurar o Firebase Storage para o sistema de upload de cardápios.

---

## 🎯 Pré-requisitos

- ✅ Conta Firebase criada
- ✅ Projeto Firebase configurado
- ✅ Firebase já integrado no projeto

---

## 📝 Passo 1: Ativar Firebase Storage

### 1.1 Acessar Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. No menu lateral, clique em **"Storage"**

### 1.2 Iniciar Storage

1. Clique em **"Get Started"** ou **"Começar"**
2. Leia as informações sobre regras de segurança
3. Clique em **"Next"** ou **"Avançar"**

### 1.3 Escolher Localização

1. Selecione a localização do servidor
   - **Recomendado para Portugal**: `europe-west1` (Bélgica)
   - Alternativas: `europe-west2` (Londres), `europe-west3` (Frankfurt)
2. Clique em **"Done"** ou **"Concluído"**

### 1.4 Aguardar Criação

- O Firebase criará o bucket de storage
- Isso pode levar alguns segundos
- Quando concluído, você verá a interface do Storage

---

## 🔒 Passo 2: Configurar Regras de Segurança

### 2.1 Acessar Regras

1. Na página do Storage, clique na aba **"Rules"** ou **"Regras"**
2. Você verá o editor de regras

### 2.2 Configurar Regras

**Opção 1: Regras Recomendadas (Mais Seguras)**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Pasta de cardápios
    match /cardapios/{imageId} {
      // Qualquer pessoa pode ler (ver as imagens)
      allow read: if true;
      
      // Apenas usuários autenticados podem escrever (fazer upload)
      allow write: if request.auth != null;
    }
  }
}
```

**Opção 2: Regras Mais Restritivas (Apenas Admin)**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cardapios/{imageId} {
      // Qualquer pessoa pode ler
      allow read: if true;
      
      // Apenas admins podem escrever
      // (Você precisará implementar custom claims no Firebase Auth)
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

**Opção 3: Regras Temporárias para Testes (NÃO USE EM PRODUÇÃO)**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATENÇÃO**: A Opção 3 permite que qualquer pessoa faça upload. Use apenas para testes!

### 2.3 Publicar Regras

1. Cole as regras escolhidas no editor
2. Clique em **"Publish"** ou **"Publicar"**
3. Aguarde a confirmação

---

## ⚙️ Passo 3: Verificar Configuração no Código

### 3.1 Verificar firebaseConfig.js

Abra o arquivo `src/firebaseConfig.js` e verifique:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Deve estar presente

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com", // ✅ Deve estar preenchido
  messagingSenderId: "REACT_APP_MEASUREMENT_ID",
  appId: "REACT_APP_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Deve estar presente
```

### 3.2 Verificar storageBucket

O campo `storageBucket` deve estar no formato:

```
SEU_PROJETO.appspot.com
```

**Como encontrar:**
1. No Firebase Console, vá para **Project Settings** (⚙️)
2. Role até **"Your apps"**
3. Copie o valor de **"storageBucket"**

---

## 🧪 Passo 4: Testar o Sistema

### 4.1 Teste de Upload

1. **Iniciar aplicação**
   ```powershell
   npm start
   ```

2. **Fazer login como Admin**
   - Tipo de acesso: Administração
   - Senha: `admin123`

3. **Acessar Gestão de Cardápio**
   - Clicar em "🍽️ Gerir Cardápio"

4. **Fazer upload de teste**
   - Preencher datas
   - Selecionar uma imagem
   - Clicar em "Publicar Cardápio"

5. **Verificar sucesso**
   - Deve aparecer mensagem: "✅ Cardápio publicado com sucesso!"
   - A imagem deve aparecer na lista de cardápios publicados

### 4.2 Teste de Visualização

1. **Fazer logout**

2. **Login como Aluno**
   - Tipo de acesso: Alunos
   - Turma: PI01

3. **Acessar Cardápio**
   - Clicar em "🍽️ Cardápio"

4. **Verificar visualização**
   - A imagem deve aparecer
   - Botões "Ver em Tamanho Real" e "Baixar" devem funcionar

### 4.3 Verificar no Firebase Console

1. Volte ao Firebase Console
2. Vá para **Storage**
3. Você deve ver a pasta **"cardapios"**
4. Dentro dela, a imagem que você fez upload

---

## 🐛 Resolução de Problemas

### Problema 1: "Firebase Storage is not configured"

**Causa:** Storage não foi ativado no Firebase Console

**Solução:**
1. Acesse Firebase Console
2. Vá para Storage
3. Clique em "Get Started"
4. Complete a configuração

---

### Problema 2: "Permission denied"

**Causa:** Regras de segurança bloqueando acesso

**Solução:**
1. Verifique as regras no Firebase Console
2. Certifique-se de que `allow read: if true;` está presente
3. Para upload, verifique se `allow write` está configurado corretamente

---

### Problema 3: "storageBucket is not defined"

**Causa:** Campo `storageBucket` não está configurado em `firebaseConfig.js`

**Solução:**
1. Acesse Firebase Console → Project Settings
2. Copie o valor de `storageBucket`
3. Cole em `firebaseConfig.js`

---

### Problema 4: "Failed to upload image"

**Possíveis causas:**
- Imagem muito grande (> 5MB)
- Formato não suportado
- Problemas de conexão

**Soluções:**
1. Comprima a imagem
2. Converta para JPG ou PNG
3. Verifique sua conexão com internet
4. Tente novamente

---

### Problema 5: "Image URL not loading"

**Causa:** CORS ou regras de acesso

**Solução:**
1. Verifique se `allow read: if true;` está nas regras
2. Limpe o cache do navegador
3. Tente em modo anônimo/privado

---

## 📊 Monitoramento

### Ver Uso do Storage

1. Firebase Console → Storage
2. Aba **"Usage"** ou **"Uso"**
3. Veja:
   - Espaço usado
   - Número de arquivos
   - Transferências

### Limites do Plano Gratuito (Spark)

- **Armazenamento**: 5 GB
- **Download**: 1 GB/dia
- **Upload**: 1 GB/dia

**Para o sistema de cardápios:**
- Cada imagem: ~1-2 MB
- 100 cardápios: ~100-200 MB
- Bem dentro do limite gratuito! ✅

---

## 🔐 Segurança Avançada

### Validação de Tipo de Arquivo

Adicione às regras para aceitar apenas imagens:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cardapios/{imageId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024; // Máx 5MB
    }
  }
}
```

### Validação de Nome de Arquivo

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cardapios/{imageId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && imageId.matches('cardapio_[0-9]+\\.(jpg|jpeg|png)');
    }
  }
}
```

---

## 📝 Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

### Firebase Console
- [ ] Storage ativado
- [ ] Localização escolhida (europe-west1)
- [ ] Regras de segurança configuradas
- [ ] Regras publicadas

### Código
- [ ] `getStorage` importado em firebaseConfig.js
- [ ] `storage` exportado em firebaseConfig.js
- [ ] `storageBucket` preenchido em firebaseConfig
- [ ] MenuAdmin.js importa `storage`

### Testes
- [ ] Upload de imagem funciona
- [ ] Imagem aparece na lista de cardápios
- [ ] Visualização funciona para alunos
- [ ] Visualização funciona para professores
- [ ] Botão "Ver em Tamanho Real" funciona
- [ ] Botão "Baixar" funciona
- [ ] Remoção de cardápio funciona

### Firebase Console (Verificação)
- [ ] Pasta "cardapios" existe no Storage
- [ ] Imagens aparecem no Storage
- [ ] URLs das imagens são acessíveis

---

## 🎓 Recursos Adicionais

### Documentação Oficial
- **Firebase Storage**: https://firebase.google.com/docs/storage
- **Security Rules**: https://firebase.google.com/docs/storage/security

### Tutoriais
- **Upload de Arquivos**: https://firebase.google.com/docs/storage/web/upload-files
- **Download de Arquivos**: https://firebase.google.com/docs/storage/web/download-files

### Vídeos (YouTube)
- Pesquise: "Firebase Storage Tutorial"
- Pesquise: "Firebase Storage React"

---

## 💡 Dicas

### Otimização de Imagens

Antes de fazer upload, otimize as imagens:

1. **Comprimir**
   - Use: TinyPNG, Squoosh, ImageOptim
   - Reduz tamanho sem perder qualidade

2. **Redimensionar**
   - Largura máxima: 1200px
   - Altura proporcional
   - Suficiente para visualização

3. **Formato**
   - JPG: Fotos e imagens complexas
   - PNG: Imagens com texto nítido
   - WebP: Melhor compressão (se suportado)

### Backup

Mantenha backup das imagens:

1. **Local**
   - Salve em pasta no computador
   - Organize por data

2. **Cloud**
   - Google Drive, Dropbox, OneDrive
   - Sincronização automática

3. **Firebase**
   - As imagens já ficam salvas
   - Mas mantenha backup adicional

---

## 🆘 Suporte

### Problemas com Firebase
- 📖 **Documentação**: https://firebase.google.com/docs
- 💬 **Stack Overflow**: https://stackoverflow.com/questions/tagged/firebase
- 🐛 **GitHub Issues**: https://github.com/firebase/firebase-js-sdk/issues

### Problemas com o Sistema
- 📧 **Email**: suporte.ti@epalc.pt
- 📱 **Telefone**: +351 XXX XXX XXX
- 📖 **Documentação**: CARDAPIO_UPLOAD_GUIA.md

---

## ✅ Conclusão

Após seguir este guia, você terá:

- ✅ Firebase Storage ativado e configurado
- ✅ Regras de segurança apropriadas
- ✅ Sistema de upload funcionando
- ✅ Visualização de cardápios operacional

**Próximo passo:** Comece a publicar os cardápios semanais! 🎉

---

**Versão do Documento:** 1.0  
**Data:** Janeiro 2025  
**Sistema:** Portal de Horários EPALC v1.2.0