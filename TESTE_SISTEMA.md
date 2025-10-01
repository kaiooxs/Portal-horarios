# 🧪 Guia de Testes - Portal de Horários EPALC v1.2.0

## 📋 Visão Geral

Este documento contém todos os testes necessários para validar as novas funcionalidades implementadas.

---

## ✅ Checklist de Testes

### 1. Página de Login

#### 1.1 Logo EPALC
- [ ] Logo aparece no header
- [ ] Logo está nítido e legível
- [ ] Logo tem tamanho adequado (mobile)
- [ ] Logo tem tamanho adequado (tablet)
- [ ] Logo tem tamanho adequado (desktop)
- [ ] Texto alternativo está correto

#### 1.2 Logos Parcerias
- [ ] Logos aparecem no footer
- [ ] Logos estão nítidos e legíveis
- [ ] Logos têm tamanho adequado (mobile)
- [ ] Logos têm tamanho adequado (tablet)
- [ ] Logos têm tamanho adequado (desktop)
- [ ] Texto alternativo está correto

#### 1.3 Versão
- [ ] Versão exibe "v1.2.0"
- [ ] Texto exibe "EPALC" em vez de "INSTICOOP"

---

### 2. Sistema de Cardápio - Administrador

#### 2.1 Acesso
- [ ] Login como admin funciona (senha: admin123)
- [ ] Aba "🍽️ Gerir Cardápio" está visível
- [ ] Clicar na aba abre a interface correta

#### 2.2 Interface de Gestão
- [ ] Título "🍽️ Gestão de Cardápios" aparece
- [ ] Descrição está clara
- [ ] Formulário de upload está visível
- [ ] Campos de data estão presentes

#### 2.3 Upload de Imagem

**Teste 1: Upload Válido**
- [ ] Preencher "Data de Início" (ex: "23 de Setembro")
- [ ] Preencher "Data de Fim" (ex: "27 de Setembro")
- [ ] Clicar em "Escolher arquivo"
- [ ] Selecionar imagem JPG válida (< 5MB)
- [ ] Preview aparece corretamente
- [ ] Clicar em "Publicar Cardápio"
- [ ] Mensagem de sucesso aparece
- [ ] Cardápio aparece na lista de publicados

**Teste 2: Validação de Arquivo**
- [ ] Tentar upload de arquivo não-imagem (ex: PDF)
- [ ] Sistema deve rejeitar com mensagem de erro
- [ ] Tentar upload de imagem > 5MB
- [ ] Sistema deve rejeitar com mensagem de erro

**Teste 3: Validação de Campos**
- [ ] Tentar publicar sem preencher datas
- [ ] Sistema deve exigir preenchimento
- [ ] Tentar publicar sem selecionar imagem
- [ ] Sistema deve exigir imagem

#### 2.4 Gerenciamento de Cardápios
- [ ] Lista de cardápios publicados aparece
- [ ] Cada cardápio mostra datas corretas
- [ ] Imagem de cada cardápio está visível
- [ ] Botão "🗑️ Remover" está presente
- [ ] Clicar em remover pede confirmação
- [ ] Confirmar remoção exclui o cardápio
- [ ] Mensagem de sucesso aparece após remoção

---

### 3. Sistema de Cardápio - Aluno

#### 3.1 Acesso
- [ ] Login como aluno funciona (turma: PI01)
- [ ] Botão "🍽️ Cardápio" está visível
- [ ] Clicar no botão abre a visualização

#### 3.2 Visualização do Cardápio

**Quando há cardápio publicado:**
- [ ] Título "🍽️ Cardápio da Semana" aparece
- [ ] Datas da semana estão corretas
- [ ] Badge "🍴 Fornecido por Scolarest" aparece
- [ ] Imagem do cardápio está visível
- [ ] Imagem está nítida e legível
- [ ] Botão "🔍 Ver em Tamanho Real" funciona
- [ ] Botão "💾 Baixar Imagem" funciona
- [ ] Seção de informações aparece

**Quando NÃO há cardápio:**
- [ ] Mensagem "Cardápio não disponível" aparece
- [ ] Emoji 🍽️ está visível
- [ ] Texto explicativo está claro

#### 3.3 Histórico de Cardápios
- [ ] Seção "📚 Cardápios Anteriores" aparece (se houver)
- [ ] Cada cardápio anterior está listado
- [ ] Clicar expande o cardápio
- [ ] Imagem do cardápio anterior aparece

#### 3.4 Responsividade

**Mobile (< 768px):**
- [ ] Layout se adapta ao tamanho da tela
- [ ] Imagem é responsiva
- [ ] Botões são touch-friendly
- [ ] Texto é legível

**Tablet (768px - 1024px):**
- [ ] Layout intermediário funciona
- [ ] Imagem tem tamanho adequado
- [ ] Botões são acessíveis

