# 🔥 Regras Completas do Firebase para o Portal de Horários

## 📋 Visão Geral

Este documento contém **TODAS** as regras necessárias para o funcionamento completo do Portal de Horários da EPALC, incluindo:
- ✅ Upload e visualização de cardápios
- ✅ Gestão de horários
- ✅ Gestão de horas restantes
- ✅ Dados de professores, alunos e turmas

---

## 🗂️ Estrutura de Dados no Firestore

O aplicativo usa a seguinte estrutura no Firestore:

```
artifacts/
  └── default-app-id/
      └── public/
          └── data/
              ├── menus/
              │   └── current (documento com cardápios)
              ├── horarios/
              │   └── [documentos de horários por turma/professor]
              ├── horasRestantes/
              │   └── [documentos de horas restantes]
              ├── professores/
              │   └── [documentos de professores]
              ├── turmas/
              │   └── [documentos de turmas]
              └── disciplinas/
                  └── [documentos de disciplinas]
```

---

## 🔒 REGRAS DO FIRESTORE

### 📍 Como Aplicar

1. Acesse o **Firebase Console**: https://console.firebase.google.com/
2. Selecione seu projeto
3. No menu lateral, clique em **"Firestore Database"**
4. Clique na aba **"Regras"** (Rules)
5. **SUBSTITUA TODO O CONTEÚDO** pelas regras abaixo
6. Clique em **"Publicar"** (Publish)

