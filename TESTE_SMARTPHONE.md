# 📱 Como Testar no Smartphone

## 🎯 **Objetivo**
Testar o Portal de Horários em um smartphone real para validar a responsividade e usabilidade mobile.

---

## 🔧 **Pré-requisitos**

### **1. Computador e Smartphone na Mesma Rede**
- ✅ Ambos conectados ao mesmo Wi-Fi
- ✅ Firewall do Windows permitindo conexões locais

### **2. Aplicação Rodando**
```powershell
npm start
```
- ✅ Deve estar rodando em `http://localhost:3000`

---

## 📋 **Passo a Passo**

### **PASSO 1: Encontrar o IP do Computador**

#### **Windows:**
```powershell
ipconfig
```

Procure por:
```
Adaptador de Rede sem Fio Wi-Fi:
   Endereço IPv4. . . . . . . . : 192.168.1.100
```

Anote o IP (ex: `192.168.1.100`)

#### **Mac/Linux:**
```bash
ifconfig
```

Procure por `inet` (ex: `192.168.1.100`)

---

### **PASSO 2: Configurar Firewall (Windows)**

#### **Opção A: Permitir Temporariamente**
1. Abra o PowerShell como Administrador
2. Execute:
```powershell
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

#### **Opção B: Desabilitar Temporariamente (Não Recomendado)**
1. Painel de Controle → Sistema e Segurança → Firewall do Windows
2. Desativar firewall (apenas para teste)
3. **IMPORTANTE:** Reativar após o teste!

---

### **PASSO 3: Acessar no Smartphone**

1. Abra o navegador no smartphone (Chrome, Safari, etc.)
2. Digite na barra de endereço:
   ```
   http://SEU_IP:3000
   ```
   Exemplo: `http://192.168.1.100:3000`

3. Pressione Enter

4. ✅ A tela de login deve aparecer!

---

## 🧪 **Testes a Realizar**

### **1. Tela de Login** (2 minutos)

#### **Verificar:**
- [ ] Ícone grande de livro (📚) aparece
- [ ] Data completa em português
- [ ] Campos são grandes e fáceis de tocar
- [ ] Teclado virtual aparece ao tocar nos campos
- [ ] Botão "🚀 Entrar" é grande e clicável

#### **Testar:**
1. Toque no select "Tipo de Acesso"
2. Selecione "👨‍🏫 Professores"
3. Toque no select "Seu Nome"
4. Selecione "João Leite"
5. Toque no campo "Senha"
6. Digite: `prof123`
7. Toque no botão "🚀 Entrar"

---

### **2. Dashboard do Professor** (5 minutos)

#### **A. Header**
- [ ] Título "📚 Portal de Horários" visível
- [ ] Subtítulo "👨‍🏫 Professor" abaixo
- [ ] Botão "🚪 Sair" ocupa toda largura
- [ ] Botão é fácil de tocar

#### **B. Seleção de Turmas**
- [ ] Seção "📊 Comparar Disciplinas" aparece
- [ ] Botões de turmas em grid (2-3 colunas)
- [ ] Botões são grandes (fáceis de tocar)
- [ ] Toque em 2-3 turmas
- [ ] Botões selecionados ficam azuis
- [ ] Botões "✅ Selecionar Todas" e "❌ Limpar" funcionam

#### **C. Disciplinas e Horas**
- [ ] Cards de turmas aparecem empilhados
- [ ] Cada card tem:
  - [ ] Nome da turma
  - [ ] Ano letivo
  - [ ] Tabela de disciplinas
  - [ ] Horas com cores (🟢🟡🔴)
- [ ] Tabelas têm scroll horizontal (se necessário)
- [ ] Textos são legíveis

