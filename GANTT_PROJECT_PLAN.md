# 📊 Mapa de Gantt - Portal de Horários EPALC
## Plano de Desenvolvimento Completo - 3 Meses (12 Semanas)

---

## 📅 **Visão Geral do Projeto**

**Duração Total:** 12 semanas (3 meses)  
**Data de Início:** Semana 1  
**Data de Conclusão:** Semana 12  
**Equipe Estimada:** 2-3 desenvolvedores  

---

## 🎯 **Fases do Projeto**

### **FASE 1: Planejamento e Configuração Inicial** (Semanas 1-2)
### **FASE 2: Desenvolvimento do Backend e Infraestrutura** (Semanas 3-4)
### **FASE 3: Desenvolvimento dos Dashboards** (Semanas 5-7)
### **FASE 4: Funcionalidades Avançadas** (Semanas 8-9)
### **FASE 5: Testes e Refinamentos** (Semanas 10-11)
### **FASE 6: Deploy e Documentação Final** (Semana 12)

---

## 📋 **Detalhamento das Tarefas**

---

## **FASE 1: PLANEJAMENTO E CONFIGURAÇÃO INICIAL** 
### **Semanas 1-2 | 10 dias úteis**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 1.1 | Levantamento de requisitos completo | 2 dias | S1-D1 | S1-D2 | Product Owner | - |
| 1.2 | Definição da arquitetura do sistema | 1 dia | S1-D3 | S1-D3 | Tech Lead | 1.1 |
| 1.3 | Criação do projeto React | 0.5 dia | S1-D4 | S1-D4 | Dev Frontend | 1.2 |
| 1.4 | Configuração do Tailwind CSS | 0.5 dia | S1-D4 | S1-D4 | Dev Frontend | 1.3 |
| 1.5 | Configuração do Firebase (projeto) | 1 dia | S1-D5 | S1-D5 | Dev Backend | 1.2 |
| 1.6 | Configuração do Firestore Database | 1 dia | S2-D1 | S2-D1 | Dev Backend | 1.5 |
| 1.7 | Configuração do Firebase Auth | 0.5 dia | S2-D2 | S2-D2 | Dev Backend | 1.6 |
| 1.8 | Definição das regras de segurança | 1 dia | S2-D2 | S2-D3 | Dev Backend | 1.6 |
| 1.9 | Estruturação de pastas do projeto | 0.5 dia | S2-D3 | S2-D3 | Dev Frontend | 1.3 |
| 1.10 | Configuração de variáveis de ambiente | 0.5 dia | S2-D4 | S2-D4 | Dev Backend | 1.5 |
| 1.11 | Setup do Git e controle de versão | 0.5 dia | S2-D4 | S2-D4 | Tech Lead | 1.3 |
| 1.12 | Criação do README inicial | 1 dia | S2-D5 | S2-D5 | Tech Lead | 1.1 |

**Total Fase 1:** 10 dias

---

## **FASE 2: DESENVOLVIMENTO DO BACKEND E INFRAESTRUTURA**
### **Semanas 3-4 | 10 dias úteis**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 2.1 | Modelagem de dados do Firestore | 1 dia | S3-D1 | S3-D1 | Dev Backend | 1.8 |
| 2.2 | Criação do `firebaseConfig.js` | 0.5 dia | S3-D2 | S3-D2 | Dev Backend | 1.10 |
| 2.3 | Desenvolvimento do `firestoreService.js` | 2 dias | S3-D2 | S3-D4 | Dev Backend | 2.1 |
| 2.4 | Criação do hook `useFirestore.js` | 1 dia | S3-D5 | S3-D5 | Dev Backend | 2.3 |
| 2.5 | Desenvolvimento do `userManager.js` | 1 dia | S4-D1 | S4-D1 | Dev Backend | 2.3 |
| 2.6 | Criação do arquivo `constants/index.js` | 1 dia | S4-D2 | S4-D2 | Dev Backend | 2.1 |
| 2.7 | Definição de turmas e horários | 0.5 dia | S4-D2 | S4-D2 | Product Owner | 2.6 |
| 2.8 | Desenvolvimento do `helpers.js` | 1 dia | S4-D3 | S4-D3 | Dev Backend | - |
| 2.9 | Implementação de autenticação anônima | 1 dia | S4-D4 | S4-D4 | Dev Backend | 2.2 |
| 2.10 | Testes unitários dos serviços | 1 dia | S4-D5 | S4-D5 | Dev Backend | 2.3, 2.4 |

