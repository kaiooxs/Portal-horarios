# 🔥 Guia de Migração Manual para Firebase

Este guia mostra como adicionar os dados manualmente no Firebase Console, sem usar o botão de migração automática.

---

## 📍 **Passo 1: Aceder ao Firebase Console**

1. Abra o navegador e vá para: https://console.firebase.google.com/
2. Selecione o seu projeto
3. No menu lateral esquerdo, clique em **"Firestore Database"**
4. Você verá a estrutura de coleções e documentos

---

## 📍 **Passo 2: Navegar até a Coleção Correta**

Todos os dados devem ser criados dentro desta estrutura:
```
artifacts → default-app-id → public → data
```

1. Clique em **"artifacts"** (se não existir, crie)
2. Clique em **"default-app-id"** (se não existir, crie)
3. Clique em **"public"** (se não existir, crie)
4. Clique em **"data"** (se não existir, crie)

**Nota:** As coleções `schedules` e `availabilities` já devem existir aqui.

---

## 📍 **Passo 3: Criar a Coleção "professores"**

### 3.1. Criar a Coleção
1. Dentro de `data`, clique em **"Start collection"** (ou "Iniciar coleção")
2. Digite o nome: **`professores`**
3. Clique em **"Next"** (ou "Próximo")

### 3.2. Adicionar Documentos

Agora você vai adicionar **17 documentos** (um para cada professor).

#### **Documento 1: João Leite**
- **Document ID:** `joao-leite`
- **Fields:**
  ```
  nome: "João Leite"
  disciplinas: ["CloudOps e Cloud Automation", "Fundamentos de Python"]
  ```

**Como adicionar:**
1. No campo "Document ID", digite: `joao-leite`
2. Clique em **"Add field"**
3. Field name: `nome` | Type: `string` | Value: `João Leite`
4. Clique em **"Add field"** novamente
5. Field name: `disciplinas` | Type: `array` | Clique em "Add item" duas vezes:
   - Item 0: `CloudOps e Cloud Automation`
   - Item 1: `Fundamentos de Python`
6. Clique em **"Save"**

---

#### **Documento 2: Rui Silva**
- **Document ID:** `rui-silva`
- **Fields:**
  ```
  nome: "Rui Silva"
  disciplinas: ["Inglês"]
  ```

---

#### **Documento 3: Telmo Baldaia**
- **Document ID:** `telmo-baldaia`
- **Fields:**
  ```
  nome: "Telmo Baldaia"
  disciplinas: ["Matemática"]
  ```

---

#### **Documento 4: Sónia Pinto**
- **Document ID:** `sonia-pinto`
- **Fields:**
  ```
  nome: "Sónia Pinto"
  disciplinas: ["Português"]
  ```

---

#### **Documento 5: Natália Cardoso**
- **Document ID:** `natalia-cardoso`
- **Fields:**
  ```
  nome: "Natália Cardoso"
  disciplinas: ["Educação Física"]
  ```

---

#### **Documento 6: Rafaela Leite**
- **Document ID:** `rafaela-leite`
- **Fields:**
  ```
  nome: "Rafaela Leite"
  disciplinas: ["Física e Química"]
  ```

---

#### **Documento 7: Ana Teixeira**
- **Document ID:** `ana-teixeira`
- **Fields:**
  ```
  nome: "Ana Teixeira"
  disciplinas: ["Área de Integração"]
  ```

---

#### **Documento 8: Ricardo Silveira**
- **Document ID:** `ricardo-silveira`
- **Fields:**
  ```
  nome: "Ricardo Silveira"
  disciplinas: ["TIC"]
  ```

---

#### **Documento 9: Vera Rafaela**
- **Document ID:** `vera-rafaela`
- **Fields:**
  ```
  nome: "Vera Rafaela"
  disciplinas: ["Estágio Formativo"]
  ```

---

#### **Documento 10: Guilherme**
- **Document ID:** `guilherme`
- **Fields:**
  ```
  nome: "Guilherme"
  disciplinas: ["Prova de Aptidão Profissonal", "Recuperação"]
  ```

---

#### **Documento 11: Ana Costa**
- **Document ID:** `ana-costa`
- **Fields:**
  ```
  nome: "Ana Costa"
  disciplinas: ["Cortes de Cabelo - Principios", "Cortes de Cabelo - Tecnicas"]
  ```

---

#### **Documento 12: Catia**
- **Document ID:** `catia`
- **Fields:**
  ```
  nome: "Catia"
  disciplinas: ["Postiço - Aplicação - Postiço - Aplicação e Manutenção"]
  ```

---

#### **Documento 13: Madalena**
- **Document ID:** `madalena`
- **Fields:**
  ```
  nome: "Madalena"
  disciplinas: ["Tecnicas de Cortes de Cabelo Feminino", "Extensões e Alongamento do Cabelo"]
  ```

---

#### **Documento 14: Manuela Monteiro**
- **Document ID:** `manuela-monteiro`
- **Fields:**
  ```
  nome: "Manuela Monteiro"
  disciplinas: ["Tecnicas de Cortes de Cabelo Masculino"]
  ```

