# 📚 Portal de Horários EPALC

Sistema completo de gestão de horários escolares e cardápios semanais para a Escola Profissional de Agricultura de Lamego e Coimbra (EPALC).

---

## 🚀 **Funcionalidades Principais**

### **👨‍💼 Painel do Administrador**
- ✅ Gestão completa de horários de todas as turmas
- ✅ Publicar/despublicar horários
- ✅ Exportar horários em PDF
- ✅ Visualizar disponibilidades dos professores
- ✅ **Gestão de cardápios semanais** (upload de imagens)
- ✅ Histórico de cardápios anteriores

### **👨‍🏫 Painel do Professor**
- ✅ Visualizar disciplinas e horas restantes
- ✅ Marcar disponibilidades de horários
- ✅ Selecionar turmas que leciona
- ✅ Visualizar horários publicados
- ✅ Visualizar cardápio semanal

### **👨‍🎓 Painel do Aluno**
- ✅ Visualizar horário da turma
- ✅ Exportar horário em PDF
- ✅ Visualizar cardápio semanal
- ✅ Ampliar e baixar imagens do cardápio
- ✅ Atualizações em tempo real

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React** - Framework UI
- **Tailwind CSS** - Estilização moderna
- **Framer Motion** - Animações suaves
- **jsPDF + html2canvas** - Geração de PDF

### **Backend**
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Auth** - Autenticação anônima
- **Base64** - Armazenamento de imagens de cardápios

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
3. Copie as credenciais para um arquivo `.env` na raiz do projeto:

```env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

### **4. Configurar Regras do Firestore**
Copie o conteúdo de `firestore.rules` para as regras do seu projeto Firebase.

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
- Digite a turma (ex: PI01, IG01, CC03)
- Sem senha

---

## 📁 **Estrutura do Projeto**

```
portal-horarios/
├── public/
│   ├── imagens/              # Logos e imagens
│   └── index.html
│
├── src/
│   ├── components/           # Componentes React
│   │   ├── AdminDashboard.js
│   │   ├── ProfessorDashboard.js
│   │   ├── AlunoDashboard.js
│   │   ├── LoginScreen.js
│   │   ├── ScheduleGrid.js
│   │   ├── MenuAdmin.js      # Gestão de cardápios
│   │   ├── MenuSemanal.js    # Visualização de cardápios
│   │   └── HorasRestantesAdmin.js
│   │
│   ├── constants/            # Constantes (turmas, horários, etc.)
│   │   └── index.js
│   │
│   ├── hooks/                # Hooks customizados
│   │   └── useFirestore.js
│   │
│   ├── services/             # Serviços (Firestore)
│   │   └── firestoreService.js
│   │
│   ├── utils/                # Utilitários
│   │   ├── helpers.js
│   │   ├── pdfExport.js
│   │   └── userManager.js
│   │
│   ├── App.js                # Componente principal
│   ├── firebaseConfig.js     # Configuração do Firebase
│   ├── index.js              # Entry point
│   └── index.css             # Estilos globais
│
├── .env                      # Variáveis de ambiente (não versionado)
├── .gitignore
├── firestore.rules           # Regras de segurança do Firestore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎯 **Como Usar**

### **Administrador**
1. Faça login como administrador
2. Acesse a aba **"Cardápio"** para gerenciar cardápios
3. Faça upload de uma imagem (máximo 1MB)
4. Defina o período (data início e fim)
5. Clique em **"Publicar Cardápio"**

### **Professor/Aluno**
1. Faça login com suas credenciais
2. Acesse a aba **"Cardápio"**
3. Visualize o cardápio da semana atual
4. Clique na imagem para ampliar
5. Use o botão **"Baixar Imagem"** para salvar

---

## 📊 **Estrutura de Dados no Firestore**

### **Coleção: `menus/current`**
```javascript
{
  semanas: [
    {
      id: "1234567890",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-19",
      imagemBase64: "data:image/jpeg;base64,...",
      publicadoEm: Timestamp,
      publicadoPor: "admin"
    }
  ]
}
```

### **Coleção: `schedules/{turmaId}`**
```javascript
{
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

### **Coleção: `availabilities/{professorId}`**
```javascript
{
  nome: "João Leite",
  turmas: ["PI01", "PI02"],
  disciplinaByTurma: {
    "PI01": "Algoritmos",
    "PI02": "Python"
  },
  slots: [...],
  almocosAgendados: ["2ª Feira"]
}
```

---

## 🔧 **Scripts Disponíveis**

```bash
npm start          # Inicia servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa testes
```

---

## 🚀 **Deploy**

### **Vercel (Recomendado)**
1. Instale o Vercel CLI: `npm i -g vercel`
2. Execute: `vercel --prod`
3. Configure as variáveis de ambiente no painel da Vercel

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

### **Netlify**
1. Execute: `npm run build`
2. Arraste a pasta `build/` para o Netlify

---

## 📱 **Responsividade**

O sistema é 100% responsivo e funciona perfeitamente em:
- 📱 Smartphones (iOS e Android)
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

---

## 🐛 **Resolução de Problemas**

### **Erro ao fazer login**
- Verifique se o Firebase está configurado corretamente
- Confirme que as regras do Firestore estão aplicadas

### **Imagens não aparecem**
- Verifique se a imagem tem menos de 1MB
- Confirme que o formato é JPG, PNG ou JPEG

### **Horários não atualizam**
- Verifique sua conexão com a internet
- Recarregue a página (F5)

---

## 📝 **Changelog**

### **v1.3.0** (Atual)
- ✅ Migração de Firebase Storage para Base64
- ✅ Correção do problema de redirecionamento automático
- ✅ Limpeza completa de arquivos desnecessários
- ✅ Modal de zoom para imagens de cardápio
- ✅ Botão de download funcional para Base64

### **v1.2.0**
- ✅ Sistema de cardápio semanal
- ✅ Upload de imagens
- ✅ Identidade visual institucional

### **v1.1.0**
- ✅ Seleção múltipla de turmas
- ✅ Interface 100% responsiva
- ✅ Indicadores coloridos de horas

### **v1.0.0**
- ✅ Sistema básico de horários
- ✅ Dashboards para admin, professor e aluno
- ✅ Exportação em PDF

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit suas mudanças: `git commit -m 'Adiciona MinhaFeature'`
4. Push para a branch: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença MIT.

---

## 👥 **Desenvolvido para**

**EPALC - Escola Profissional de Agricultura de Lamego e Coimbra**

Em parceria com:
- Pessoas 2030
- Portugal 2030
- União Europeia
- República Portuguesa
- INSTICOOP

---

## 📞 **Suporte**

Para suporte técnico, entre em contato com a equipe de TI da EPALC.

---

**Versão:** 1.3.0  
**Última atualização:** Janeiro 2025