**Total Fase 2:** 10 dias

---

## **FASE 3: DESENVOLVIMENTO DOS DASHBOARDS**
### **Semanas 5-7 | 15 dias úteis**

### **Semana 5: Componentes Base e Login**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 3.1 | Desenvolvimento do `App.js` (estrutura) | 1 dia | S5-D1 | S5-D1 | Dev Frontend | 2.9 |
| 3.2 | Criação do `LoginScreen.js` | 2 dias | S5-D2 | S5-D3 | Dev Frontend | 3.1 |
| 3.3 | Estilização do LoginScreen | 1 dia | S5-D4 | S5-D4 | Dev Frontend | 3.2 |
| 3.4 | Implementação da lógica de login | 1 dia | S5-D5 | S5-D5 | Dev Frontend | 2.5, 3.2 |

### **Semana 6: Dashboard do Administrador**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 3.5 | Estrutura do `AdminDashboard.js` | 1 dia | S6-D1 | S6-D1 | Dev Frontend | 3.1 |
| 3.6 | Desenvolvimento do `ScheduleGrid.js` | 2 dias | S6-D2 | S6-D3 | Dev Frontend | 3.5 |
| 3.7 | Criação do `TurmaManager.js` | 1 dia | S6-D4 | S6-D4 | Dev Frontend | 2.6 |
| 3.8 | Criação do `ProfessorManager.js` | 1 dia | S6-D5 | S6-D5 | Dev Frontend | 2.6 |

### **Semana 7: Dashboards de Professor e Aluno**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 3.9 | Desenvolvimento do `ProfessorDashboard.js` | 2 dias | S7-D1 | S7-D2 | Dev Frontend | 3.5 |
| 3.10 | Sistema de disponibilidades do professor | 1 dia | S7-D3 | S7-D3 | Dev Frontend | 3.9 |
| 3.11 | Desenvolvimento do `AlunoDashboard.js` | 1 dia | S7-D4 | S7-D4 | Dev Frontend | 3.6 |
| 3.12 | Visualização de horários para alunos | 1 dia | S7-D5 | S7-D5 | Dev Frontend | 3.11 |

**Total Fase 3:** 15 dias

---

## **FASE 4: FUNCIONALIDADES AVANÇADAS**
### **Semanas 8-9 | 10 dias úteis**

### **Semana 8: Gestão de Disciplinas e Cursos**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 4.1 | Desenvolvimento do `CursoManager.js` | 1.5 dias | S8-D1 | S8-D2 | Dev Frontend | 2.6 |
| 4.2 | Desenvolvimento do `DisciplinaManager.js` | 1.5 dias | S8-D2 | S8-D3 | Dev Frontend | 4.1 |
| 4.3 | Criação do `HorasRestantesAdmin.js` | 1 dia | S8-D4 | S8-D4 | Dev Frontend | 4.2 |
| 4.4 | Integração de disciplinas com horários | 1 dia | S8-D5 | S8-D5 | Dev Frontend | 4.2, 3.6 |

### **Semana 9: Sistema de Cardápios e Exportação**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 4.5 | Desenvolvimento do `MenuAdmin.js` | 2 dias | S9-D1 | S9-D2 | Dev Frontend | 2.3 |
| 4.6 | Sistema de upload de imagens (Base64) | 1 dia | S9-D3 | S9-D3 | Dev Frontend | 4.5 |
| 4.7 | Desenvolvimento do `MenuSemanal.js` | 1 dia | S9-D4 | S9-D4 | Dev Frontend | 4.5 |
| 4.8 | Modal de zoom para imagens | 0.5 dia | S9-D5 | S9-D5 | Dev Frontend | 4.7 |
| 4.9 | Desenvolvimento do `pdfExport.js` | 1.5 dias | S9-D5 | S9-D5 | Dev Frontend | 3.6 |

**Total Fase 4:** 10 dias

---

## **FASE 5: TESTES E REFINAMENTOS**
### **Semanas 10-11 | 10 dias úteis**

