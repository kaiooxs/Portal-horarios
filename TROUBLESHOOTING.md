# 🔧 Guia de Troubleshooting - Portal de Horários

## 🐛 **Problemas Comuns e Soluções**

---

## 1️⃣ **Disciplinas não aparecem no ProfessorDashboard**

### **Sintomas:**
- Professor seleciona uma turma
- Aparece "Nenhuma disciplina atribuída a você para esta turma"
- Mas você sabe que existem disciplinas no Firebase

### **Causas Possíveis:**

#### **A) Dados não estão no Firebase**
**Solução:**
1. Abra o Firebase Console
2. Navegue até `artifacts → default-app-id → public → data → disciplinas_turma_ano`
3. Verifique se existe um documento com o ID da turma (ex: `PI01`)
4. Se não existir, adicione manualmente seguindo o guia `FIREBASE_DATA_COMPLETE.md`

#### **B) Nome do professor não corresponde**
**Solução:**
1. Verifique o nome exato no Firebase (ex: "João Leite")
2. Verifique se o nome tem acentos corretos
3. A comparação é feita sem acentos, mas o nome deve estar correto

#### **C) Hook não está carregando dados**
**Solução:**
1. Abra o console do navegador (F12)
2. Procure por erros relacionados ao Firestore
3. Verifique se o hook `useDisciplinasTurmaAno()` está retornando dados
4. Adicione um `console.log` no componente:
```javascript
console.log("Disciplinas carregadas:", disciplinasTurmaAno);
```

---

## 2️⃣ **Erro: "Firebase not initialized"**

### **Sintomas:**
- Aplicação não carrega
- Console mostra erro relacionado ao Firebase

### **Solução:**
1. Verifique se o arquivo `firebaseConfig.js` existe
2. Verifique se as credenciais do Firebase estão corretas
3. Verifique se o Firebase está habilitado no console

---

## 3️⃣ **Erro: "Module not found"**

### **Sintomas:**
- Erro ao compilar
- Mensagem: "Module not found: Can't resolve './components/...'"

### **Solução:**
1. Verifique se todos os arquivos foram criados corretamente
2. Verifique os caminhos de importação
3. Execute:
```powershell
npm install
```

---

## 4️⃣ **Horários não aparecem para o aluno**

### **Sintomas:**
- Aluno faz login
- Aparece "O horário da sua turma ainda não foi publicado"

### **Causas Possíveis:**

#### **A) Horário não foi publicado**
**Solução:**
1. Faça login como Admin
2. Encontre a turma do aluno
3. Clique em "Publicar"

#### **B) Turma não existe no Firebase**
**Solução:**
1. Verifique se a turma existe em `schedules/[turma]`
2. Se não existir, crie um documento vazio:
```javascript
{
  entries: [],
  published: false
}
```

---

## 5️⃣ **Disponibilidades não salvam**

### **Sintomas:**
- Professor marca disponibilidades
- Clica em "Salvar"
- Aparece erro ou não salva

### **Causas Possíveis:**

#### **A) Permissões do Firestore**
**Solução:**
1. Abra o Firebase Console
2. Vá para Firestore Database → Rules
3. Verifique se as regras permitem escrita:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ATENÇÃO: Apenas para desenvolvimento!
    }
  }
}
```

#### **B) Nome do professor incorreto**
**Solução:**
1. Verifique se o nome do professor está correto
2. O ID do documento é gerado a partir do nome (ex: "João Leite" → "joao_leite")

---

## 6️⃣ **PDF não gera corretamente**

### **Sintomas:**
- Clica em "Baixar PDF"
- PDF está em branco ou cortado

### **Solução:**
1. Verifique se o elemento HTML existe
2. Aguarde alguns segundos antes de gerar o PDF
3. Verifique se `html2canvas` e `jsPDF` estão instalados:
```powershell
npm install html2canvas jspdf
```

---

## 7️⃣ **Aplicação não compila**

### **Sintomas:**
- Erro ao executar `npm start`
- Mensagens de erro no terminal

### **Solução:**

#### **A) Dependências faltando**
```powershell
npm install
```

#### **B) Cache corrompido**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### **C) Porta 3000 ocupada**
```powershell
# Matar processo na porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

---

## 8️⃣ **Dados não atualizam em tempo real**

### **Sintomas:**
- Faz mudança no Firebase Console
- Aplicação não atualiza automaticamente

### **Causas Possíveis:**

#### **A) Subscription não está ativa**
**Solução:**
1. Verifique se o componente está usando `onSnapshot` (não `getDocs`)
2. Verifique se o `useEffect` tem cleanup:
```javascript
useEffect(() => {
  const unsub = onSnapshot(...);
  return () => unsub(); // IMPORTANTE!
}, []);
```

#### **B) Firestore offline**
**Solução:**
1. Verifique sua conexão com a internet
2. Verifique se o Firebase está online

---

## 9️⃣ **Login não funciona**

### **Sintomas:**
- Insere senha correta
- Não faz login

### **Solução:**

#### **A) Senha incorreta**
- Admin: `admin123`
- Professor: `prof123`
- Aluno: sem senha (apenas turma)

