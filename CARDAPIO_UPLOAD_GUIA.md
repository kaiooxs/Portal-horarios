# 📤 Guia: Sistema de Upload de Cardápio

## 🎯 Visão Geral

O sistema de cardápio foi **simplificado** para facilitar a gestão semanal. Agora o administrador apenas precisa fazer **upload da imagem do cardápio** fornecida pela Scolarest.

---

## 👨‍💼 Para Administradores

### Como Publicar um Novo Cardápio

1. **Fazer Login**
   - Acesse o portal como Administrador
   - Senha: `admin123`

2. **Acessar Gestão de Cardápio**
   - Clique na aba **"🍽️ Gerir Cardápio"**

3. **Preencher Informações**
   - **Data de Início**: Digite a data de início da semana (ex: "23 de Setembro")
   - **Data de Fim**: Digite a data de fim da semana (ex: "27 de Setembro")

4. **Selecionar Imagem**
   - Clique em **"Escolher arquivo"**
   - Selecione a foto do cardápio da Scolarest
   - Formatos aceitos: JPG, PNG, GIF
   - Tamanho máximo: 5MB

5. **Pré-visualizar**
   - A imagem aparecerá em pré-visualização
   - Verifique se está legível e nítida

6. **Publicar**
   - Clique em **"✅ Publicar Cardápio"**
   - Aguarde a confirmação de sucesso
   - O cardápio estará imediatamente disponível para alunos e professores

### Dicas para Melhores Resultados

✅ **Tire fotos nítidas**
- Use boa iluminação
- Evite sombras e reflexos
- Mantenha a câmera estável

✅ **Enquadramento correto**
- Capture todo o cardápio
- Certifique-se de que o texto está legível
- Evite cortar informações importantes

✅ **Momento ideal**
- Publique no início da semana (segunda-feira)
- Mantenha sempre o cardápio atualizado
- Remova cardápios antigos se necessário

### Gerenciar Cardápios Publicados

**Ver Cardápios Ativos:**
- Role para baixo até "📋 Cardápios Publicados"
- Veja todos os cardápios salvos

**Remover Cardápio:**
- Clique em **"🗑️ Remover"** ao lado do cardápio
- Confirme a remoção
- O cardápio será excluído permanentemente

---

## 👨‍🎓 Para Alunos

### Como Ver o Cardápio

1. **Fazer Login**
   - Acesse com sua turma (ex: PI01)

2. **Acessar Cardápio**
   - Clique no botão **"🍽️ Cardápio"**

3. **Visualizar**
   - Veja a imagem do cardápio da semana atual
   - Use os botões para:
     - **🔍 Ver em Tamanho Real**: Abre em nova aba
     - **💾 Baixar Imagem**: Salva no seu dispositivo

4. **Cardápios Anteriores**
   - Role para baixo até "📚 Cardápios Anteriores"
   - Clique para expandir e ver semanas passadas

---

## 👨‍🏫 Para Professores

### Como Ver o Cardápio

1. **Fazer Login**
   - Acesse com seu nome e senha (`prof123`)

2. **Acessar Cardápio**
   - Clique no botão **"🍽️ Cardápio"**

3. **Visualizar**
   - Veja a imagem do cardápio da semana atual
   - Use os botões para:
     - **🔍 Ver em Tamanho Real**: Abre em nova aba
     - **💾 Baixar Imagem**: Salva no seu dispositivo

4. **Compartilhar com Alunos**
   - Baixe a imagem e compartilhe se necessário
   - Informe os alunos sobre mudanças no cardápio

---

## 🔧 Configuração Técnica

### Requisitos do Firebase

Para que o sistema funcione, é necessário:

1. **Firebase Storage Ativado**
   ```
   - Acesse Firebase Console
   - Vá para "Storage"
   - Clique em "Get Started"
   - Configure as regras de segurança
   ```