### **Semana 10: Testes e Correções**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 5.1 | Testes de integração (Admin) | 1 dia | S10-D1 | S10-D1 | QA | 3.5-3.8 |
| 5.2 | Testes de integração (Professor) | 1 dia | S10-D2 | S10-D2 | QA | 3.9-3.10 |
| 5.3 | Testes de integração (Aluno) | 1 dia | S10-D3 | S10-D3 | QA | 3.11-3.12 |
| 5.4 | Testes de cardápios e PDF | 1 dia | S10-D4 | S10-D4 | QA | 4.5-4.9 |
| 5.5 | Correção de bugs críticos | 1 dia | S10-D5 | S10-D5 | Dev Team | 5.1-5.4 |

### **Semana 11: Responsividade e UX**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 5.6 | Otimização para mobile (smartphones) | 1.5 dias | S11-D1 | S11-D2 | Dev Frontend | 5.5 |
| 5.7 | Otimização para tablets | 1 dia | S11-D2 | S11-D3 | Dev Frontend | 5.6 |
| 5.8 | Testes de responsividade | 1 dia | S11-D3 | S11-D4 | QA | 5.6-5.7 |
| 5.9 | Melhorias de UX e acessibilidade | 1 dia | S11-D4 | S11-D5 | Dev Frontend | 5.8 |
| 5.10 | Otimização de performance | 0.5 dia | S11-D5 | S11-D5 | Dev Backend | 5.9 |

**Total Fase 5:** 10 dias

---

## **FASE 6: DEPLOY E DOCUMENTAÇÃO FINAL**
### **Semana 12 | 5 dias úteis**

| ID | Tarefa | Duração | Início | Fim | Responsável | Dependências |
|----|--------|---------|--------|-----|-------------|--------------|
| 6.1 | Criação do `FirestoreDataManager.js` | 1 dia | S12-D1 | S12-D1 | Dev Backend | 2.3 |
| 6.2 | Build de produção e otimização | 0.5 dia | S12-D1 | S12-D1 | Dev Backend | 5.10 |
| 6.3 | Configuração do Vercel | 0.5 dia | S12-D2 | S12-D2 | DevOps | 6.2 |
| 6.4 | Deploy em produção | 0.5 dia | S12-D2 | S12-D2 | DevOps | 6.3 |
| 6.5 | Testes em produção | 1 dia | S12-D3 | S12-D3 | QA | 6.4 |
| 6.6 | Documentação técnica completa | 1 dia | S12-D4 | S12-D4 | Tech Lead | 6.5 |
| 6.7 | Manual do usuário (Admin) | 0.5 dia | S12-D4 | S12-D4 | Product Owner | 6.5 |
| 6.8 | Manual do usuário (Professor/Aluno) | 0.5 dia | S12-D5 | S12-D5 | Product Owner | 6.7 |
| 6.9 | Treinamento da equipe EPALC | 0.5 dia | S12-D5 | S12-D5 | Tech Lead | 6.8 |

**Total Fase 6:** 5 dias

---

## 📊 **Resumo por Fase**

| Fase | Descrição | Duração | Semanas | % do Projeto |
|------|-----------|---------|---------|--------------|
| **Fase 1** | Planejamento e Configuração | 10 dias | 1-2 | 16.7% |
| **Fase 2** | Backend e Infraestrutura | 10 dias | 3-4 | 16.7% |
| **Fase 3** | Desenvolvimento dos Dashboards | 15 dias | 5-7 | 25.0% |
| **Fase 4** | Funcionalidades Avançadas | 10 dias | 8-9 | 16.7% |
| **Fase 5** | Testes e Refinamentos | 10 dias | 10-11 | 16.7% |
| **Fase 6** | Deploy e Documentação | 5 dias | 12 | 8.3% |
| **TOTAL** | | **60 dias** | **12 semanas** | **100%** |

---

## 📈 **Gráfico de Gantt Visual**

```
SEMANA 1  [████████████] Planejamento e Setup
SEMANA 2  [████████████] Configuração Firebase
SEMANA 3  [████████████] Backend - Serviços
SEMANA 4  [████████████] Backend - Autenticação
SEMANA 5  [████████████] Login e Componentes Base
SEMANA 6  [████████████] Dashboard Admin
SEMANA 7  [████████████] Dashboards Professor/Aluno
SEMANA 8  [████████████] Gestão de Disciplinas
SEMANA 9  [████████████] Cardápios e PDF
SEMANA 10 [████████████] Testes de Integração
SEMANA 11 [████████████] Responsividade e UX
SEMANA 12 [████████████] Deploy e Documentação
```

---

## 🎯 **Marcos (Milestones)**

