# 📊 Mapa de Gantt Visual - Portal de Horários EPALC
## Cronograma Simplificado - 3 Meses

---

## 🗓️ **Visão Geral Rápida**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CRONOGRAMA DE 12 SEMANAS (3 MESES)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ MÊS 1: PLANEJAMENTO E BACKEND        │ Semanas 1-4  │ 20 dias │ 33.3%     │
│ MÊS 2: DESENVOLVIMENTO FRONTEND      │ Semanas 5-8  │ 20 dias │ 33.3%     │
│ MÊS 3: TESTES E DEPLOY               │ Semanas 9-12 │ 20 dias │ 33.3%     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 **Calendário de Tarefas por Semana**

### **MÊS 1: FUNDAÇÃO DO PROJETO**

#### **SEMANA 1: Planejamento e Setup Inicial**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Levantamento de requisitos
Terça      │ ▓▓▓▓▓▓▓▓ │ Levantamento de requisitos (cont.)
Quarta     │ ▓▓▓▓▓▓▓▓ │ Definição de arquitetura
Quinta     │ ▓▓▓▓▓▓▓▓ │ Setup React + Tailwind CSS
Sexta      │ ▓▓▓▓▓▓▓▓ │ Configuração inicial Firebase
```
**Entregáveis:** Projeto React configurado, Firebase criado

---

#### **SEMANA 2: Configuração do Firebase**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Configuração Firestore Database
Terça      │ ▓▓▓▓▓▓▓▓ │ Firebase Auth + Regras de segurança
Quarta     │ ▓▓▓▓▓▓▓▓ │ Regras de segurança (cont.)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Estrutura de pastas + Variáveis ambiente
Sexta      │ ▓▓▓▓▓▓▓▓ │ Git + README inicial
```
**Entregáveis:** Firebase operacional, estrutura do projeto definida

---

#### **SEMANA 3: Backend - Serviços Core**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Modelagem de dados Firestore
Terça      │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento firestoreService.js
Quarta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento firestoreService.js (cont.)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento firestoreService.js (final)
Sexta      │ ▓▓▓▓▓▓▓▓ │ Hook useFirestore.js
```
**Entregáveis:** Serviços de Firestore funcionais

---

#### **SEMANA 4: Backend - Autenticação e Constantes**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento userManager.js
Terça      │ ▓▓▓▓▓▓▓▓ │ constants/index.js + Turmas/Horários
Quarta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento helpers.js
Quinta     │ ▓▓▓▓▓▓▓▓ │ Implementação autenticação anônima
Sexta      │ ▓▓▓▓▓▓▓▓ │ Testes unitários dos serviços
```
**Entregáveis:** Backend completo e testado ✅ **MARCO 1**

---

### **MÊS 2: DESENVOLVIMENTO FRONTEND**

#### **SEMANA 5: Login e Componentes Base**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Estrutura do App.js
Terça      │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento LoginScreen.js
Quarta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento LoginScreen.js (cont.)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Estilização do LoginScreen
Sexta      │ ▓▓▓▓▓▓▓▓ │ Lógica de login e autenticação
```
**Entregáveis:** Sistema de login funcional

---

#### **SEMANA 6: Dashboard do Administrador**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Estrutura do AdminDashboard.js
Terça      │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento ScheduleGrid.js
Quarta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento ScheduleGrid.js (cont.)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Criação do TurmaManager.js
Sexta      │ ▓▓▓▓▓▓▓▓ │ Criação do ProfessorManager.js
```
**Entregáveis:** Dashboard Admin funcional

---

#### **SEMANA 7: Dashboards Professor e Aluno**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento ProfessorDashboard.js
Terça      │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento ProfessorDashboard.js (cont.)
Quarta     │ ▓▓▓▓▓▓▓▓ │ Sistema de disponibilidades professor
Quinta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento AlunoDashboard.js
Sexta      │ ▓▓▓▓▓▓▓▓ │ Visualização de horários para alunos
```
**Entregáveis:** Todos os dashboards funcionais ✅ **MARCO 2**

---

#### **SEMANA 8: Gestão de Disciplinas e Cursos**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento CursoManager.js
Terça      │ ▓▓▓▓▓▓▓▓ │ CursoManager.js (cont.) + DisciplinaManager.js
Quarta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento DisciplinaManager.js (cont.)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Criação do HorasRestantesAdmin.js
Sexta      │ ▓▓▓▓▓▓▓▓ │ Integração disciplinas com horários
```
**Entregáveis:** Sistema de gestão de disciplinas completo

---

### **MÊS 3: FINALIZAÇÃO E DEPLOY**