2. **Regras de Segurança Recomendadas**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Permitir leitura pública das imagens de cardápio
       match /cardapios/{imageId} {
         allow read: if true;
         allow write: if request.auth != null; // Apenas usuários autenticados
       }
     }
   }
   ```

3. **Firestore Database**
   - Coleção: `artifacts/default-app-id/public/data/menus`
   - Documento: `current`
   - Estrutura:
     ```json
     {
       "semanas": [
         {
           "dataInicio": "23 de Setembro",
           "dataFim": "27 de Setembro",
           "imagemUrl": "https://firebasestorage.googleapis.com/...",
           "dataPublicacao": "2025-01-20T10:30:00.000Z"
         }
       ]
     }
     ```

---

## ❓ Perguntas Frequentes

### 1. Qual o tamanho máximo da imagem?
**R:** 5MB. Se a imagem for maior, comprima-a antes de fazer upload.

### 2. Posso editar um cardápio já publicado?
**R:** Não diretamente. Você precisa remover o cardápio antigo e publicar um novo.

### 3. Quantos cardápios posso ter salvos?
**R:** Não há limite. Todos os cardápios ficam salvos no histórico.

### 4. Os alunos veem automaticamente o novo cardápio?
**R:** Sim! Assim que você publicar, o cardápio aparece imediatamente para todos.

### 5. Posso publicar cardápios com antecedência?
**R:** Sim! Você pode publicar vários cardápios de semanas futuras.

### 6. Como sei qual cardápio está sendo exibido?
**R:** O sistema sempre exibe o cardápio mais recente (primeiro da lista).

### 7. A imagem fica com boa qualidade?
**R:** Sim, desde que a foto original seja nítida. Use boa iluminação ao fotografar.

### 8. Posso usar imagens da internet?
**R:** Sim, mas certifique-se de que são as imagens oficiais da Scolarest.

---

## 🆘 Resolução de Problemas

### Problema: "Erro ao publicar cardápio"

**Possíveis causas:**
- Imagem muito grande (> 5MB)
- Formato de arquivo não suportado
- Problemas de conexão com Firebase

**Soluções:**
1. Comprima a imagem
2. Converta para JPG ou PNG
3. Verifique sua conexão com a internet
4. Tente novamente em alguns minutos

### Problema: "Imagem não aparece para os alunos"

**Possíveis causas:**
- Firebase Storage não configurado
- Regras de segurança bloqueando leitura
- URL da imagem inválida

**Soluções:**
1. Verifique se o Firebase Storage está ativado
2. Revise as regras de segurança
3. Tente publicar novamente

### Problema: "Imagem aparece borrada"

**Possíveis causas:**
- Foto original de baixa qualidade
- Foto tirada com pouca luz
- Câmera tremida

**Soluções:**
1. Tire uma nova foto com melhor qualidade
2. Use boa iluminação
3. Estabilize a câmera ao fotografar

---

## 📊 Comparação: Antes vs Agora

### ❌ Sistema Antigo (Complexo)
- Admin precisava digitar todas as refeições manualmente
- Preencher sopa, prato principal, vegetariano, sobremesa
- Adicionar informações nutricionais
- Muito tempo gasto na digitação
- Risco de erros de digitação

### ✅ Sistema Novo (Simplificado)
- Admin apenas faz upload da imagem
- Preenche apenas datas de início e fim
- Processo leva menos de 1 minuto
- Sem risco de erros de digitação
- Imagem oficial da Scolarest

---

## 🎯 Fluxo de Trabalho Semanal

### Segunda-feira (Início da Semana)

1. **Receber cardápio da Scolarest**
   - Por email, WhatsApp ou presencialmente

2. **Fotografar ou salvar imagem**
   - Se recebeu em papel: tire uma foto nítida
   - Se recebeu digital: salve a imagem

3. **Publicar no portal**
   - Login como admin
   - Upload da imagem
   - Preencher datas
   - Publicar

4. **Verificar**
   - Faça logout
   - Login como aluno ou professor
   - Verifique se o cardápio está visível

5. **Comunicar**
   - Informe os alunos e professores
   - Envie mensagem nos grupos se necessário

### Fim da Semana (Opcional)

- Remova cardápios muito antigos (> 1 mês)
- Mantenha histórico recente para consulta

---

## 💡 Dicas Avançadas

### Para Melhor Organização

1. **Nomeie os arquivos**
   - Exemplo: `cardapio_23-27_setembro.jpg`
   - Facilita encontrar depois

2. **Mantenha backup**
   - Salve as imagens em uma pasta no computador
   - Útil caso precise republicar

3. **Crie um calendário**
   - Agende lembretes para publicar toda segunda
   - Evite esquecer de atualizar

4. **Comunique mudanças**
   - Se houver alterações no cardápio
   - Publique novamente com a versão atualizada

### Para Melhor Qualidade

1. **Use scanner se disponível**
   - Melhor qualidade que foto
   - Imagem mais nítida

2. **Edite se necessário**
   - Ajuste brilho e contraste
   - Corte bordas desnecessárias
   - Use apps como Photoshop, GIMP ou apps mobile

3. **Teste em diferentes dispositivos**
   - Verifique como aparece no celular
   - Verifique como aparece no computador
   - Certifique-se de que está legível

---

## 📞 Suporte

### Problemas Técnicos
- 📧 **Email**: suporte.ti@epalc.pt
- 📱 **Telefone**: +351 XXX XXX XXX

### Questões sobre Cardápio
- 📧 **Email**: cantina@epalc.pt
- 🏢 **Presencial**: Secretaria da EPALC

### Scolarest
- 📧 **Email**: info@scolarest.pt
- 🌐 **Website**: www.scolarest.pt

---

## ✅ Checklist Semanal

Use este checklist toda semana:

- [ ] Recebi o cardápio da Scolarest
- [ ] Imagem está nítida e legível
- [ ] Fiz login como administrador
- [ ] Acessei "Gerir Cardápio"
- [ ] Preenchi data de início
- [ ] Preenchi data de fim
- [ ] Selecionei a imagem
- [ ] Verifiquei a pré-visualização
- [ ] Publiquei o cardápio
- [ ] Recebi confirmação de sucesso
- [ ] Verifiquei como aluno/professor
- [ ] Informei a comunidade escolar

---

## 🎉 Conclusão

O novo sistema de cardápio é **simples, rápido e eficiente**!

**Benefícios:**
- ⏱️ Economiza tempo do administrador
- 📸 Usa a imagem oficial da Scolarest
- ✅ Sem erros de digitação
- 📱 Acessível em qualquer dispositivo
- 🔄 Atualização em tempo real

**Lembre-se:**
- Publique toda segunda-feira
- Use imagens nítidas
- Mantenha o histórico atualizado
- Comunique mudanças à comunidade

---

**Versão do Documento:** 1.0  
**Data:** Janeiro 2025  
**Sistema:** Portal de Horários EPALC v1.2.0