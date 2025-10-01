# 📚 Portal de Horários EPALC - Sistema de Gestão Escolar

Sistema completo para gestão de horários escolares e cardápios semanais com dashboards para administradores, professores e alunos.

**🔥 Versão 1.2.0 - Sistema de Cardápio Semanal + Identidade Visual!**

---

## ✨ **Novidades da Versão 1.2.0**

### **🍽️ NOVO: Sistema de Cardápio Semanal**
- ✅ **Upload simplificado** de imagens do cardápio
- ✅ Visualização para alunos e professores
- ✅ Gestão facilitada para administradores
- ✅ Histórico de cardápios anteriores
- ✅ Download e visualização em tamanho real
- ✅ Integração com Firebase Storage

### **🎨 NOVO: Identidade Visual Institucional**
- ✅ **Logo oficial da EPALC** na página de login
- ✅ **Logos das parcerias** no footer (Pessoas 2030, Portugal 2030, UE, República Portuguesa, INSTICOOP)
- ✅ Visual profissional e institucional
- ✅ Imagens otimizadas e nítidas

### **⚡ Melhorias de Versões Anteriores**
- ✅ Seleção múltipla de turmas (v1.1.0)
- ✅ 100% Responsivo para mobile (v1.1.0)
- ✅ Interface visual melhorada (v1.1.0)
- ✅ Indicadores coloridos de horas (v1.1.0)

---

## 🚀 **Funcionalidades**

### **👨‍💼 Dashboard do Administrador**
- ✅ Visualizar status de disponibilidades de todos os professores
- ✅ Criar e editar horários de todas as turmas
- ✅ Publicar/despublicar horários
- ✅ Exportar horários em PDF
- ✅ Limpar horários de turmas
- ✅ Alocar professores automaticamente baseado em disponibilidades
- 🔥 **NOVO v1.2.0:** Gestão de cardápios semanais (upload de imagens)
- ✅ Interface responsiva para mobile

### **👨‍🏫 Dashboard do Professor**
- ✅ Visualizar disciplinas e horas restantes por turma
- ✅ Selecionar múltiplas turmas para comparação
- ✅ Indicadores coloridos de horas (verde/amarelo/vermelho)
- ✅ Marcar disponibilidades de horários
- ✅ Scroll horizontal em mobile
- ✅ Selecionar turmas que leciona
- ✅ Definir disciplinas por turma
- ✅ Visualizar horários de aula publicados
- ✅ Marcar almoços agendados
- 🔥 **NOVO v1.2.0:** Visualizar cardápio semanal

### **👨‍🎓 Dashboard do Aluno**
- ✅ Visualizar horário da turma
- ✅ Exportar horário em PDF
- ✅ Atualizações em tempo real
- ✅ Interface responsiva para mobile
- 🔥 **NOVO v1.2.0:** Visualizar cardápio semanal

---

## 🏗️ **Arquitetura**

### **Frontend**
- **React** - Framework UI
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **jsPDF + html2canvas** - Geração de PDF

### **Backend**
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Storage** - Armazenamento de imagens (cardápios)
- **Firebase Auth** - Autenticação anônima

### **Estrutura de Pastas**
```
src/
├── components/          # Componentes React
│   ├── AdminDashboard.js
│   ├── ProfessorDashboard.js
│   ├── AlunoDashboard.js
│   ├── LoginScreen.js
│   ├── ScheduleGrid.js
│   ├── MenuAdmin.js         # 🆕 Gestão de cardápios
│   ├── MenuSemanal.js       # 🆕 Visualização de cardápios
│   └── MigrationButton.js
│
├── constants/           # Constantes da aplicação
│   └── index.js
│
├── hooks/               # Hooks customizados
│   └── useFirestore.js
│
├── services/            # Serviços (Firestore)
│   └── firestoreService.js
│
├── utils/               # Utilitários
│   ├── helpers.js
│   └── pdfExport.js
│
├── scripts/             # Scripts de migração
│   └── migrateDataToFirebase.js
│
├── App.js               # Componente principal
├── firebaseConfig.js    # Configuração do Firebase (+ Storage)
└── index.js             # Entry point

public/
└── imagens/             # 🆕 Recursos visuais
    ├── logo-epalc.png       # Logo da escola
    └── logo-parcerias.png   # Logos das parcerias
```

---

## 📦 **Instalação**