#### **SEMANA 9: Sistema de Cardápios e Exportação**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento MenuAdmin.js
Terça      │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento MenuAdmin.js (cont.)
Quarta     │ ▓▓▓▓▓▓▓▓ │ Sistema de upload imagens (Base64)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Desenvolvimento MenuSemanal.js
Sexta      │ ▓▓▓▓▓▓▓▓ │ Modal de zoom + pdfExport.js
```
**Entregáveis:** Funcionalidades avançadas completas ✅ **MARCO 3**

---

#### **SEMANA 10: Testes de Integração**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Testes de integração (Admin)
Terça      │ ▓▓▓▓▓▓▓▓ │ Testes de integração (Professor)
Quarta     │ ▓▓▓▓▓▓▓▓ │ Testes de integração (Aluno)
Quinta     │ ▓▓▓▓▓▓▓▓ │ Testes de cardápios e PDF
Sexta      │ ▓▓▓▓▓▓▓▓ │ Correção de bugs críticos
```
**Entregáveis:** Sistema testado e bugs corrigidos

---

#### **SEMANA 11: Responsividade e UX**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ Otimização para mobile (smartphones)
Terça      │ ▓▓▓▓▓▓▓▓ │ Otimização mobile (cont.) + tablets
Quarta     │ ▓▓▓▓▓▓▓▓ │ Testes de responsividade
Quinta     │ ▓▓▓▓▓▓▓▓ │ Melhorias de UX e acessibilidade
Sexta      │ ▓▓▓▓▓▓▓▓ │ Otimização de performance
```
**Entregáveis:** Sistema responsivo e otimizado ✅ **MARCO 4**

---

#### **SEMANA 12: Deploy e Documentação Final**
```
Segunda    │ ▓▓▓▓▓▓▓▓ │ FirestoreDataManager + Build produção
Terça      │ ▓▓▓▓▓▓▓▓ │ Configuração Vercel + Deploy
Quarta     │ ▓▓▓▓▓▓▓▓ │ Testes em produção
Quinta     │ ▓▓▓▓▓▓▓▓ │ Documentação técnica completa
Sexta      │ ▓▓▓▓▓▓▓▓ │ Manuais de usuário + Treinamento
```
**Entregáveis:** Sistema em produção e documentado ✅ **MARCO 5 - CONCLUSÃO**

---

## 📊 **Gráfico de Gantt por Componente**

```
COMPONENTE                    │ S1 │ S2 │ S3 │ S4 │ S5 │ S6 │ S7 │ S8 │ S9 │S10│S11│S12│
──────────────────────────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼───┼───┼───┤
Planejamento                  │ ██ │ ██ │    │    │    │    │    │    │    │   │   │   │
Firebase Setup                │ ▓▓ │ ██ │    │    │    │    │    │    │    │   │   │   │
Backend Services              │    │    │ ██ │ ██ │    │    │    │    │    │   │   │   │
App.js + Login                │    │    │    │    │ ██ │    │    │    │    │   │   │   │
AdminDashboard                │    │    │    │    │    │ ██ │    │    │    │   │   │   │
ProfessorDashboard            │    │    │    │    │    │    │ ██ │    │    │   │   │   │
AlunoDashboard                │    │    │    │    │    │    │ ██ │    │    │   │   │   │
ScheduleGrid                  │    │    │    │    │    │ ██ │ ▓▓ │    │    │   │   │   │
Managers (Turma/Prof)         │    │    │    │    │    │ ██ │    │    │    │   │   │   │
CursoManager                  │    │    │    │    │    │    │    │ ██ │    │   │   │   │
DisciplinaManager             │    │    │    │    │    │    │    │ ██ │    │   │   │   │
HorasRestantesAdmin           │    │    │    │    │    │    │    │ ██ │    │   │   │   │
MenuAdmin                     │    │    │    │    │    │    │    │    │ ██ │   │   │   │
MenuSemanal                   │    │    │    │    │    │    │    │    │ ██ │   │   │   │
pdfExport                     │    │    │    │    │    │    │    │    │ ██ │   │   │   │
Testes Integração             │    │    │    │    │    │    │    │    │    │ ██│   │   │
Responsividade                │    │    │    │    │    │    │    │    │    │   │ ██│   │
Deploy + Docs                 │    │    │    │    │    │    │    │    │    │   │   │ ██│
──────────────────────────────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴───┴───┴───┤

