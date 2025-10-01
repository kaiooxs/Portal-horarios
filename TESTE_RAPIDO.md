# 🧪 Guia de Teste Rápido - Novas Funcionalidades

## 🎯 **O que testar:**

### ✅ **1. Seleção Múltipla de Turmas (NOVO!)**
### ✅ **2. Visualização de Disciplinas e Horas (CORRIGIDO!)**
### ✅ **3. Responsividade Mobile (NOVO!)**

---

## 📱 **TESTE 1: Desktop (Computador)**

### **Passo 1: Abrir o App**
```
http://localhost:3000
```

### **Passo 2: Login como Professor**
1. Selecione: **"👨‍🏫 Professores"**
2. Nome: **"João Leite"** (ou qualquer outro professor)
3. Senha: **prof123**
4. Clique em **"🚀 Entrar"**

### **Passo 3: Testar Seleção Múltipla de Turmas**
1. Procure a seção **"📊 Comparar Disciplinas e Horas entre Turmas"**
2. Clique em **várias turmas** (ex: PI01, PI02, IG01)
3. ✅ **Verifique:** Os botões das turmas selecionadas ficam azuis
4. ✅ **Verifique:** Aparecem cards separados para cada turma

### **Passo 4: Verificar Disciplinas e Horas**
Para cada turma selecionada, você deve ver:
- ✅ Nome da turma (ex: "Turma: PI01")
- ✅ Ano letivo (ex: "📅 Ano Letivo: 2024/2025")
- ✅ Tabela com disciplinas
- ✅ Horas restantes com cores:
  - 🟢 Verde (> 20h)
  - 🟡 Amarelo (10-20h)
  - 🔴 Vermelho (< 10h)

### **Passo 5: Testar Botões de Ação Rápida**
1. Clique em **"✅ Selecionar Todas"**
   - ✅ Todas as turmas devem ser selecionadas
2. Clique em **"❌ Limpar Seleção"**
   - ✅ Todas as turmas devem ser desmarcadas

### **Passo 6: Testar Scroll Horizontal (Disponibilidades)**
1. Role até a seção **"📅 Marque os horários disponíveis"**
2. ✅ **Desktop:** Deve ver 5 colunas (Segunda a Sexta)
3. Marque alguns horários
4. Clique em **"Salvar Disponibilidades"**
5. ✅ Deve aparecer: **"✅ Disponibilidades guardadas em HH:MM:SS"**

---

## 📱 **TESTE 2: Mobile (Smartphone)**

### **Opção A: Simular no Navegador**
1. Abra o navegador (Chrome/Edge)
2. Pressione **F12** (DevTools)
3. Clique no ícone de **dispositivo móvel** (📱)
4. Selecione um dispositivo (ex: iPhone 12, Galaxy S20)
5. Recarregue a página (**F5**)

### **Opção B: Testar no Smartphone Real**
1. Encontre o IP do seu computador:
   ```powershell
   ipconfig
   ```
   Procure por "IPv4 Address" (ex: 192.168.1.100)

2. No smartphone, abra o navegador e acesse:
   ```
   http://SEU_IP:3000
   ```
   Exemplo: `http://192.168.1.100:3000`

### **Testes em Mobile:**

#### **1. Tela de Login**
- ✅ Ícone grande de livro (📚) aparece
- ✅ Data completa em português
- ✅ Campos grandes e fáceis de tocar
- ✅ Botão "🚀 Entrar" ocupa toda a largura

#### **2. Dashboard do Professor**
- ✅ Header com nome e botão "Sair" responsivo
- ✅ Seção de turmas com botões em grid (2-3 colunas)
- ✅ Cards de disciplinas empilhados verticalmente
- ✅ Tabelas com scroll horizontal

#### **3. Disponibilidades (Scroll Horizontal)**
- ✅ Aparece mensagem: **"👈 Deslize para ver todos os dias 👉"**
- ✅ Cards dos dias com largura de 280px
- ✅ Deslize com o dedo para ver todos os dias
- ✅ Checkboxes grandes (fáceis de tocar)
- ✅ Botão "Marcar Todos" em cada dia

#### **4. Orientação Landscape (Horizontal)**
- ✅ Gire o smartphone para horizontal
- ✅ Layout deve se adaptar automaticamente
- ✅ Mais conteúdo visível na tela

---

## 🎯 **TESTE 3: Comparação de Turmas (Funcionalidade Principal)**

### **Cenário: Professor que leciona em múltiplas turmas**

1. **Login:** João Leite (leciona em PI01, PI02, IG01, IG02)
2. **Selecione:** PI01 e PI02
3. **Verifique:**
   - ✅ Dois cards aparecem (um para cada turma)
   - ✅ Cada card mostra disciplinas diferentes
   - ✅ Horas restantes são diferentes entre turmas
   - ✅ Pode comparar facilmente as cargas horárias

### **Exemplo do que você deve ver:**