#### **D. Disponibilidades (Scroll Horizontal)**
- [ ] Seção "📅 Marque os horários" aparece
- [ ] Mensagem "👈 Deslize para ver todos os dias 👉"
- [ ] Cards dos dias com 280px de largura
- [ ] Deslize com o dedo para ver todos os dias
- [ ] Scroll é suave
- [ ] Cards "param" em cada dia (snap)
- [ ] Checkboxes são grandes (fáceis de tocar)
- [ ] Toque em alguns horários
- [ ] Checkboxes marcam/desmarcam
- [ ] Botão "✅ Marcar Todos" funciona em cada dia

#### **E. Salvar Disponibilidades**
- [ ] Role até o final
- [ ] Botão "Salvar Disponibilidades" é grande
- [ ] Toque no botão
- [ ] Mensagem de sucesso aparece
- [ ] Mensagem desaparece após 3 segundos

---

### **3. Orientação Landscape** (2 minutos)

#### **Testar:**
1. Gire o smartphone para horizontal
2. Verifique:
   - [ ] Layout se adapta automaticamente
   - [ ] Mais conteúdo visível
   - [ ] Botões continuam clicáveis
   - [ ] Scroll funciona normalmente

---

### **4. Diferentes Tamanhos de Tela** (5 minutos)

#### **Se tiver acesso a múltiplos dispositivos:**

**Smartphone Pequeno (< 375px):**
- [ ] iPhone SE, Galaxy S10
- [ ] Layout funciona sem quebrar
- [ ] Textos legíveis

**Smartphone Médio (375px - 414px):**
- [ ] iPhone 12, Galaxy S21
- [ ] Layout otimizado
- [ ] Boa experiência

**Smartphone Grande (> 414px):**
- [ ] iPhone 14 Pro Max, Galaxy S23 Ultra
- [ ] Aproveita espaço extra
- [ ] Mais conteúdo visível

**Tablet (768px - 1024px):**
- [ ] iPad, Galaxy Tab
- [ ] Layout intermediário
- [ ] Grid com mais colunas

---

## 🎯 **Cenários de Uso Real**

### **Cenário 1: Professor Marcando Disponibilidades**
1. Login como professor
2. Selecione suas turmas
3. Verifique disciplinas e horas
4. Marque disponibilidades da semana
5. Salve
6. Verifique mensagem de sucesso

**Tempo esperado:** 3-5 minutos

### **Cenário 2: Professor Comparando Turmas**
1. Login como professor
2. Selecione 3-4 turmas
3. Compare horas restantes entre turmas
4. Identifique disciplinas com poucas horas
5. Planeje aulas

**Tempo esperado:** 2-3 minutos

### **Cenário 3: Aluno Consultando Horário**
1. Login como aluno (turma: PI01)
2. Visualize horário da semana
3. Verifique aulas de hoje
4. Logout

**Tempo esperado:** 1-2 minutos

---

## 📊 **Checklist de Validação**

### **Usabilidade:**
- [ ] Todos os botões são clicáveis
- [ ] Textos são legíveis (sem zoom)
- [ ] Campos de input são fáceis de preencher
- [ ] Scroll funciona suavemente
- [ ] Não há elementos cortados
- [ ] Não há sobreposição de elementos

### **Performance:**
- [ ] Carregamento rápido (< 5s)
- [ ] Transições suaves
- [ ] Sem lag ao rolar
- [ ] Animações fluidas

### **Funcionalidades:**
- [ ] Login funciona
- [ ] Seleção de turmas funciona
- [ ] Disciplinas aparecem
- [ ] Disponibilidades salvam
- [ ] Logout funciona

### **Visual:**
- [ ] Cores corretas
- [ ] Ícones aparecem
- [ ] Badges coloridos funcionam
- [ ] Gradientes aparecem
- [ ] Sombras sutis

---

## 🐛 **Problemas Comuns**

### **❌ "Não consigo acessar pelo IP"**

**Soluções:**
1. Verifique se ambos estão na mesma rede Wi-Fi
2. Verifique o firewall do Windows
3. Tente desabilitar VPN (se estiver usando)
4. Reinicie o roteador
5. Tente outro navegador no smartphone