Legenda: ██ = Desenvolvimento Principal  │  ▓▓ = Desenvolvimento Parcial
```

---

## 🎯 **Marcos Principais (Milestones)**

```
┌──────────┬─────────────────────────────────────────┬─────────┬──────────┐
│  MARCO   │              DESCRIÇÃO                  │ SEMANA  │  STATUS  │
├──────────┼─────────────────────────────────────────┼─────────┼──────────┤
│    M1    │ Projeto configurado e Firebase OK       │ Fim S2  │    🔵    │
│    M2    │ Backend completo e testado              │ Fim S4  │    🔵    │
│    M3    │ Todos os dashboards funcionais          │ Fim S7  │    🔵    │
│    M4    │ Funcionalidades avançadas OK            │ Fim S9  │    🔵    │
│    M5    │ Sistema testado e responsivo            │ Fim S11 │    🔵    │
│    M6    │ Sistema em produção e documentado       │ Fim S12 │    🔵    │
└──────────┴─────────────────────────────────────────┴─────────┴──────────┘

Legenda: 🔵 = Planejado  │  🟡 = Em Progresso  │  🟢 = Concluído  │  🔴 = Atrasado
```

---

## 📈 **Distribuição de Esforço por Tipo de Tarefa**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISTRIBUIÇÃO DE 480 HORAS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Planejamento        [████░░░░░░] 10%  (48h)                   │
│  Backend             [████████░░] 25%  (120h)                  │
│  Frontend            [████████████] 35%  (168h)                │
│  Testes              [████░░░░░░] 15%  (72h)                   │
│  Deploy/Docs         [███░░░░░░░] 10%  (48h)                   │
│  Reuniões/Overhead   [██░░░░░░░░] 5%   (24h)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 **Alocação de Recursos por Semana**

```
SEMANA │ DEV FRONT │ DEV BACK │   QA   │ TECH LEAD │ PRODUCT │ DEVOPS │
───────┼───────────┼──────────┼────────┼───────────┼─────────┼────────┤
  S1   │    50%    │   100%   │   0%   │    50%    │   50%   │   0%   │
  S2   │    50%    │   100%   │   0%   │    50%    │   25%   │   0%   │
  S3   │    25%    │   100%   │   0%   │    25%    │   0%    │   0%   │
  S4   │    25%    │   100%   │  25%   │    25%    │   0%    │   0%   │
  S5   │   100%    │    25%   │   0%   │    25%    │   25%   │   0%   │
  S6   │   100%    │    25%   │   0%   │    25%    │   0%    │   0%   │
  S7   │   100%    │    25%   │   0%   │    25%    │   0%    │   0%   │
  S8   │   100%    │    50%   │   0%   │    25%    │   25%   │   0%   │
  S9   │   100%    │    50%   │   0%   │    25%    │   0%    │   0%   │
  S10  │    50%    │    25%   │  100%  │    50%    │   0%    │   0%   │
  S11  │   100%    │    25%   │  100%  │    50%    │   0%    │   0%   │
  S12  │    50%    │    50%   │  50%   │    50%    │   50%   │  100%  │
───────┴───────────┴──────────┴────────┴───────────┴─────────┴────────┤
```

---

## 📊 **Progresso Acumulado por Semana**

```
SEMANA │ PROGRESSO │ HORAS ACUM. │ TAREFAS CONCL. │ COMPONENTES │
───────┼───────────┼─────────────┼────────────────┼─────────────┤
  S1   │    8.3%   │     40h     │      6/72      │     0/13    │
  S2   │   16.7%   │     80h     │     12/72      │     0/13    │
  S3   │   25.0%   │    120h     │     18/72      │     2/13    │
  S4   │   33.3%   │    160h     │     24/72      │     4/13    │
  S5   │   41.7%   │    200h     │     30/72      │     5/13    │
  S6   │   50.0%   │    240h     │     36/72      │     7/13    │
  S7   │   58.3%   │    280h     │     42/72      │     9/13    │
  S8   │   66.7%   │    320h     │     48/72      │    10/13    │
  S9   │   75.0%   │    360h     │     54/72      │    12/13    │
  S10  │   83.3%   │    400h     │     60/72      │    13/13    │
  S11  │   91.7%   │    440h     │     66/72      │    13/13    │
  S12  │  100.0%   │    480h     │     72/72      │    13/13    │
───────┴───────────┴─────────────┴────────────────┴─────────────┤
```

---

## ⚡ **Velocidade de Desenvolvimento**

```
┌─────────────────────────────────────────────────────────────────┐
│              VELOCIDADE ESPERADA POR SPRINT (SEMANA)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Semanas 1-2   [████░░░░░░] Lenta (Setup)      - 6 tarefas/sem │
│  Semanas 3-4   [██████░░░░] Média (Backend)    - 6 tarefas/sem │
│  Semanas 5-7   [████████░░] Rápida (Frontend)  - 6 tarefas/sem │
│  Semanas 8-9   [████████░░] Rápida (Features)  - 6 tarefas/sem │
│  Semanas 10-11 [██████░░░░] Média (Testes)     - 6 tarefas/sem │
│  Semana 12     [████░░░░░░] Lenta (Deploy)     - 6 tarefas     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Checklist Rápido de Progresso**

