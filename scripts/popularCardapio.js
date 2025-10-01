/**
 * Script para popular o Firebase com dados de cardápio de exemplo
 * 
 * Como usar:
 * 1. Certifique-se de que o Firebase está configurado
 * 2. Execute: node scripts/popularCardapio.js
 * 3. Os dados serão adicionados ao Firebase
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuração do Firebase (use suas credenciais)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dados de exemplo do cardápio
const cardapioExemplo = {
  semanas: [
    {
      dataInicio: "23 de Setembro",
      dataFim: "27 de Setembro, 2025",
      dias: {
        Segunda: {
          data: "23/09",
          sopa: "Abóbora e ervilha",
          pratoPrincipal: "Prato do tempo ou arroz alegre. Salada de tomate e cebola mista",
          vegetariano: "Esparguete com legumes",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "219",
            lipidos: "43",
            saturados: "3",
            acucar: "0",
            sal: "2"
          }
        },
        Terça: {
          data: "24/09",
          sopa: "Cenoura e feijão verde",
          pratoPrincipal: "Massa de aves. Batata de beringela e cenoura",
          vegetariano: "Salada de grão com legumes",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "160",
            lipidos: "31",
            saturados: "2",
            acucar: "0",
            sal: "2"
          }
        },
        Quarta: {
          data: "25/09",
          sopa: "Canja",
          pratoPrincipal: "Arroz de peixe. Salada de alface e milho",
          vegetariano: "Arroz de legumes",
          sobremesa: "Fruta da época / Mousse",
          nutricao: {
            energia: "640",
            lipidos: "153",
            saturados: "5",
            acucar: "1",
            sal: "1"
          }
        },
        Quinta: {
          data: "26/09",
          sopa: "Repolho",
          pratoPrincipal: "Massa de aves. Salada de alface e tomate",
          vegetariano: "Massa com molho de tomate",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "356",
            lipidos: "49",
            saturados: "1",
            acucar: "0",
            sal: "2"
          }
        },
        Sexta: {
          data: "27/09",
          sopa: "Couve flor",
          pratoPrincipal: "Arroz de peixe. Cebolada e arroz de couve",
          vegetariano: "Lasanha de legumes. Salada de pepino e beterraba",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "242",
            lipidos: "58",
            saturados: "1",
            acucar: "0",
            sal: "2"
          }
        }
      }
    },
    {
      dataInicio: "30 de Setembro",
      dataFim: "4 de Outubro, 2025",
      dias: {
        Segunda: {
          data: "30/09",
          sopa: "Legumes variados",
          pratoPrincipal: "Frango assado com batatas",
          vegetariano: "Tofu grelhado com legumes",
          sobremesa: "Gelatina",
          nutricao: {
            energia: "450",
            lipidos: "20",
            saturados: "4",
            acucar: "5",
            sal: "1.5"
          }
        },
        Terça: {
          data: "01/10",
          sopa: "Creme de abóbora",
          pratoPrincipal: "Bacalhau com natas",
          vegetariano: "Grão de bico estufado",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "520",
            lipidos: "25",
            saturados: "6",
            acucar: "3",
            sal: "2"
          }
        },
        Quarta: {
          data: "02/10",
          sopa: "Sopa de feijão",
          pratoPrincipal: "Carne de porco à alentejana",
          vegetariano: "Salada de quinoa",
          sobremesa: "Pudim",
          nutricao: {
            energia: "580",
            lipidos: "30",
            saturados: "7",
            acucar: "8",
            sal: "2.2"
          }
        },
        Quinta: {
          data: "03/10",
          sopa: "Caldo verde",
          pratoPrincipal: "Peixe grelhado com arroz",
          vegetariano: "Beringela recheada",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "380",
            lipidos: "15",
            saturados: "3",
            acucar: "2",
            sal: "1.8"
          }
        },
        Sexta: {
          data: "04/10",
          sopa: "Sopa de legumes",
          pratoPrincipal: "Massa à bolonhesa",
          vegetariano: "Massa com molho de tomate",
          sobremesa: "Salada de frutas",
          nutricao: {
            energia: "490",
            lipidos: "22",
            saturados: "5",
            acucar: "6",
            sal: "1.9"
          }
        }
      }
    },
    {
      dataInicio: "7 de Outubro",
      dataFim: "11 de Outubro, 2025",
      dias: {
        Segunda: {
          data: "07/10",
          sopa: "Sopa de tomate",
          pratoPrincipal: "Arroz de frango",
          vegetariano: "Risoto de cogumelos",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "420",
            lipidos: "18",
            saturados: "4",
            acucar: "3",
            sal: "1.6"
          }
        },
        Terça: {
          data: "08/10",
          sopa: "Creme de espinafres",
          pratoPrincipal: "Peixe no forno com batatas",
          vegetariano: "Hambúrguer de grão",
          sobremesa: "Iogurte",
          nutricao: {
            energia: "390",
            lipidos: "16",
            saturados: "3",
            acucar: "4",
            sal: "1.7"
          }
        },
        Quarta: {
          data: "09/10",
          sopa: "Sopa de ervilhas",
          pratoPrincipal: "Carne estufada com massa",
          vegetariano: "Feijoada vegetariana",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "510",
            lipidos: "24",
            saturados: "6",
            acucar: "2",
            sal: "2.1"
          }
        },
        Quinta: {
          data: "10/10",
          sopa: "Canja de galinha",
          pratoPrincipal: "Arroz de pato",
          vegetariano: "Arroz de legumes",
          sobremesa: "Mousse de chocolate",
          nutricao: {
            energia: "560",
            lipidos: "28",
            saturados: "7",
            acucar: "9",
            sal: "2.0"
          }
        },
        Sexta: {
          data: "11/10",
          sopa: "Sopa de legumes",
          pratoPrincipal: "Bacalhau à Brás",
          vegetariano: "Omelete de legumes",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "470",
            lipidos: "21",
            saturados: "5",
            acucar: "3",
            sal: "1.9"
          }
        }
      }
    },
    {
      dataInicio: "14 de Outubro",
      dataFim: "18 de Outubro, 2025",
      dias: {
        Segunda: {
          data: "14/10",
          sopa: "Sopa de cenoura",
          pratoPrincipal: "Frango grelhado com arroz",
          vegetariano: "Salada completa",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "410",
            lipidos: "17",
            saturados: "3",
            acucar: "2",
            sal: "1.5"
          }
        },
        Terça: {
          data: "15/10",
          sopa: "Creme de brócolos",
          pratoPrincipal: "Peixe cozido com batatas",
          vegetariano: "Tofu com legumes",
          sobremesa: "Gelatina",
          nutricao: {
            energia: "370",
            lipidos: "14",
            saturados: "2",
            acucar: "4",
            sal: "1.6"
          }
        },
        Quarta: {
          data: "16/10",
          sopa: "Sopa de abóbora",
          pratoPrincipal: "Carne assada com massa",
          vegetariano: "Massa com legumes",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "530",
            lipidos: "26",
            saturados: "6",
            acucar: "3",
            sal: "2.0"
          }
        },
        Quinta: {
          data: "17/10",
          sopa: "Caldo verde",
          pratoPrincipal: "Arroz de marisco",
          vegetariano: "Arroz de legumes",
          sobremesa: "Pudim flan",
          nutricao: {
            energia: "590",
            lipidos: "29",
            saturados: "7",
            acucar: "8",
            sal: "2.2"
          }
        },
        Sexta: {
          data: "18/10",
          sopa: "Sopa de legumes",
          pratoPrincipal: "Peixe frito com arroz",
          vegetariano: "Hambúrguer vegetariano",
          sobremesa: "Fruta da época",
          nutricao: {
            energia: "480",
            lipidos: "23",
            saturados: "5",
            acucar: "2",
            sal: "1.8"
          }
        }
      }
    }
  ]
};

// Função para popular o Firebase
async function popularCardapio() {
  try {
    console.log('🔥 Iniciando população do cardápio no Firebase...');
    
    const docRef = doc(db, 'artifacts/default-app-id/public/data/menus', 'current');
    
    await setDoc(docRef, cardapioExemplo);
    
    console.log('✅ Cardápio adicionado com sucesso!');
    console.log(`📊 Total de semanas: ${cardapioExemplo.semanas.length}`);
    console.log('🍽️ Dados disponíveis para visualização');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular cardápio:', error);
    process.exit(1);
  }
}

// Executar
popularCardapio();