```
┌─────────────────────────────────────┐
│ Turma: PI01                         │
│ 📅 Ano Letivo: 2024/2025           │
├─────────────────────────────────────┤
│ Disciplina              │ Horas     │
├─────────────────────────────────────┤
│ Redes                   │ 25h 🟢   │
│ Sistemas Operativos     │ 15h 🟡   │
│ CloudOps                │ 8h  🔴   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Turma: PI02                         │
│ 📅 Ano Letivo: 2024/2025           │
├─────────────────────────────────────┤
│ Disciplina              │ Horas     │
├─────────────────────────────────────┤
│ Redes                   │ 30h 🟢   │
│ Sistemas Operativos     │ 20h 🟢   │
└─────────────────────────────────────┘
```

---

## 🐛 **Problemas Comuns e Soluções**

### **❌ Problema: "Nenhuma disciplina atribuída a você para esta turma"**

**Possíveis causas:**
1. Dados não estão no Firebase
2. Nome do professor está diferente (acentos, espaços)
3. Turma não tem disciplinas cadastradas

**Solução:**
1. Abra Firebase Console
2. Vá para Firestore Database
3. Navegue até: `disciplinas_turma_ano` → `PI01` (ou outra turma)
4. Verifique se existe o campo `disciplinas` com array de objetos
5. Verifique se o nome do professor está **exatamente igual** ao do login

**Exemplo de documento correto:**
```json
{
  "ano": "2024/2025",
  "disciplinas": [
    {
      "disciplina": "Redes",
      "professor": "João Leite",
      "horas": 25
    }
  ]
}
```

### **❌ Problema: Layout quebrado em mobile**

**Solução:**
1. Limpe o cache: `Ctrl + Shift + Delete`
2. Force refresh: `Ctrl + Shift + R`
3. Feche e abra o navegador novamente

### **❌ Problema: Scroll horizontal não funciona**

**Solução:**
1. Certifique-se de que está deslizando **sobre os cards dos dias**
2. Em desktop, use a roda do mouse sobre a área
3. Tente em um navegador diferente (Chrome, Firefox, Edge)

---

## ✅ **Checklist de Validação**

### **Funcionalidades Básicas:**
- [ ] Login funciona (Admin, Professor, Aluno)
- [ ] Logout funciona
- [ ] Dados carregam do Firebase

### **Professor Dashboard:**
- [ ] Pode selecionar múltiplas turmas
- [ ] Disciplinas aparecem para cada turma
- [ ] Horas restantes são exibidas
- [ ] Cores das horas funcionam (verde/amarelo/vermelho)
- [ ] Botões "Selecionar Todas" e "Limpar Seleção" funcionam
- [ ] Pode marcar disponibilidades
- [ ] Salvar disponibilidades funciona
- [ ] Mensagem de confirmação aparece

### **Responsividade:**
- [ ] Layout funciona em desktop (> 1024px)
- [ ] Layout funciona em tablet (768px - 1024px)
- [ ] Layout funciona em smartphone (< 768px)
- [ ] Scroll horizontal funciona em mobile
- [ ] Botões são clicáveis em telas touch
- [ ] Textos são legíveis em todas as telas
- [ ] Orientação landscape funciona

### **Admin Dashboard:**
- [ ] Status de disponibilidades aparece
- [ ] Pode criar/editar horários
- [ ] Pode publicar/despublicar horários
- [ ] Pode baixar PDF
- [ ] Layout responsivo funciona

### **Aluno Dashboard:**
- [ ] Pode ver horário da turma
- [ ] Horário publicado aparece corretamente
- [ ] Layout responsivo funciona

---

## 📊 **Resultados Esperados**

### **✅ SUCESSO se:**
1. Professor consegue selecionar múltiplas turmas
2. Disciplinas e horas aparecem corretamente
3. Layout funciona em mobile sem quebrar
4. Todas as funcionalidades anteriores continuam funcionando

### **❌ FALHA se:**
1. Disciplinas não aparecem (verificar Firebase)
2. Layout quebra em mobile (verificar cache)
3. Botões não funcionam (verificar console de erros)
4. Dados não salvam (verificar conexão Firebase)

---

## 🚀 **Próximos Passos Após Teste**

### **Se tudo funcionar:**
1. ✅ Marcar como concluído
2. ✅ Fazer backup do código
3. ✅ Preparar para deploy em produção
4. ✅ Treinar usuários nas novas funcionalidades

### **Se houver problemas:**
1. 🐛 Anotar todos os erros encontrados
2. 🐛 Tirar screenshots dos problemas
3. 🐛 Verificar console do navegador (F12)
4. 🐛 Reportar para correção

---

## 📞 **Suporte**

### **Como reportar problemas:**
1. Tire um **screenshot** do erro
2. Copie a mensagem do **console** (F12 → Console)
3. Descreva o que estava fazendo quando o erro ocorreu
4. Informe o **dispositivo** e **navegador** usado

### **Informações úteis para debug:**
- Navegador e versão (ex: Chrome 120)
- Sistema operacional (ex: Windows 11, iOS 17)
- Tamanho da tela (ex: 1920x1080, iPhone 12)
- Mensagens de erro do console

---

## 🎉 **Conclusão**

Este guia cobre todos os testes necessários para validar as novas funcionalidades:
- ✅ Seleção múltipla de turmas
- ✅ Visualização de disciplinas e horas
- ✅ Responsividade mobile completa

**Tempo estimado de teste:** 15-20 minutos

**Boa sorte com os testes!** 🚀

---

**Versão:** 1.1.0  
**Data:** 2024  
**Documento:** Guia de Teste Rápido