### **Fim do Mês 1 (Semana 4):**
- [ ] Firebase configurado e operacional
- [ ] Firestore com estrutura de dados definida
- [ ] Serviços backend (firestoreService, userManager) completos
- [ ] Autenticação anônima funcionando
- [ ] Constantes (turmas, horários) definidas
- [ ] Testes unitários passando

### **Fim do Mês 2 (Semana 8):**
- [ ] Sistema de login funcional
- [ ] AdminDashboard completo
- [ ] ProfessorDashboard completo
- [ ] AlunoDashboard completo
- [ ] ScheduleGrid funcional
- [ ] Gestão de turmas e professores
- [ ] Sistema de disciplinas e cursos

### **Fim do Mês 3 (Semana 12):**
- [ ] Sistema de cardápios funcionando
- [ ] Exportação de PDF operacional
- [ ] Todos os testes passando
- [ ] Sistema 100% responsivo
- [ ] Deploy em produção realizado
- [ ] Documentação completa
- [ ] Treinamento da equipe concluído

---

## 📞 **Pontos de Sincronização**

```
┌────────────────────────────────────────────────────────────────┐
│                    REUNIÕES E CHECKPOINTS                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔵 Daily Standup        │ Todos os dias │ 15 min             │
│  🟢 Planning Semanal     │ Segundas      │ 1 hora             │
│  🟡 Checkpoint           │ Quartas       │ 30 min             │
│  🟣 Review Semanal       │ Sextas        │ 1 hora             │
│  🔴 Review Mensal        │ Fim do mês    │ 2 horas            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚨 **Alertas e Riscos por Fase**

```
FASE 1 (S1-S2)  │ ⚠️  Atraso na configuração do Firebase
FASE 2 (S3-S4)  │ ⚠️  Complexidade da modelagem de dados
FASE 3 (S5-S7)  │ ⚠️  Mudanças de requisitos nos dashboards
FASE 4 (S8-S9)  │ ⚠️  Problemas com upload de imagens
FASE 5 (S10-S11)│ ⚠️  Bugs críticos descobertos nos testes
FASE 6 (S12)    │ ⚠️  Problemas no deploy ou configuração
```

---

## ✅ **Critérios de Aceitação por Fase**

### **FASE 1 - Aceito se:**
✅ Firebase acessível e configurado  
✅ Projeto React rodando localmente  
✅ Estrutura de pastas organizada  
✅ Git configurado com commits iniciais  

### **FASE 2 - Aceito se:**
✅ Dados salvos e recuperados do Firestore  
✅ Autenticação funcionando  
✅ Testes unitários passando (>70% cobertura)  
✅ Constantes definidas e documentadas  

### **FASE 3 - Aceito se:**
✅ Login funcional para os 3 tipos de usuário  
✅ Cada dashboard exibe dados corretos  
✅ Navegação entre telas funcionando  
✅ Horários podem ser criados e editados  

### **FASE 4 - Aceito se:**
✅ Cardápios podem ser publicados  
✅ PDF gerado corretamente  
✅ Disciplinas e cursos gerenciados  
✅ Horas restantes calculadas corretamente  

### **FASE 5 - Aceito se:**
✅ Zero bugs críticos  
✅ Sistema responsivo em mobile/tablet/desktop  
✅ Performance adequada (< 3s carregamento)  
✅ UX validada com usuários  

### **FASE 6 - Aceito se:**
✅ Sistema acessível em produção  
✅ Documentação completa e clara  
✅ Equipe treinada e confiante  
✅ Feedback positivo dos stakeholders  

---

## 📊 **Dashboard de Métricas (Atualizar Semanalmente)**

```
┌─────────────────────────────────────────────────────────────────┐
│                      MÉTRICAS DO PROJETO                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Progresso Geral:        [░░░░░░░░░░] 0%                       │
│  Tarefas Concluídas:     0 / 72                                │
│  Componentes Prontos:    0 / 13                                │
│  Bugs Abertos:           0                                     │
│  Bugs Críticos:          0                                     │
│  Cobertura de Testes:    0%                                    │
│  Performance (Lighthouse): N/A                                 │
│  Satisfação da Equipe:   N/A                                   │
│                                                                 │
│  Status: 🔵 PLANEJADO                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**🎯 Objetivo:** Entregar um sistema completo, testado e em produção em 12 semanas  
**📅 Início:** Semana 1  
**🏁 Conclusão:** Semana 12  
**✅ Status Atual:** Planejamento Concluído

---

**Desenvolvido para EPALC - Escola Profissional de Agricultura de Lamego e Coimbra**  
**Versão:** 1.0 | **Data:** Janeiro 2025