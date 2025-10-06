# Portal de Horários — Resumo do Repositório

## Visão Geral
- **Stack principal**: React + Tailwind CSS, Firebase (Firestore, Storage, Auth).
- **Dashboards**: Administrador, Professor, Aluno, além de gestão de cardápios semanais.
- **Objetivo**: Gerir horários escolares, disponibilidades de professores e cardápios em tempo real.

## Estrutura Importante
- `src/components/` — Componentes React (AdminDashboard, ProfessorDashboard, AlunoDashboard, MenuAdmin, MenuSemanal, etc.).
- `src/constants/index.js` — Constantes usadas em toda a app (dias da semana, slots, turmas, professores exemplo).
- `src/firebaseConfig.js` — Inicialização do Firebase.
- `src/services/firestoreService.js` — Funções auxiliares para Firestore.
- `src/utils/` — Utilitários (helpers, exportação para PDF).
- `public/` — Recursos estáticos (logos, manifesto, HTML base).

## Dados no Firestore
- Coleção `artifacts/default-app-id/public/data` agrega:
  - `professores/{professorId}` — Dados de professores e disciplinas.
  - `Turmas/{turmaId}` — Metadados de turmas (ano letivo, curso, nome).
  - `disciplinas_turma_ano/disciplinas/{documentos}` — Disciplinas por turma/ano com mapeamento de professor.
  - `availabilities/{docId}` — Disponibilidades enviadas pelos professores (slots, almoços, timestamps).
  - `schedules/{turmaId}` — Horários montados pelo administrador (`entries`, `published`).
  - Outras coleções relacionadas a cardápio (quando habilitadas).

## Fluxos Cruciais
1. **AdminDashboard**
   - Escuta `schedules/{turma}` e `availabilities` via `onSnapshot`.
   - Permite publicar/despublicar, limpar e exportar horários.
2. **ProfessorDashboard**
   - Permite que cada professor defina disponibilidades (`availabilities`), selecione turmas/disciplinas.
   - Deve persistir dados por professor (doc ID normalizado do nome).
3. **AlunoDashboard**
   - Consulta `schedules/{turma}` publicados para exibir horário final.
4. **Cardápio**
   - Usa Firebase Storage para upload de imagens e Firestore para metadados.

## Scripts Úteis
- `scripts/popularCardapio.js` — Popular dados de cardápio (quando necessário).
- Diversos guias `.md` com passos de deploy, migração e documentação do Firebase.

## Boas Práticas
- Sempre usar caminhos absolutos ao manipular Firestore (`artifacts/default-app-id/public/data/...`).
- IDs de documentos costumam ser versões normalizadas (minúsculas e underscores) dos nomes.
- Persistir timestamps usando `serverTimestamp()` para rastrear atualizações.

## Passos Gerais de Desenvolvimento
1. Configurar `.env` ou `firebaseConfig.js` com credenciais corretas.
2. `npm install` e `npm start` para desenvolvimento.
3. Garantir regras do Firestore alinhadas com leituras/escritas necessárias.

> Atualize este sumário quando o modelo de dados ou fluxos principais sofrerem alterações relevantes.