**Desktop (> 1024px):**
- [ ] Layout completo aparece
- [ ] Imagem tem boa qualidade
- [ ] Todos os elementos visíveis

---

### 4. Sistema de Cardápio - Professor

#### 4.1 Acesso
- [ ] Login como professor funciona (senha: prof123)
- [ ] Botão "🍽️ Cardápio" está visível
- [ ] Clicar no botão abre a visualização

#### 4.2 Visualização
- [ ] Mesmos testes da seção 3.2 (Aluno)
- [ ] Mesmos testes da seção 3.3 (Histórico)
- [ ] Mesmos testes da seção 3.4 (Responsividade)

---

### 5. Firebase Storage

#### 5.1 Configuração
- [ ] Firebase Storage está ativado
- [ ] Regras de segurança estão configuradas
- [ ] storageBucket está preenchido em firebaseConfig.js

#### 5.2 Upload
- [ ] Imagem é enviada para Firebase Storage
- [ ] Pasta "cardapios" é criada automaticamente
- [ ] Nome do arquivo segue padrão: cardapio_[timestamp].jpg
- [ ] URL da imagem é gerada corretamente

#### 5.3 Acesso
- [ ] URL da imagem é acessível publicamente
- [ ] Imagem carrega sem erros
- [ ] Imagem pode ser baixada

#### 5.4 Firestore
- [ ] Documento "current" é criado/atualizado
- [ ] Estrutura de dados está correta
- [ ] Campo "imagemUrl" contém URL válida
- [ ] Campo "dataPublicacao" está presente

---

### 6. Integração entre Componentes

#### 6.1 Fluxo Completo

**Passo 1: Admin publica cardápio**
- [ ] Admin faz login
- [ ] Admin acessa "Gerir Cardápio"
- [ ] Admin faz upload de imagem
- [ ] Cardápio é publicado com sucesso

**Passo 2: Aluno visualiza**
- [ ] Admin faz logout
- [ ] Aluno faz login
- [ ] Aluno acessa "Cardápio"
- [ ] Cardápio publicado aparece imediatamente

**Passo 3: Professor visualiza**
- [ ] Aluno faz logout
- [ ] Professor faz login
- [ ] Professor acessa "Cardápio"
- [ ] Cardápio publicado aparece

**Passo 4: Admin remove cardápio**
- [ ] Professor faz logout
- [ ] Admin faz login
- [ ] Admin remove o cardápio
- [ ] Cardápio desaparece da lista

**Passo 5: Verificação**
- [ ] Admin faz logout
- [ ] Aluno faz login
- [ ] Mensagem "Cardápio não disponível" aparece

---

### 7. Performance

#### 7.1 Tempo de Carregamento
- [ ] Página de login carrega em < 2s
- [ ] Logos carregam rapidamente
- [ ] Dashboard carrega em < 3s
- [ ] Cardápio carrega em < 3s
- [ ] Imagem do cardápio carrega em < 5s

#### 7.2 Otimização
- [ ] Imagens estão otimizadas
- [ ] Não há erros no console
- [ ] Não há warnings no console
- [ ] Firebase não reporta erros

---

### 8. Segurança

#### 8.1 Autenticação
- [ ] Apenas admin pode acessar "Gerir Cardápio"
- [ ] Alunos não veem opção de gestão
- [ ] Professores não veem opção de gestão

#### 8.2 Firebase
- [ ] Regras de leitura permitem acesso público
- [ ] Regras de escrita exigem autenticação
- [ ] Não é possível fazer upload sem login

---

### 9. Usabilidade

#### 9.1 Interface Intuitiva
- [ ] Botões têm labels claros
- [ ] Ícones são compreensíveis
- [ ] Mensagens de erro são claras
- [ ] Mensagens de sucesso são claras

#### 9.2 Feedback Visual
- [ ] Loading states aparecem durante carregamento
- [ ] Mensagens de sucesso aparecem após ações
- [ ] Mensagens de erro aparecem quando necessário
- [ ] Animações são suaves

#### 9.3 Acessibilidade
- [ ] Textos alternativos estão presentes
- [ ] Contraste de cores é adequado
- [ ] Botões têm tamanho adequado
- [ ] Navegação por teclado funciona

---

### 10. Documentação

#### 10.1 Arquivos Criados
- [ ] CARDAPIO_UPLOAD_GUIA.md existe
- [ ] FIREBASE_STORAGE_SETUP.md existe
- [ ] ALTERACOES_CARDAPIO_V2.md existe
- [ ] RESUMO_FINAL_ALTERACOES.md existe
- [ ] TESTE_SISTEMA.md existe (este arquivo)