---

#### **Documento 15: Carmen**
- **Document ID:** `carmen`
- **Fields:**
  ```
  nome: "Carmen"
  disciplinas: ["Cuidados Especificos com a Barba e Bigode"]
  ```

---

#### **Documento 16: Alexandra Cristina**
- **Document ID:** `alexandra-cristina`
- **Fields:**
  ```
  nome: "Alexandra Cristina"
  disciplinas: ["Tecnicas de Design - Tecnicas de Design e Corte de Barba e Bigode"]
  ```

---

#### **Documento 17: Andreza**
- **Document ID:** `andreza`
- **Fields:**
  ```
  nome: "Andreza"
  disciplinas: []
  ```
  *(array vazio - sem disciplinas atribuídas)*

---

## 📍 **Passo 4: Criar a Coleção "turmas"**

### 4.1. Criar a Coleção
1. Volte para `data`
2. Clique em **"Start collection"**
3. Digite o nome: **`turmas`**
4. Clique em **"Next"**

### 4.2. Adicionar Documentos

Você vai adicionar **10 documentos** (um para cada turma).

#### **Documento 1: PI01**
- **Document ID:** `PI01`
- **Fields:**
  ```
  nome: "PI01"
  curso: "Programação Informática"
  anoLetivo: "2024/2025"
  ```

#### **Documento 2: PI02**
- **Document ID:** `PI02`
- **Fields:**
  ```
  nome: "PI02"
  curso: "Programação Informática"
  anoLetivo: "2024/2025"
  ```

#### **Documento 3: IG01**
- **Document ID:** `IG01`
- **Fields:**
  ```
  nome: "IG01"
  curso: "Informática de Gestão"
  anoLetivo: "2024/2025"
  ```

#### **Documento 4: IG02**
- **Document ID:** `IG02`
- **Fields:**
  ```
  nome: "IG02"
  curso: "Informática de Gestão"
  anoLetivo: "2024/2025"
  ```

#### **Documento 5: CC03**
- **Document ID:** `CC03`
- **Fields:**
  ```
  nome: "CC03"
  curso: "Cibersegurança"
  anoLetivo: "2024/2025"
  ```

#### **Documento 6: CC04**
- **Document ID:** `CC04`
- **Fields:**
  ```
  nome: "CC04"
  curso: "Cibersegurança"
  anoLetivo: "2024/2025"
  ```

#### **Documento 7: CC05**
- **Document ID:** `CC05`
- **Fields:**
  ```
  nome: "CC05"
  curso: "Cibersegurança"
  anoLetivo: "2024/2025"
  ```

#### **Documento 8: TE12**
- **Document ID:** `TE12`
- **Fields:**
  ```
  nome: "TE12"
  curso: "Técnico de Estética"
  anoLetivo: "2024/2025"
  ```

#### **Documento 9: TE13**
- **Document ID:** `TE13`
- **Fields:**
  ```
  nome: "TE13"
  curso: "Técnico de Estética"
  anoLetivo: "2024/2025"
  ```

#### **Documento 10: TE14**
- **Document ID:** `TE14`
- **Fields:**
  ```
  nome: "TE14"
  curso: "Técnico de Estética"
  anoLetivo: "2024/2025"
  ```

---

## 📍 **Passo 5: Criar a Coleção "disciplinas_turma_ano"**

Esta é a coleção mais importante! Ela substitui o arquivo `Disciplinas_Turma_Ano.js`.

### 5.1. Criar a Coleção
1. Volte para `data`
2. Clique em **"Start collection"**
3. Digite o nome: **`disciplinas_turma_ano`**
4. Clique em **"Next"**

### 5.2. Adicionar Documentos

Vou criar um arquivo JSON separado com todos os dados para você copiar e colar mais facilmente.

---

## 📄 **Arquivo JSON com Todos os Dados**

Vou criar um arquivo `firebase-data.json` que você pode usar para importar os dados de forma mais rápida.

**Nota:** O Firebase Console não permite importação direta de JSON, mas você pode usar este arquivo como referência para copiar e colar os valores.

---

## ✅ **Verificação Final**

Após adicionar todos os dados, verifique se você tem:

- ✅ Coleção `professores` com 17 documentos
- ✅ Coleção `turmas` com 10 documentos
- ✅ Coleção `disciplinas_turma_ano` com os documentos das turmas
- ✅ Coleção `schedules` (já existente)
- ✅ Coleção `availabilities` (já existente)

---

## 🚀 **Próximos Passos**

Depois de adicionar todos os dados manualmente:

1. **Recarregue a aplicação** no navegador
2. **Teste o ProfessorDashboard** - as disciplinas devem aparecer
3. **Me avise** para eu continuar a refatoração do código

---

## 💡 **Dica: Usar o Script de Migração**

Se preferir, ainda pode usar o botão de migração automática que criamos. Ele faz tudo isso automaticamente! Basta:

1. Fazer login como Admin
2. Clicar no botão azul "🚀 Migrar Dados para Firebase"
3. Aguardar a conclusão

---

**Qualquer dúvida durante o processo, me avise!** 🙂