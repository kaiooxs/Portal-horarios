# ⚡ Guia Rápido: Migração de Dados para Firebase

Escolha uma das duas opções abaixo:

---

## 🎯 **OPÇÃO 1: Migração Automática (RECOMENDADO)** ⭐

### Passos:
1. ✅ Abra a aplicação no navegador
2. ✅ Faça login como **Admin** (senha: `admin123`)
3. ✅ Procure o botão azul no canto inferior direito: **"🚀 Migrar Dados para Firebase"**
4. ✅ Clique no botão
5. ✅ Confirme a migração
6. ✅ Aguarde 10-15 segundos
7. ✅ Pronto! Todos os dados foram migrados

### Vantagens:
- ⚡ Rápido (menos de 1 minuto)
- ✅ Sem erros de digitação
- 🔒 Seguro (usa transações do Firebase)
- 📊 Migra TODOS os dados de uma vez

---

## 📝 **OPÇÃO 2: Migração Manual**

Se preferir adicionar os dados manualmente no Firebase Console:

### Passos:
1. ✅ Abra o Firebase Console: https://console.firebase.google.com/
2. ✅ Selecione seu projeto
3. ✅ Vá para **Firestore Database**
4. ✅ Navegue até: `artifacts → default-app-id → public → data`
5. ✅ Siga o guia detalhado em: **`FIREBASE_DATA_COMPLETE.md`**

### O que você precisa criar:

#### **Coleção: professores** (17 documentos)
- João Leite, Rui Silva, Telmo Baldaia, Sónia Pinto, Natália Cardoso, Rafaela Leite, Ana Teixeira, Ricardo Silveira, Vera Rafaela, Guilherme, Ana Costa, Catia, Madalena, Manuela Monteiro, Carmen, Alexandra Cristina, Andreza

#### **Coleção: turmas** (10 documentos)
- PI01, PI02, IG01, IG02, CC03, CC04, CC05, TE12, TE13, TE14

#### **Coleção: disciplinas_turma_ano** (10 documentos)
- Um documento para cada turma com suas disciplinas, professores e horas

### Tempo estimado:
- ⏱️ 30-60 minutos (dependendo da sua velocidade)

---

## 🔍 **Como Verificar se a Migração Funcionou**

Após a migração (automática ou manual):

1. ✅ Abra o Firebase Console
2. ✅ Vá para **Firestore Database**
3. ✅ Navegue até: `artifacts → default-app-id → public → data`
4. ✅ Verifique se existem as coleções:
   - `professores` (17 documentos)
   - `turmas` (10 documentos)
   - `disciplinas_turma_ano` (10 documentos)
   - `schedules` (já existia)
   - `availabilities` (já existia)

---

## 🐛 **Teste na Aplicação**

Após a migração:

1. ✅ Recarregue a aplicação
2. ✅ Faça login como **Professor** (ex: João Leite, senha: `prof123`)
3. ✅ Selecione uma turma (ex: PI01)
4. ✅ Verifique se as disciplinas aparecem corretamente
5. ✅ Se aparecerem, a migração foi bem-sucedida! 🎉

---

## ❓ **Qual Opção Escolher?**

### Use a **OPÇÃO 1 (Automática)** se:
- ✅ Você quer economizar tempo
- ✅ Você quer evitar erros de digitação
- ✅ Você confia no script de migração

### Use a **OPÇÃO 2 (Manual)** se:
- ✅ Você quer controle total do processo
- ✅ Você quer entender a estrutura dos dados
- ✅ Você prefere adicionar os dados aos poucos

---

## 📚 **Arquivos de Referência**

- **`MANUAL_MIGRATION_GUIDE.md`** - Guia passo a passo para migração manual (professores e turmas)
- **`FIREBASE_DATA_COMPLETE.md`** - Dados completos da coleção `disciplinas_turma_ano`
- **`REFACTORING_GUIDE.md`** - Documentação completa da refatoração

---

## 🚀 **Próximos Passos (Após a Migração)**

Depois que os dados estiverem no Firebase, vou:

1. ✅ Refatorar o **ProfessorDashboard** para usar os dados do Firebase
2. ✅ Refatorar o **AdminDashboard** para usar os dados do Firebase
3. ✅ Remover todo o código hardcoded do `App.js`
4. ✅ Remover o botão de migração (não será mais necessário)
5. ✅ Deixar o código limpo, organizado e 100% funcional

---

## 💬 **Precisa de Ajuda?**

Se tiver qualquer dúvida ou problema durante a migração, me avise! Estou aqui para ajudar. 🙂

---

**Boa sorte com a migração!** 🚀