### **❌ "Layout está quebrado"**

**Soluções:**
1. Force refresh: Feche e abra o navegador
2. Limpe cache do navegador
3. Tente em modo anônimo/privado
4. Verifique se o Tailwind CSS está carregando

### **❌ "Scroll horizontal não funciona"**

**Soluções:**
1. Certifique-se de deslizar sobre os cards
2. Tente com um dedo (não dois)
3. Deslize horizontalmente (não verticalmente)
4. Tente em outro navegador

### **❌ "Botões muito pequenos"**

**Soluções:**
1. Verifique se está usando a versão atualizada
2. Force refresh (Ctrl+Shift+R no desktop)
3. Verifique o zoom do navegador (deve ser 100%)

---

## 📸 **Documentação de Testes**

### **Tire Screenshots de:**
1. Tela de login
2. Dashboard com turmas selecionadas
3. Disciplinas e horas
4. Disponibilidades (scroll horizontal)
5. Mensagem de sucesso ao salvar
6. Orientação landscape

### **Grave Vídeos de:**
1. Scroll horizontal funcionando
2. Seleção de múltiplas turmas
3. Marcação de disponibilidades
4. Transição entre telas

---

## ✅ **Critérios de Sucesso**

### **✅ APROVADO se:**
- [ ] Todos os elementos são clicáveis
- [ ] Textos são legíveis sem zoom
- [ ] Scroll funciona suavemente
- [ ] Todas as funcionalidades funcionam
- [ ] Layout não quebra em nenhuma orientação
- [ ] Performance é aceitável (< 5s carregamento)

### **❌ REPROVADO se:**
- [ ] Elementos cortados ou sobrepostos
- [ ] Botões muito pequenos (< 44px)
- [ ] Textos ilegíveis
- [ ] Funcionalidades não funcionam
- [ ] Layout quebra em alguma orientação
- [ ] Performance ruim (> 10s carregamento)

---

## 🚀 **Após os Testes**

### **Se APROVADO:**
1. ✅ Documentar resultados
2. ✅ Tirar screenshots
3. ✅ Preparar para produção
4. ✅ Treinar usuários

### **Se REPROVADO:**
1. 🐛 Listar todos os problemas
2. 🐛 Tirar screenshots dos erros
3. 🐛 Copiar mensagens de erro
4. 🐛 Reportar para correção

---

## 📞 **Suporte**

### **Informações para Reportar Problemas:**
```
Dispositivo: [iPhone 12 / Galaxy S21 / etc]
Sistema: [iOS 17 / Android 13 / etc]
Navegador: [Safari / Chrome / etc]
Tamanho da tela: [375x812 / etc]
Problema: [Descrição detalhada]
Screenshot: [Anexar]
```

---

## 🎉 **Conclusão**

Este guia cobre todos os testes necessários para validar a responsividade mobile do Portal de Horários.

**Tempo total estimado:** 15-20 minutos

**Boa sorte com os testes!** 📱🚀

---

## 📋 **Checklist Final**

### **Antes de Começar:**
- [ ] Computador e smartphone na mesma rede
- [ ] Aplicação rodando (`npm start`)
- [ ] IP do computador anotado
- [ ] Firewall configurado

### **Durante os Testes:**
- [ ] Testar tela de login
- [ ] Testar dashboard do professor
- [ ] Testar seleção de turmas
- [ ] Testar disciplinas e horas
- [ ] Testar disponibilidades
- [ ] Testar orientação landscape
- [ ] Tirar screenshots

### **Após os Testes:**
- [ ] Documentar resultados
- [ ] Reportar problemas (se houver)
- [ ] Validar critérios de sucesso
- [ ] Preparar para produção

---

**Versão:** 1.1.0  
**Data:** 2024  
**Documento:** Guia de Teste em Smartphone