### **1. Clonar o Repositório**
```bash
git clone [url-do-repositorio]
cd portal-horarios
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Configurar Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Firestore Database**
3. Ative o **Firebase Storage** (para cardápios)
4. Copie as credenciais para `src/firebaseConfig.js`
5. Configure as regras de segurança do Storage (veja `FIREBASE_STORAGE_SETUP.md`)

### **4. Adicionar Dados Iniciais**
Siga o guia em `FIREBASE_DATA_COMPLETE.md` para adicionar os dados iniciais no Firestore.

### **5. Iniciar Aplicação**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## 🔐 **Credenciais de Acesso**

### **Administrador**
- Senha: `admin123`

### **Professor**
- Selecione o nome do professor
- Senha: `prof123`

### **Aluno**
- Digite a turma (ex: PI01, IG01, CC03, etc.)
- Sem senha

---

## 📊 **Estrutura de Dados no Firebase**

### **Coleções:**

#### **1. professores/**
Armazena informações dos professores e suas disciplinas.
```javascript
{
  id: "joao-leite",
  nome: "João Leite",
  disciplinas: ["CloudOps", "Python"]
}
```

#### **2. turmas/**
Armazena informações das turmas.
```javascript
{
  id: "PI01",
  nome: "PI01",
  curso: "Programação Informática",
  anoLetivo: "2024/2025"
}
```

#### **3. disciplinas_turma_ano/**
Mapeia disciplinas, professores e horas por turma.
```javascript
{
  id: "PI01",
  turma: "PI01",
  ano: "10º Ano",
  disciplinas: [
    {
      disciplina: "Algoritmos",
      professor: "João Leite",
      horas: 150
    }
  ]
}
```

#### **4. schedules/**
Armazena os horários das turmas.
```javascript
{
  id: "PI01",
  entries: [
    {
      id: "123",
      turma: "PI01",
      dia: "2ª Feira",
      hora: "08:45 - 10:15",
      professor: "João Leite",
      disciplina: "Algoritmos"
    }
  ],
  published: true
}
```

#### **5. availabilities/**
Armazena as disponibilidades dos professores.
```javascript
{
  id: "joao_leite",
  nome: "João Leite",
  turmas: ["PI01", "PI02"],
  disciplinaByTurma: {
    "PI01": "Algoritmos",
    "PI02": "Python"
  },
  slots: [...],
  almocosAgendados: ["2ª Feira"],
  lastUpdated: Timestamp
}
```

---

## 🛠️ **Scripts Disponíveis**

### **Desenvolvimento**
```bash
npm start          # Inicia servidor de desenvolvimento
npm test           # Executa testes
npm run build      # Cria build de produção
```

### **Migração de Dados**
```bash
# Usar o botão de migração no dashboard do admin
# Ou executar o script manualmente
```

---

## 📖 **Documentação**

### **Documentação Geral**
- **`README.md`** - Este arquivo (visão geral)
- **`ARCHITECTURE.md`** - Arquitetura do sistema
- **`TROUBLESHOOTING.md`** - Guia de resolução de problemas

### **Sistema de Cardápios (v1.2.0)** 🆕
- **`CARDAPIO_UPLOAD_GUIA.md`** - Guia completo de uso do sistema de cardápios
- **`FIREBASE_STORAGE_SETUP.md`** - Configuração do Firebase Storage
- **`ALTERACOES_CARDAPIO_V2.md`** - Comparação entre versões
- **`RESUMO_FINAL_ALTERACOES.md`** - Resumo executivo das alterações
- **`TESTE_SISTEMA.md`** - Checklist de testes
- **`APRESENTACAO_DIRECAO.md`** - Apresentação para gestão

### **Migração e Dados**
- **`FIREBASE_DATA_COMPLETE.md`** - Dados para Firebase
- **`MANUAL_MIGRATION_GUIDE.md`** - Guia de migração manual
- **`QUICK_START_MIGRATION.md`** - Guia rápido de migração
- **`CLEANUP_INSTRUCTIONS.md`** - Instruções de limpeza

### **Refatoração (Histórico)**
- **`REFACTORING_GUIDE.md`** - Guia completo da refatoração
- **`REFACTORING_COMPLETE.md`** - Resumo da refatoração

---

## 🧪 **Testes**

### **Executar Testes**
```bash
npm test
```

### **Cobertura de Testes**
```bash
npm test -- --coverage
```

---

## 🚀 **Deploy**

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

### **Netlify**
```bash
npm run build
# Arraste a pasta build/ para Netlify
```

### **Vercel**
```bash
npm run build
vercel --prod
```

---

## 🔧 **Configuração**

### **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 📈 **Roadmap**

### **Versão 2.0**
- [ ] Autenticação com Firebase Auth (email/senha)
- [ ] Perfis de usuário personalizados
- [ ] Notificações por email
- [ ] Histórico de horários
- [ ] Relatórios e estatísticas

### **Versão 3.0**
- [ ] App mobile (React Native)
- [ ] Integração com Google Calendar
- [ ] Sistema de mensagens
- [ ] Gestão de salas e equipamentos
- [ ] API REST

---

## 🐛 **Problemas Conhecidos**

Consulte `TROUBLESHOOTING.md` para soluções de problemas comuns.

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 **Autores**

- **Desenvolvedor Principal** - [Seu Nome]

---

## 🙏 **Agradecimentos**

- Firebase pela infraestrutura
- React pela framework
- Tailwind CSS pela estilização
- Framer Motion pelas animações

---

## 📞 **Suporte**

Para suporte, envie um email para [seu-email] ou abra uma issue no GitHub.

---

## 📊 **Status do Projeto**

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🔗 **Links Úteis**

- [Firebase Console](https://console.firebase.google.com/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Desenvolvido com ❤️ em Portugal 🇵🇹**

**Última atualização:** ${new Date().toLocaleDateString("pt-PT")}
