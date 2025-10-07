# ⚡ RESUMO RÁPIDO: Regras do Firebase

## 🎯 O QUE FAZER (5 minutos)

### 1️⃣ FIRESTORE RULES
```
Firebase Console → Firestore Database → Regras → Copiar e Colar → Publicar
```

**Cole isto:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/default-app-id/public/data/menus/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /artifacts/default-app-id/public/data/horarios/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /artifacts/default-app-id/public/data/horasRestantes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /artifacts/default-app-id/public/data/professores/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /artifacts/default-app-id/public/data/turmas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /artifacts/default-app-id/public/data/disciplinas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 2️⃣ STORAGE RULES
```
Firebase Console → Storage → Regras → Copiar e Colar → Publicar
```

**Cole isto:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cardapios/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024
                   && imageId.matches('cardapio_[0-9]+\\.(jpg|jpeg|png)');
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 3️⃣ AUTHENTICATION
```
Firebase Console → Authentication → Sign-in method → Anonymous → Enable
```

---

### 4️⃣ CRIAR DOCUMENTO INICIAL

**No Firestore Database, crie esta estrutura:**

```
artifacts (coleção)
  └─ default-app-id (documento)
      └─ public (coleção)
          └─ data (documento)
              └─ menus (coleção)
                  └─ current (documento)
                      └─ semanas: [] (campo tipo array)
```

**Como criar:**
1. Firestore → Start collection → `artifacts`
2. Document ID: `default-app-id`
3. Add field: `placeholder` (string) = `temp`
4. Save
5. Clique em `default-app-id` → Start collection → `public`
6. Document ID: `data`
7. Add field: `placeholder` (string) = `temp`
8. Save
9. Clique em `data` → Start collection → `menus`
10. Document ID: `current`
11. Add field: `semanas` (array) = [] (vazio)
12. Save

---

## ✅ TESTAR

1. `npm start`
2. Login como Admin (senha: `admin123`)
3. Gerir Cardápio → Preencher datas → Escolher imagem → Publicar
4. Abrir Console (F12) → Ver logs com `[MenuAdmin]`
5. Verificar se aparece na lista de cardápios publicados
6. Logout → Login como Aluno → Ver cardápio

---

## 🚨 SE NÃO FUNCIONAR

### Teste com regras permissivas (TEMPORÁRIO):

**Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Storage:**
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

⚠️ **ATENÇÃO**: Volte para as regras seguras depois de confirmar que funciona!

---

## 📋 CHECKLIST

- [ ] Regras do Firestore aplicadas
- [ ] Regras do Storage aplicadas
- [ ] Authentication Anonymous habilitado
- [ ] Documento `current` criado com campo `semanas: []`
- [ ] Testado upload de cardápio
- [ ] Cardápio aparece para alunos

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:
- `FIREBASE_REGRAS_COMPLETAS.md` - Explicação detalhada de todas as regras
- `APLICAR_REGRAS_PASSO_A_PASSO.md` - Guia visual passo a passo com screenshots

---

**Tempo**: 5 minutos
**Dificuldade**: ⭐⭐☆☆☆