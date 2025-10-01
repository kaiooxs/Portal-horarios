# 🍽️ Estrutura de Dados do Cardápio no Firebase

## 📍 Localização no Firebase

```
artifacts/default-app-id/public/data/menus/current
```

## 📊 Estrutura JSON

```json
{
  "semanas": [
    {
      "dataInicio": "23 de Setembro",
      "dataFim": "27 de Setembro, 2025",
      "dias": {
        "Segunda": {
          "data": "23/09",
          "sopa": "Abóbora e ervilha",
          "pratoPrincipal": "Prato do tempo ou arroz alegre. Salada de tomate e cebola mista. Esparguete ou arroz alegre. Salada de tomate e cebola mista",
          "vegetariano": "Vegetariano",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "219",
            "lipidos": "43",
            "saturados": "3",
            "acucar": "0",
            "sal": "2"
          }
        },
        "Terça": {
          "data": "24/09",
          "sopa": "Cenoura e feijão verde",
          "pratoPrincipal": "Massa de aves. Batata de beringela e cenoura",
          "vegetariano": "Massa de aves. Batata de beringela e cenoura",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "160",
            "lipidos": "31",
            "saturados": "2",
            "acucar": "0",
            "sal": "2"
          }
        },
        "Quarta": {
          "data": "25/09",
          "sopa": "Canja",
          "pratoPrincipal": "Arroz de peixe. Salada de alface e milho",
          "vegetariano": "Arroz de peixe. Salada de alface e milho",
          "sobremesa": "Fruta da época / Mousse",
          "nutricao": {
            "energia": "640",
            "lipidos": "153",
            "saturados": "5",
            "acucar": "1",
            "sal": "1"
          }
        },
        "Quinta": {
          "data": "26/09",
          "sopa": "Repolho",
          "pratoPrincipal": "Massa de aves. Salada de alface e tomate e massa. Salada da casa com alface",
          "vegetariano": "Massa de aves. Salada de alface e tomate e massa. Salada da casa com alface",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "356",
            "lipidos": "49",
            "saturados": "1",
            "acucar": "0",
            "sal": "2"
          }
        },
        "Sexta": {
          "data": "27/09",
          "sopa": "Couve flor",
          "pratoPrincipal": "Arroz de peixe. Cebolada e arroz de couve. Salada de pepino e beterraba",
          "vegetariano": "Lasanha de legumes. Salada de pepino e beterraba",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "242",
            "lipidos": "58",
            "saturados": "1",
            "acucar": "0",
            "sal": "2"
          }
        }
      }
    },
    {
      "dataInicio": "30 de Setembro",
      "dataFim": "4 de Outubro, 2025",
      "dias": {
        "Segunda": {
          "data": "30/09",
          "sopa": "Legumes variados",
          "pratoPrincipal": "Frango assado com batatas",
          "vegetariano": "Tofu grelhado com legumes",
          "sobremesa": "Gelatina",
          "nutricao": {
            "energia": "450",
            "lipidos": "20",
            "saturados": "4",
            "acucar": "5",
            "sal": "1.5"
          }
        },
        "Terça": {
          "data": "01/10",
          "sopa": "Creme de abóbora",
          "pratoPrincipal": "Bacalhau com natas",
          "vegetariano": "Grão de bico estufado",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "520",
            "lipidos": "25",
            "saturados": "6",
            "acucar": "3",
            "sal": "2"
          }
        },
        "Quarta": {
          "data": "02/10",
          "sopa": "Sopa de feijão",
          "pratoPrincipal": "Carne de porco à alentejana",
          "vegetariano": "Salada de quinoa",
          "sobremesa": "Pudim",
          "nutricao": {
            "energia": "580",
            "lipidos": "30",
            "saturados": "7",
            "acucar": "8",
            "sal": "2.2"
          }
        },
        "Quinta": {
          "data": "03/10",
          "sopa": "Caldo verde",
          "pratoPrincipal": "Peixe grelhado com arroz",
          "vegetariano": "Beringela recheada",
          "sobremesa": "Fruta da época",
          "nutricao": {
            "energia": "380",
            "lipidos": "15",
            "saturados": "3",
            "acucar": "2",
            "sal": "1.8"
          }
        },
        "Sexta": {
          "data": "04/10",
          "sopa": "Sopa de legumes",
          "pratoPrincipal": "Massa à bolonhesa",
          "vegetariano": "Massa com molho de tomate",
          "sobremesa": "Salada de frutas",
          "nutricao": {
            "energia": "490",
            "lipidos": "22",
            "saturados": "5",
            "acucar": "6",
            "sal": "1.9"
          }
        }
      }
    }
  ]
}
```