| Marco | Descrição | Semana | Data |
|-------|-----------|--------|------|
| **M1** | ✅ Projeto configurado e Firebase operacional | Semana 2 | Fim S2 |
| **M2** | ✅ Backend completo e testado | Semana 4 | Fim S4 |
| **M3** | ✅ Todos os dashboards funcionais | Semana 7 | Fim S7 |
| **M4** | ✅ Funcionalidades avançadas implementadas | Semana 9 | Fim S9 |
| **M5** | ✅ Sistema testado e responsivo | Semana 11 | Fim S11 |
| **M6** | ✅ Sistema em produção e documentado | Semana 12 | Fim S12 |

---

## 👥 **Alocação de Recursos**

### **Equipe Recomendada:**

| Papel | Quantidade | Dedicação | Responsabilidades |
|-------|------------|-----------|-------------------|
| **Tech Lead** | 1 | 50% | Arquitetura, revisão de código, decisões técnicas |
| **Dev Frontend** | 1-2 | 100% | React, componentes, UI/UX |
| **Dev Backend** | 1 | 100% | Firebase, Firestore, serviços |
| **QA/Tester** | 1 | 50% | Testes, validação, bugs |
| **Product Owner** | 1 | 25% | Requisitos, validação, documentação |
| **DevOps** | 1 | 25% | Deploy, configuração, monitoramento |

---

## ⚠️ **Riscos e Mitigações**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Atraso na configuração do Firebase | Média | Alto | Começar cedo, ter backup de desenvolvedores |
| Mudanças de requisitos | Alta | Médio | Validações frequentes com stakeholders |
| Problemas de performance | Baixa | Alto | Testes de carga desde o início |
| Bugs em produção | Média | Alto | Fase de testes robusta (2 semanas) |
| Falta de recursos | Baixa | Alto | Buffer de 10% no cronograma |

---

## 📋 **Checklist de Entrega**

### **Funcionalidades Obrigatórias:**
- ✅ Sistema de login (Admin, Professor, Aluno)
- ✅ Dashboard do Administrador completo
- ✅ Dashboard do Professor completo
- ✅ Dashboard do Aluno completo
- ✅ Gestão de horários (criar, editar, publicar)
- ✅ Sistema de disponibilidades de professores
- ✅ Gestão de cardápios semanais
- ✅ Exportação de PDF
- ✅ Responsividade total (mobile, tablet, desktop)
- ✅ Integração com Firebase/Firestore
- ✅ Autenticação segura

### **Documentação Obrigatória:**
- ✅ README.md completo
- ✅ CHANGELOG.md
- ✅ Manual do Administrador
- ✅ Manual do Professor
- ✅ Manual do Aluno
- ✅ Documentação técnica (API, estrutura de dados)
- ✅ Guia de deploy

### **Testes Obrigatórios:**
- ✅ Testes unitários dos serviços
- ✅ Testes de integração de todos os dashboards
- ✅ Testes de responsividade
- ✅ Testes de performance
- ✅ Testes de segurança
- ✅ Testes em produção

---

## 🚀 **Cronograma Detalhado por Semana**

### **SEMANA 1: Planejamento**
- **Dias 1-2:** Levantamento de requisitos
- **Dia 3:** Definição de arquitetura
- **Dia 4:** Setup do projeto React + Tailwind
- **Dia 5:** Configuração inicial do Firebase

### **SEMANA 2: Configuração**
- **Dia 1:** Configuração do Firestore
- **Dia 2-3:** Firebase Auth + Regras de segurança
- **Dia 4:** Estruturação de pastas + Variáveis de ambiente
- **Dia 5:** Git + README inicial

### **SEMANA 3: Backend - Parte 1**
- **Dia 1:** Modelagem de dados
- **Dia 2-4:** Desenvolvimento do firestoreService.js
- **Dia 5:** Hook useFirestore.js

### **SEMANA 4: Backend - Parte 2**
- **Dia 1:** userManager.js
- **Dia 2:** constants/index.js + definição de turmas
- **Dia 3:** helpers.js
- **Dia 4:** Autenticação anônima
- **Dia 5:** Testes unitários

### **SEMANA 5: Login e Base**
- **Dia 1:** Estrutura do App.js
- **Dias 2-3:** LoginScreen.js
- **Dia 4:** Estilização do login
- **Dia 5:** Lógica de login