#### **B) Nome do professor não selecionado**
**Solução:**
1. Certifique-se de selecionar o nome antes de inserir a senha

#### **C) Turma não existe**
**Solução:**
1. Verifique se a turma está na lista `TURMAS` em `constants/index.js`

---

## 🔟 **Console mostra warnings**

### **Sintomas:**
- Aplicação funciona, mas console mostra avisos

### **Warnings Comuns:**

#### **A) "Each child should have a unique key"**
**Solução:**
Adicione `key` prop em listas:
```javascript
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

#### **B) "Can't perform a React state update on an unmounted component"**
**Solução:**
Adicione cleanup em `useEffect`:
```javascript
useEffect(() => {
  let mounted = true;
  
  fetchData().then(data => {
    if (mounted) {
      setData(data);
    }
  });
  
  return () => { mounted = false; };
}, []);
```

---

## 🔍 **Como Debugar**

### **1. Console do Navegador (F12)**
```javascript
// Adicione logs nos componentes
console.log("Dados carregados:", data);
console.log("Estado atual:", state);
```

### **2. React DevTools**
1. Instale a extensão React DevTools
2. Inspecione componentes
3. Veja props e state em tempo real

### **3. Firebase Console**
1. Vá para Firestore Database
2. Verifique os dados manualmente
3. Use a aba "Usage" para ver queries

### **4. Network Tab**
1. Abra DevTools → Network
2. Filtre por "firestore"
3. Veja as requisições ao Firebase

---

## 📋 **Checklist de Verificação**

Quando algo não funcionar, verifique:

- [ ] Todos os arquivos foram criados corretamente
- [ ] Dados estão no Firebase
- [ ] Imports estão corretos
- [ ] Nomes de professores estão corretos (com acentos)
- [ ] Turmas existem na lista `TURMAS`
- [ ] Firebase está configurado corretamente
- [ ] Dependências estão instaladas (`npm install`)
- [ ] Não há erros no console do navegador
- [ ] Firestore rules permitem leitura/escrita
- [ ] Conexão com internet está ativa

---

## 🆘 **Ainda com Problemas?**

### **Passo 1: Verificar Logs**
```javascript
// Adicione no componente com problema
console.log("=== DEBUG ===");
console.log("Props:", props);
console.log("State:", state);
console.log("Dados:", data);
```

### **Passo 2: Verificar Firebase**
1. Abra Firebase Console
2. Vá para Firestore Database
3. Verifique se os dados existem
4. Tente fazer uma query manual

### **Passo 3: Verificar Imports**
```javascript
// Verifique se todos os imports estão corretos
import { useDisciplinasTurmaAno } from "../hooks/useFirestore";
import { normalizarNome } from "../utils/helpers";
```

### **Passo 4: Limpar Cache**
```powershell
# Limpar cache do navegador
# Ou usar modo anônimo (Ctrl+Shift+N)

# Limpar cache do npm
npm cache clean --force
```

### **Passo 5: Reiniciar Tudo**
```powershell
# Parar aplicação (Ctrl+C)
# Limpar node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstalar
npm install

# Iniciar novamente
npm start
```

---

## 📞 **Suporte**

Se nenhuma solução funcionou:

1. **Anote o erro exato** (copie a mensagem completa)
2. **Tire screenshots** do console e do Firebase
3. **Descreva o que estava fazendo** quando o erro ocorreu
4. **Me avise** com todos esses detalhes

---

## 💡 **Dicas de Prevenção**

### **1. Sempre faça backup antes de mudanças grandes**
```powershell
Copy-Item -Path "src" -Destination "src-backup" -Recurse
```

### **2. Use Git para controle de versão**
```powershell
git init
git add .
git commit -m "Refatoração completa"
```

### **3. Teste em ambiente de desenvolvimento primeiro**
- Não faça mudanças direto em produção
- Use Firebase Emulator para testes locais

### **4. Mantenha dependências atualizadas**
```powershell
npm outdated
npm update
```

### **5. Monitore o Firebase**
- Verifique uso de leitura/escrita
- Configure alertas de quota
- Monitore erros no console

---

## ✅ **Testes Recomendados**

Após qualquer mudança, teste:

1. **Login**
   - [ ] Admin consegue fazer login
   - [ ] Professor consegue fazer login
   - [ ] Aluno consegue fazer login

2. **ProfessorDashboard**
   - [ ] Disciplinas aparecem ao selecionar turma
   - [ ] Disponibilidades salvam corretamente
   - [ ] Horários publicados aparecem

3. **AdminDashboard**
   - [ ] Status de disponibilidades aparece
   - [ ] Consegue editar horários
   - [ ] Consegue publicar/despublicar

4. **AlunoDashboard**
   - [ ] Horário publicado aparece
   - [ ] Horário não publicado não aparece

5. **Geral**
   - [ ] Logout funciona
   - [ ] PDF gera corretamente
   - [ ] Dados atualizam em tempo real

---

**Última atualização:** ${new Date().toLocaleDateString("pt-PT")}

**Boa sorte! 🍀**