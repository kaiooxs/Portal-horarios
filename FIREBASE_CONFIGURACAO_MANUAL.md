# 🔥 GUIA COMPLETO: Configuração Manual do Firebase

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados Necessária](#estrutura-de-dados-necessária)
3. [Passo a Passo: Configuração Manual](#passo-a-passo-configuração-manual)
4. [Verificação e Testes](#verificação-e-testes)
5. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

### O que você vai fazer:
Criar **manualmente** no Firebase Console as coleções e documentos necessários para que:
- ✅ Professores vejam suas disciplinas
- ✅ Horas restantes sejam exibidas corretamente
- ✅ Sistema funcione 100% sem erros

### Tempo estimado: 15-20 minutos

### O que você precisa:
- Acesso ao Firebase Console
- Dados dos professores e turmas (fornecidos neste guia)

---

## 📊 Estrutura de Dados Necessária

O Firebase precisa ter **6 coleções principais**:

```
artifacts/default-app-id/public/data/
├── Professores/              ← Dados dos professores
├── Turmas/                   ← Dados das turmas
├── disciplinas_turma_ano/    ← Disciplinas por turma (CRÍTICO!)
├── availabilities/           ← Disponibilidades dos professores
├── schedules/                ← Horários publicados
└── disciplinas/              ← Lista de disciplinas
```

---

## 🚀 Passo a Passo: Configuração Manual

### **PASSO 1: Acessar o Firebase Console**

1. Abra o navegador
2. Acesse: https://console.firebase.google.com
3. Selecione seu projeto: **portal-horarios-insticoop**
4. No menu lateral, clique em **"Firestore Database"**
5. Você verá a estrutura de coleções

---

### **PASSO 2: Criar Coleção `disciplinas_turma_ano`** ⚠️ **MAIS IMPORTANTE**

Esta é a coleção **CRÍTICA** que falta e causa o problema dos professores não verem disciplinas.

#### 2.1. Criar a Coleção

1. No Firestore, clique em **"Iniciar coleção"** (ou "Start collection")
2. Digite o caminho completo:
   ```
   artifacts/default-app-id/public/data/disciplinas_turma_ano
   ```
3. Clique em **"Próximo"**

#### 2.2. Adicionar Documento para PI01

1. **ID do documento**: `PI01`
2. Clique em **"Adicionar campo"** e preencha:

| Campo | Tipo | Valor |
|-------|------|-------|
| `ano` | string | `2024/2025` |
| `curso` | string | `Programação Informática` |
| `disciplinas` | array | *(veja abaixo)* |

3. Para o campo `disciplinas` (tipo **array**), adicione os seguintes **objetos**:

**Objeto 1:**
```json
{
  "disciplina": "Redes",
  "professor": "João Leite",
  "horas": 150
}
```

**Objeto 2:**
```json
{
  "disciplina": "Algoritmos",
  "professor": "Rui Silva",
  "horas": 150
}
```

**Objeto 3:**
```json
{
  "disciplina": "HTML e CSS",
  "professor": "Telmo Baldaia",
  "horas": 150
}
```

**Objeto 4:**
```json
{
  "disciplina": "Matemática",
  "professor": "Sónia Pinto",
  "horas": 150
}
```

**Objeto 5:**
```json
{
  "disciplina": "Português",
  "professor": "Natália Cardoso",
  "horas": 150
}
```

**Objeto 6:**
```json
{
  "disciplina": "Inglês",
  "professor": "Ana Teixeira",
  "horas": 150
}
```

**Objeto 7:**
```json
{
  "disciplina": "Educação Física",
  "professor": "Ricardo Silveira",
  "horas": 150
}
```

4. Clique em **"Salvar"**

---

#### 2.3. Adicionar Documento para PI02

Repita o processo acima com:
- **ID do documento**: `PI02`
- **Campos**: mesmos de PI01 (ano, curso, disciplinas)
- **Disciplinas**: mesmas de PI01

---

#### 2.4. Adicionar Documento para IG01

1. **ID do documento**: `IG01`
2. Campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `ano` | string | `2024/2025` |
| `curso` | string | `Informática de Gestão` |
| `disciplinas` | array | *(veja abaixo)* |

**Disciplinas para IG01:**

```json
[
  {
    "disciplina": "Arquitetura interna do computador",
    "professor": "João Leite",
    "horas": 150
  },
  {
    "disciplina": "Fundamentos de Python",
    "professor": "Rui Silva",
    "horas": 150
  },
  {
    "disciplina": "JavaScript",
    "professor": "Telmo Baldaia",
    "horas": 150
  },
  {
    "disciplina": "Matemática",
    "professor": "Sónia Pinto",
    "horas": 150
  },
  {
    "disciplina": "Português",
    "professor": "Natália Cardoso",
    "horas": 150
  },
  {
    "disciplina": "Inglês",
    "professor": "Ana Teixeira",
    "horas": 150
  },
  {
    "disciplina": "Educação Física",
    "professor": "Ricardo Silveira",
    "horas": 150
  }
]
```

---

#### 2.5. Adicionar Documento para IG02

- **ID do documento**: `IG02`
- **Campos**: mesmos de IG01

---

#### 2.6. Adicionar Documento para CC03 (Cabeleireira)

1. **ID do documento**: `CC03`
2. Campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `ano` | string | `2024/2025` |
| `curso` | string | `Cabeleireira` |
| `disciplinas` | array | *(veja abaixo)* |

**Disciplinas para CC03:**

```json
[
  {
    "disciplina": "Cortes de Cabelo - Principios",
    "professor": "Ana Costa",
    "horas": 150
  },
  {
    "disciplina": "Tecnicas de Cortes de Cabelo Feminino",
    "professor": "Catia",
    "horas": 150
  },
  {
    "disciplina": "Tecnicas de Cortes de Cabelo Masculino",
    "professor": "Madalena",
    "horas": 150
  },
  {
    "disciplina": "Português",
    "professor": "Rafaela Leite",
    "horas": 150
  },
  {
    "disciplina": "Inglês",
    "professor": "Ana Teixeira",
    "horas": 150
  },
  {
    "disciplina": "Educação Física",
    "professor": "Ricardo Silveira",
    "horas": 150
  },
  {
    "disciplina": "Área de Integração",
    "professor": "Guilherme",
    "horas": 150
  }
]
```

---

#### 2.7. Adicionar Documentos para CC04 e CC05

- **CC04**: mesmos dados de CC03
- **CC05**: mesmos dados de CC03

---

#### 2.8. Adicionar Documento para TE12 (Termalismo)

1. **ID do documento**: `TE12`
2. Campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `ano` | string | `2024/2025` |
| `curso` | string | `Termalismo` |
| `disciplinas` | array | *(veja abaixo)* |

**Disciplinas para TE12:**

```json
[
  {
    "disciplina": "Termalismo e Hidroginástica",
    "professor": "Andreza",
    "horas": 150
  },
  {
    "disciplina": "Matemática",
    "professor": "Sónia Pinto",
    "horas": 150
  },
  {
    "disciplina": "Português",
    "professor": "Rafaela Leite",
    "horas": 150
  },
  {
    "disciplina": "Inglês",
    "professor": "Alexandra Cristina",
    "horas": 150
  },
  {
    "disciplina": "Educação Física",
    "professor": "Ricardo Silveira",
    "horas": 150
  },
  {
    "disciplina": "Física e Química",
    "professor": "Vera Rafaela",
    "horas": 150
  },
  {
    "disciplina": "Área de Integração",
    "professor": "Guilherme",
    "horas": 150
  }
]
```

---

#### 2.9. Adicionar Documentos para TE13 e TE14

- **TE13**: mesmos dados de TE12
- **TE14**: mesmos dados de TE12

---

### **PASSO 3: Verificar Coleção `Professores`**

Esta coleção já deve existir. Verifique se tem os seguintes documentos:

1. No Firestore, navegue até:
   ```
   artifacts/default-app-id/public/data/Professores
   ```

2. Deve ter documentos com IDs como:
   - `joao_leite`
   - `rui_silva`
   - `telmo_baldaia`
   - etc.

3. Cada documento deve ter:
   ```json
   {
     "nome": "João Leite",
     "email": "joao.leite@insticoop.pt",
     "disciplinas": ["Redes", "Arquitetura interna do computador", ...]
   }
   ```

**Se não existir**, você pode criar usando o botão de migração no AdminDashboard.

---

### **PASSO 4: Verificar Coleção `Turmas`**

1. Navegue até:
   ```
   artifacts/default-app-id/public/data/Turmas
   ```

2. Deve ter documentos com IDs:
   - `PI01`, `PI02`
   - `IG01`, `IG02`
   - `CC03`, `CC04`, `CC05`
   - `TE12`, `TE13`, `TE14`

3. Cada documento deve ter:
   ```json
   {
     "nome": "PI01",
     "curso": "Programação Informática",
     "ano": "2024/2025"
   }
   ```

---

### **PASSO 5: Verificar Regras de Segurança**

1. No Firebase Console, clique em **"Regras"** (Rules)
2. Verifique se as regras permitem leitura/escrita:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita em todas as coleções (APENAS PARA DESENVOLVIMENTO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas regras são permissivas. Em produção, você deve restringir o acesso.

3. Clique em **"Publicar"** para salvar as regras

---

## ✅ Verificação e Testes

### Teste 1: Verificar Estrutura no Firebase

1. Acesse o Firestore Console
2. Navegue até `artifacts/default-app-id/public/data/disciplinas_turma_ano`
3. Você deve ver **10 documentos**:
   - PI01, PI02
   - IG01, IG02
   - CC03, CC04, CC05
   - TE12, TE13, TE14

### Teste 2: Testar no App como Professor

1. Faça login como professor (ex: João Leite)
2. Vá para **"Disponibilidades & Horários"**
3. Role até **"📊 Comparar Disciplinas e Horas entre Turmas"**
4. Selecione turmas (ex: PI01, PI02)
5. **Você deve ver**:
   - Lista de disciplinas
   - Horas restantes (150h)
   - Cores (verde = OK, amarelo = atenção, vermelho = urgente)

### Teste 3: Verificar Console do Navegador

1. Pressione **F12** para abrir DevTools
2. Vá para a aba **"Console"**
3. Procure por:
   ```
   [ProfessorDashboard] Disciplinas carregadas: {...}
   [ProfessorDashboard] Total de turmas com dados: 10
   ```
4. **NÃO deve aparecer**:
   ```
   ⚠️ AVISO: Nenhuma disciplina encontrada no Firebase!
   ```

---

## 🔧 Solução de Problemas

### Problema 1: "Nenhuma disciplina encontrada"

**Causa**: Coleção `disciplinas_turma_ano` não existe ou está vazia

**Solução**:
1. Verifique se criou a coleção com o caminho correto:
   ```
   artifacts/default-app-id/public/data/disciplinas_turma_ano
   ```
2. Verifique se os documentos têm os IDs corretos (PI01, PI02, etc.)
3. Verifique se cada documento tem os campos: `ano`, `curso`, `disciplinas`

---

### Problema 2: "Professor não vê suas disciplinas"

**Causa**: Nome do professor no Firebase não corresponde ao nome no login

**Solução**:
1. Verifique o nome exato do professor no Firebase
2. Compare com o nome usado no login
3. Certifique-se de que são **exatamente iguais** (incluindo acentos e maiúsculas)

**Exemplo**:
- ✅ Correto: `João Leite` (Firebase) = `João Leite` (Login)
- ❌ Errado: `Joao Leite` (Firebase) ≠ `João Leite` (Login)

---

### Problema 3: "Horas não aparecem"

**Causa**: Campo `horas` não está definido ou é string em vez de número

**Solução**:
1. Abra o documento da turma no Firebase
2. Verifique o array `disciplinas`
3. Cada objeto deve ter:
   ```json
   {
     "disciplina": "Redes",
     "professor": "João Leite",
     "horas": 150  ← DEVE SER NÚMERO, NÃO STRING
   }
   ```
4. Se estiver como string (`"150"`), edite para número (`150`)

---

### Problema 4: "Permission denied"

**Causa**: Regras de segurança do Firebase bloqueando acesso

**Solução**:
1. Vá para **Firestore → Regras**
2. Adicione regras permissivas (veja PASSO 5)
3. Clique em **"Publicar"**
4. Aguarde 1-2 minutos para propagar

---

### Problema 5: "Dados não atualizam em tempo real"

**Causa**: Listener do Firestore não está funcionando

**Solução**:
1. Recarregue a página (Ctrl + F5)
2. Limpe o cache do navegador
3. Verifique se há erros no Console (F12)
4. Verifique se o Firebase está online (https://status.firebase.google.com)

---

## 📝 Checklist Final

Antes de testar o app, confirme:

- [ ] Coleção `disciplinas_turma_ano` criada
- [ ] 10 documentos criados (PI01, PI02, IG01, IG02, CC03, CC04, CC05, TE12, TE13, TE14)
- [ ] Cada documento tem campos: `ano`, `curso`, `disciplinas`
- [ ] Campo `disciplinas` é um **array de objetos**
- [ ] Cada objeto tem: `disciplina`, `professor`, `horas`
- [ ] Campo `horas` é **número** (não string)
- [ ] Nomes dos professores são **exatamente iguais** aos do login
- [ ] Regras de segurança permitem leitura/escrita
- [ ] App recarregado (Ctrl + F5)

---

## 🎯 Resultado Esperado

Após seguir todos os passos:

✅ **Professor vê disciplinas**
✅ **Horas restantes aparecem**
✅ **Cores indicam urgência**
✅ **Dados atualizam em tempo real**
✅ **Sistema 100% funcional**

---

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:

1. **Verifique o Console do navegador** (F12 → Console)
2. **Tire screenshots** do Firebase e do erro
3. **Anote a mensagem de erro exata**
4. **Verifique se seguiu TODOS os passos**

---

## 🔗 Links Úteis

- **Firebase Console**: https://console.firebase.google.com
- **Firestore Database**: https://console.firebase.google.com/project/_/firestore
- **Status do Firebase**: https://status.firebase.google.com

---

**Criado em**: 2024
**Versão**: 1.0
**Autor**: Sistema de Gestão de Horários - INSTICOOP