#### 10.2 Conteúdo
- [ ] Documentação está completa
- [ ] Instruções são claras
- [ ] Exemplos estão presentes
- [ ] Links funcionam

---

## 🐛 Registro de Bugs

Use esta seção para registrar bugs encontrados durante os testes:

### Bug #1
- **Descrição:**
- **Passos para reproduzir:**
- **Comportamento esperado:**
- **Comportamento atual:**
- **Prioridade:** Alta / Média / Baixa
- **Status:** Aberto / Em análise / Resolvido

### Bug #2
- **Descrição:**
- **Passos para reproduzir:**
- **Comportamento esperado:**
- **Comportamento atual:**
- **Prioridade:** Alta / Média / Baixa
- **Status:** Aberto / Em análise / Resolvido

---

## 📊 Resultados dos Testes

### Resumo

| Categoria | Total | Passou | Falhou | Pendente |
|-----------|-------|--------|--------|----------|
| Página de Login | 13 | 0 | 0 | 13 |
| Admin - Cardápio | 25 | 0 | 0 | 25 |
| Aluno - Cardápio | 20 | 0 | 0 | 20 |
| Professor - Cardápio | 15 | 0 | 0 | 15 |
| Firebase Storage | 10 | 0 | 0 | 10 |
| Integração | 15 | 0 | 0 | 15 |
| Performance | 9 | 0 | 0 | 9 |
| Segurança | 5 | 0 | 0 | 5 |
| Usabilidade | 12 | 0 | 0 | 12 |
| Documentação | 6 | 0 | 0 | 6 |
| **TOTAL** | **130** | **0** | **0** | **130** |

### Status Geral
- ⏳ **Pendente**: Testes ainda não realizados
- ✅ **Aprovado**: Todos os testes passaram
- ⚠️ **Atenção**: Alguns testes falharam
- ❌ **Reprovado**: Muitos testes falharam

**Status Atual:** ⏳ **PENDENTE**

---

## 🎯 Critérios de Aceitação

Para considerar o sistema pronto para produção:

### Obrigatórios (Bloqueantes)
- [ ] Todos os testes de funcionalidade passam
- [ ] Firebase Storage está configurado
- [ ] Upload de imagem funciona
- [ ] Visualização funciona para todos os perfis
- [ ] Logos aparecem corretamente
- [ ] Sem erros críticos no console

### Recomendados (Não-bloqueantes)
- [ ] Performance está adequada
- [ ] Responsividade funciona em todos os dispositivos
- [ ] Documentação está completa
- [ ] Feedback dos usuários é positivo

---

## 📝 Notas de Teste

### Ambiente de Teste
- **Navegadores:**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- **Dispositivos:**
  - [ ] Desktop (Windows)
  - [ ] Desktop (Mac)
  - [ ] Tablet (iPad)
  - [ ] Tablet (Android)
  - [ ] Smartphone (iOS)
  - [ ] Smartphone (Android)

- **Resoluções:**
  - [ ] 1920x1080 (Full HD)
  - [ ] 1366x768 (HD)
  - [ ] 768x1024 (Tablet)
  - [ ] 375x667 (iPhone)
  - [ ] 360x640 (Android)

### Testadores
- **Nome:** _______________
- **Data:** _______________
- **Perfil:** Admin / Aluno / Professor
- **Dispositivo:** _______________
- **Navegador:** _______________

---

## 🚀 Próximos Passos Após Testes

### Se todos os testes passarem:
1. ✅ Marcar sistema como pronto para produção
2. ✅ Treinar administradores
3. ✅ Comunicar à comunidade escolar
4. ✅ Publicar primeiro cardápio real
5. ✅ Monitorar uso inicial

### Se houver bugs:
1. ❌ Registrar bugs encontrados
2. ❌ Priorizar correções
3. ❌ Corrigir bugs críticos
4. ❌ Re-testar funcionalidades afetadas
5. ❌ Repetir ciclo de testes

---

## 📞 Suporte Durante Testes

### Problemas Técnicos
- 📧 **Email:** suporte.ti@epalc.pt
- 📱 **Telefone:** +351 XXX XXX XXX

### Dúvidas sobre Funcionalidades
- 📖 **Documentação:** CARDAPIO_UPLOAD_GUIA.md
- 📖 **Setup Firebase:** FIREBASE_STORAGE_SETUP.md

---

## ✅ Aprovação Final

### Testado por:
- **Nome:** _______________
- **Cargo:** _______________
- **Data:** _______________
- **Assinatura:** _______________

### Aprovado por:
- **Nome:** _______________
- **Cargo:** _______________
- **Data:** _______________
- **Assinatura:** _______________

---

**Versão do Documento:** 1.0  
**Data:** Janeiro 2025  
**Sistema:** Portal de Horários EPALC v1.2.0  
**Status:** 📋 **PRONTO PARA TESTES**