### 📝 Regras Completas do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // REGRAS PARA CARDÁPIOS (MENUS)
    // ========================================
    match /artifacts/default-app-id/public/data/menus/{document=**} {
      // Qualquer pessoa pode LER os cardápios (alunos, professores, admin)
      allow read: if true;
      
      // Qualquer usuário AUTENTICADO pode ESCREVER
      // (Como usamos signInAnonymously, todos os usuários estão autenticados)
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRAS PARA HORÁRIOS
    // ========================================
    match /artifacts/default-app-id/public/data/horarios/{document=**} {
      // Qualquer pessoa pode ler horários
      allow read: if true;
      
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRAS PARA HORAS RESTANTES
    // ========================================
    match /artifacts/default-app-id/public/data/horasRestantes/{document=**} {
      // Qualquer pessoa pode ler
      allow read: if true;
      
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRAS PARA PROFESSORES
    // ========================================
    match /artifacts/default-app-id/public/data/professores/{document=**} {
      // Qualquer pessoa pode ler
      allow read: if true;
      
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRAS PARA TURMAS
    // ========================================
    match /artifacts/default-app-id/public/data/turmas/{document=**} {
      // Qualquer pessoa pode ler
      allow read: if true;
      
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRAS PARA DISCIPLINAS
    // ========================================
    match /artifacts/default-app-id/public/data/disciplinas/{document=**} {
      // Qualquer pessoa pode ler
      allow read: if true;
      
      // Qualquer usuário autenticado pode escrever
      allow write: if request.auth != null;
    }
    
    // ========================================
    // REGRA PADRÃO (NEGAR TUDO O RESTO)
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### ⚠️ IMPORTANTE - Sobre Autenticação

O aplicativo usa `signInAnonymously()` do Firebase Auth, o que significa:
- ✅ Todos os usuários (admin, professores, alunos) são autenticados anonimamente
- ✅ `request.auth != null` será **sempre verdadeiro** para usuários do app
- ✅ Isso permite que todos façam leitura e escrita
- ⚠️ A segurança real é feita no **frontend** (LoginScreen.js)

### 🔐 Regras Mais Seguras (Opcional - Requer Configuração Adicional)

Se você quiser restringir a escrita apenas para admins, precisará implementar **Custom Claims**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar se é admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    
    match /artifacts/default-app-id/public/data/menus/{document=**} {
      allow read: if true;
      allow write: if isAdmin(); // Apenas admins podem escrever
    }
    
    match /artifacts/default-app-id/public/data/horarios/{document=**} {
      allow read: if true;
      allow write: if isAdmin(); // Apenas admins podem escrever
    }
    
    // ... (repetir para outras coleções)
  }
}
```

⚠️ **NOTA**: Para usar Custom Claims, você precisará:
1. Criar uma Cloud Function para definir claims
2. Modificar o LoginScreen.js para chamar essa função
3. Isso está fora do escopo atual, mas pode ser implementado no futuro

---

## ☁️ REGRAS DO FIREBASE STORAGE

### 📍 Como Aplicar

1. No **Firebase Console**, clique em **"Storage"**
2. Clique na aba **"Regras"** (Rules)
3. **SUBSTITUA TODO O CONTEÚDO** pelas regras abaixo
4. Clique em **"Publicar"** (Publish)

### 📝 Regras Completas do Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // ========================================
    // REGRAS PARA PASTA DE CARDÁPIOS
    // ========================================
    match /cardapios/{imageId} {
      // Qualquer pessoa pode LER (ver as imagens)
      allow read: if true;
      
      // Qualquer usuário AUTENTICADO pode fazer UPLOAD
      // Validações:
      // - Deve ser uma imagem (image/*)
      // - Tamanho máximo: 5MB
      // - Nome do arquivo deve seguir o padrão: cardapio_TIMESTAMP.jpg/png
      allow write: if request.auth != null
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024
                   && imageId.matches('cardapio_[0-9]+\\.(jpg|jpeg|png)');
    }
    
    // ========================================
    // REGRA PADRÃO (NEGAR TUDO O RESTO)
    // ========================================
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 🧪 Regras Temporárias para Testes (Se as Acima Não Funcionarem)

Se você estiver tendo problemas, use estas regras **TEMPORARIAMENTE** para testar:

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

⚠️ **ATENÇÃO**: Estas regras permitem que **QUALQUER PESSOA** faça upload! Use apenas para diagnóstico!

Depois de confirmar que funciona, volte para as regras seguras acima.

---

## 🔍 VERIFICAÇÃO DAS REGRAS

### ✅ Checklist de Configuração

#### Firestore Database
- [ ] Regras aplicadas e publicadas
- [ ] Caminho `artifacts/default-app-id/public/data/menus` tem permissão de leitura
- [ ] Caminho `artifacts/default-app-id/public/data/menus` tem permissão de escrita para autenticados
- [ ] Outras coleções (horarios, horasRestantes, etc.) têm permissões corretas

#### Firebase Storage
- [ ] Storage ativado no Firebase Console
- [ ] Regras aplicadas e publicadas
- [ ] Pasta `cardapios/` tem permissão de leitura pública
- [ ] Pasta `cardapios/` tem permissão de escrita para autenticados
- [ ] Validações de tipo e tamanho estão ativas

#### Firebase Authentication
- [ ] Authentication ativado
- [ ] Método "Anonymous" está habilitado
- [ ] Usuários anônimos podem se autenticar

---

## 🧪 TESTANDO AS REGRAS

### Teste 1: Leitura de Cardápios

1. Faça login como **Aluno** ou **Professor**
2. Clique em **"🍽️ Cardápio"**
3. Abra o Console do navegador (F12)
4. **Resultado esperado**: 
   - ✅ Nenhum erro de permissão
   - ✅ Logs mostram: `[MenuAdmin] ✅ Dados recebidos do Firestore`

### Teste 2: Upload de Cardápio

1. Faça login como **Admin**
2. Vá para **"🍽️ Gerir Cardápio"**
3. Preencha as datas e selecione uma imagem
4. Clique em **"✅ Publicar Cardápio"**
5. Abra o Console do navegador (F12)
6. **Resultado esperado**:
   - ✅ Logs mostram todo o processo de upload
   - ✅ Mensagem final: `[MenuAdmin] ✅ Cardápio publicado com sucesso!`
   - ✅ Imagem aparece na lista de cardápios publicados

### Teste 3: Verificar no Firebase Console

1. Acesse **Firebase Console → Firestore Database**
2. Navegue até: `artifacts → default-app-id → public → data → menus → current`
3. **Resultado esperado**:
   - ✅ Documento existe
   - ✅ Campo `semanas` é um array
   - ✅ Cada semana tem: `dataInicio`, `dataFim`, `imagemUrl`

4. Acesse **Firebase Console → Storage**
5. Navegue até a pasta **`cardapios/`**
6. **Resultado esperado**:
   - ✅ Pasta existe
   - ✅ Imagens estão lá com nomes como `cardapio_1234567890.jpg`

---

## 🚨 RESOLUÇÃO DE PROBLEMAS

### Erro: "Missing or insufficient permissions"

**Causa**: Regras do Firestore bloqueando acesso

**Solução**:
1. Verifique se as regras do Firestore foram aplicadas corretamente
2. Certifique-se de que o caminho nas regras corresponde ao caminho no código:
   - Código: `artifacts/default-app-id/public/data/menus/current`
   - Regras: `artifacts/default-app-id/public/data/menus/{document=**}`
3. Verifique se `request.auth != null` está nas regras de escrita
4. Confirme que o usuário está autenticado (verifique no Console: `firebase.auth().currentUser`)

### Erro: "Firebase Storage: User does not have permission"

**Causa**: Regras do Storage bloqueando upload

**Solução**:
1. Verifique se as regras do Storage foram aplicadas
2. Certifique-se de que `allow write: if request.auth != null` está presente
3. Verifique se o nome do arquivo segue o padrão: `cardapio_TIMESTAMP.jpg`
4. Confirme que a imagem é menor que 5MB
5. Teste com as regras temporárias (allow all) para confirmar que é um problema de regras

### Erro: "Document doesn't exist" mas upload parece funcionar

**Causa**: Documento não foi criado inicialmente no Firestore

**Solução**:
1. Acesse **Firebase Console → Firestore Database**
2. Crie manualmente a estrutura:
   - Coleção: `artifacts`
   - Documento: `default-app-id`
   - Subcoleção: `public`
   - Documento: `data`
   - Subcoleção: `menus`
   - Documento: `current`
   - Campo: `semanas` (tipo: array, valor: `[]`)
3. Ou execute este código no Console do navegador (como admin):

```javascript
// Cole isso no Console do navegador (F12) quando estiver logado como admin
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const docRef = doc(db, "artifacts/default-app-id/public/data/menus", "current");
await setDoc(docRef, { semanas: [] });
console.log("✅ Documento criado!");
```

### Erro: "signInAnonymously failed"

**Causa**: Autenticação anônima não está habilitada

**Solução**:
1. Acesse **Firebase Console → Authentication**
2. Clique na aba **"Sign-in method"**
3. Encontre **"Anonymous"** na lista
4. Clique em **"Enable"** (Ativar)
5. Salve as alterações

---

## 📊 MONITORAMENTO

### Ver Logs de Acesso (Firestore)

1. Firebase Console → Firestore Database
2. Aba **"Usage"** (Uso)
3. Veja:
   - Leituras por dia
   - Escritas por dia
   - Exclusões por dia

### Ver Logs de Acesso (Storage)

1. Firebase Console → Storage
2. Aba **"Usage"** (Uso)
3. Veja:
   - Espaço usado
   - Downloads por dia
   - Uploads por dia

### Limites do Plano Gratuito (Spark)

**Firestore:**
- Leituras: 50.000/dia
- Escritas: 20.000/dia
- Exclusões: 20.000/dia
- Armazenamento: 1 GB

**Storage:**
- Armazenamento: 5 GB
- Download: 1 GB/dia
- Upload: 1 GB/dia

**Para o Portal de Horários:**
- ✅ Bem dentro dos limites gratuitos
- ✅ Mesmo com 500 alunos e 50 professores

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### Recomendações

1. **Implementar Custom Claims**
   - Definir quem é admin, professor, aluno no Firebase Auth
   - Restringir escrita apenas para admins

2. **Adicionar Rate Limiting**
   - Limitar número de uploads por usuário
   - Prevenir abuso

3. **Validar Dados no Backend**
   - Usar Cloud Functions para validar dados antes de salvar
   - Garantir integridade dos dados

4. **Monitorar Uso**
   - Configurar alertas para uso excessivo
   - Revisar logs regularmente

5. **Backup Regular**
   - Exportar dados do Firestore regularmente
   - Fazer backup das imagens do Storage

---

## 📞 SUPORTE

Se após aplicar estas regras você ainda tiver problemas:

1. **Verifique os logs do Console do navegador (F12)**
   - Procure por erros com `[MenuAdmin]`
   - Copie TODOS os logs relacionados

2. **Verifique o Firebase Console**
   - Vá para **Firestore → Regras**
   - Clique em **"Simulador"** (Simulator)
   - Teste as regras manualmente

3. **Teste com regras permissivas temporariamente**
   - Use `allow read, write: if true;` para confirmar que é um problema de regras
   - **NÃO DEIXE ASSIM EM PRODUÇÃO!**

---

## ✅ RESUMO RÁPIDO

### Para Fazer o Sistema Funcionar:

1. **Firestore Rules**: Copie e cole as regras do Firestore (seção "Regras Completas do Firestore")
2. **Storage Rules**: Copie e cole as regras do Storage (seção "Regras Completas do Storage")
3. **Authentication**: Habilite "Anonymous" no Firebase Console
4. **Teste**: Faça upload de um cardápio como admin
5. **Verifique**: Veja se aparece para alunos e professores

### Caminhos Importantes:

- **Firestore**: `artifacts/default-app-id/public/data/menus/current`
- **Storage**: `cardapios/cardapio_TIMESTAMP.jpg`
- **Auth**: Anonymous (habilitado)

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0
**Compatível com**: Firebase v9+ (modular SDK)