### **SEMANA 6: Dashboard Admin**
- **Dia 1:** Estrutura do AdminDashboard
- **Dias 2-3:** ScheduleGrid.js
- **Dia 4:** TurmaManager.js
- **Dia 5:** ProfessorManager.js

### **SEMANA 7: Dashboards Professor/Aluno**
- **Dias 1-2:** ProfessorDashboard.js
- **Dia 3:** Sistema de disponibilidades
- **Dia 4:** AlunoDashboard.js
- **Dia 5:** Visualização de horários

### **SEMANA 8: Disciplinas e Cursos**
- **Dias 1-2:** CursoManager.js
- **Dias 2-3:** DisciplinaManager.js
- **Dia 4:** HorasRestantesAdmin.js
- **Dia 5:** Integração com horários

### **SEMANA 9: Cardápios e PDF**
- **Dias 1-2:** MenuAdmin.js
- **Dia 3:** Upload de imagens Base64
- **Dia 4:** MenuSemanal.js
- **Dia 5:** Modal de zoom + pdfExport.js

### **SEMANA 10: Testes**
- **Dia 1:** Testes Admin
- **Dia 2:** Testes Professor
- **Dia 3:** Testes Aluno
- **Dia 4:** Testes Cardápios/PDF
- **Dia 5:** Correção de bugs

### **SEMANA 11: Responsividade**
- **Dias 1-2:** Otimização mobile
- **Dias 2-3:** Otimização tablet
- **Dia 3-4:** Testes de responsividade
- **Dia 4-5:** UX e performance

### **SEMANA 12: Deploy**
- **Dia 1:** FirestoreDataManager + Build
- **Dia 2:** Configuração Vercel + Deploy
- **Dia 3:** Testes em produção
- **Dia 4:** Documentação completa
- **Dia 5:** Manuais + Treinamento

---

## 💰 **Estimativa de Esforço**

### **Por Fase:**
- **Fase 1:** 80 horas (10 dias × 8h)
- **Fase 2:** 80 horas (10 dias × 8h)
- **Fase 3:** 120 horas (15 dias × 8h)
- **Fase 4:** 80 horas (10 dias × 8h)
- **Fase 5:** 80 horas (10 dias × 8h)
- **Fase 6:** 40 horas (5 dias × 8h)

**TOTAL:** 480 horas (60 dias úteis)

### **Por Papel:**
- **Dev Frontend:** ~240 horas
- **Dev Backend:** ~160 horas
- **QA:** ~40 horas
- **Tech Lead:** ~24 horas
- **Product Owner:** ~12 horas
- **DevOps:** ~4 horas

---

## 📞 **Comunicação e Reuniões**

### **Reuniões Semanais:**
- **Segunda-feira:** Planning da semana (1h)
- **Quarta-feira:** Checkpoint de progresso (30min)
- **Sexta-feira:** Review e retrospectiva (1h)

### **Reuniões Mensais:**
- **Fim de cada mês:** Apresentação para stakeholders (2h)

### **Daily Standups:**
- **Todos os dias:** 15 minutos (status, bloqueios, próximos passos)

---

## ✅ **Critérios de Sucesso**

1. ✅ Todas as funcionalidades implementadas e testadas
2. ✅ Sistema responsivo em todos os dispositivos
3. ✅ Performance adequada (carregamento < 3s)
4. ✅ Zero bugs críticos em produção
5. ✅ Documentação completa e atualizada
6. ✅ Equipe EPALC treinada e satisfeita
7. ✅ Deploy em produção bem-sucedido
8. ✅ Feedback positivo dos usuários finais

---

## 📊 **KPIs do Projeto**

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Prazo** | 12 semanas | Cumprimento do cronograma |
| **Qualidade** | < 5 bugs/semana | Tracking de bugs |
| **Performance** | < 3s carregamento | Google Lighthouse |
| **Cobertura de Testes** | > 70% | Jest coverage |
| **Satisfação** | > 4.5/5 | Pesquisa com usuários |
| **Disponibilidade** | > 99% | Uptime monitoring |

---

## 🎓 **Lições Aprendidas (Pós-Projeto)**

_A ser preenchido após a conclusão do projeto_

---

**Desenvolvido para EPALC - Escola Profissional de Agricultura de Lamego e Coimbra**  
**Versão do Plano:** 1.0  
**Data de Criação:** Janeiro 2025  
**Última Atualização:** Janeiro 2025