## 🔧 Como Adicionar no Firebase

### Opção 1: Via Console Firebase (Recomendado)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Firestore Database**
4. Navegue até: `artifacts/default-app-id/public/data/menus`
5. Crie um documento com ID: `current`
6. Cole a estrutura JSON acima

### Opção 2: Via Interface Admin do Portal

1. Faça login como **Admin** (senha: `admin123`)
2. Clique na aba **🍽️ Gerir Cardápio**
3. Clique em **➕ Adicionar Semana**
4. Preencha os campos:
   - Data de Início
   - Data de Fim
   - Para cada dia da semana:
     - Sopa
     - Prato Principal
     - Vegetariano
     - Sobremesa
     - Informações Nutricionais (opcional)
5. Clique em **💾 Salvar Cardápio**

## 📝 Campos Obrigatórios

### Semana
- ✅ `dataInicio` - Data de início da semana (ex: "23 de Setembro")
- ✅ `dataFim` - Data de fim da semana (ex: "27 de Setembro, 2025")
- ✅ `dias` - Objeto com os dias da semana

### Dia
- ✅ `sopa` - Descrição da sopa
- ✅ `pratoPrincipal` - Descrição do prato principal
- ✅ `vegetariano` - Opção vegetariana
- ✅ `sobremesa` - Descrição da sobremesa
- ⚠️ `data` - Data específica (opcional, ex: "23/09")
- ⚠️ `nutricao` - Informações nutricionais (opcional)

### Nutrição (Opcional)
- `energia` - Energia em kcal
- `lipidos` - Lípidos em gramas
- `saturados` - Gorduras saturadas em gramas
- `acucar` - Açúcar em gramas
- `sal` - Sal em gramas

## 🎯 Funcionalidades

### Para Alunos e Professores
- ✅ Visualização do cardápio da semana atual
- ✅ Destaque do dia atual
- ✅ Informações nutricionais expandíveis
- ✅ Design responsivo para mobile
- ✅ Atualização automática em tempo real

### Para Administradores
- ✅ Adicionar múltiplas semanas
- ✅ Editar cardápios existentes
- ✅ Remover semanas
- ✅ Salvar no Firebase
- ✅ Interface intuitiva e responsiva

## 🔄 Atualização Automática

O sistema detecta automaticamente a semana atual baseado nas datas:
- Compara a data atual com `dataInicio` e `dataFim`
- Exibe a semana correspondente
- Se não encontrar, exibe a primeira semana disponível

## 📱 Acesso

### Alunos
1. Login → Selecionar turma
2. Clicar em **🍽️ Cardápio**
3. Visualizar cardápio da semana

### Professores
1. Login → Selecionar nome
2. Clicar em **🍽️ Cardápio**
3. Visualizar cardápio da semana

### Administradores
1. Login como Admin
2. Clicar em **🍽️ Gerir Cardápio**
3. Adicionar/Editar cardápios

## 🎨 Características Visuais

- 🥣 Ícone de sopa
- 🍖 Ícone de prato principal
- 🥗 Ícone vegetariano
- 🍰 Ícone de sobremesa
- 🔥 Destaque do dia atual
- ℹ️ Informações nutricionais expandíveis
- 📅 Datas da semana

## 🚀 Próximos Passos

1. ✅ Adicionar dados de exemplo no Firebase
2. ✅ Testar visualização como aluno
3. ✅ Testar visualização como professor
4. ✅ Testar edição como admin
5. ✅ Verificar responsividade mobile
6. ✅ Atualizar semanalmente

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@epalc.pt
- 📱 Telefone: +351 XXX XXX XXX

---

**Fornecido por Scolarest** 🍴