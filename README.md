# 🤖 Chatbot SENAC-RN EduTech

Este projeto é um **chatbot automatizado para suporte técnico via WhatsApp**, desenvolvido durante estágio no setor de Tecnologia Educacional do **Senac-RN**. Seu objetivo é **agilizar o atendimento inicial** a alunos e colaboradores, triando demandas recorrentes e registrando chamados de forma inteligente e organizada.

-----

## 📌 Objetivo

Oferecer um atendimento automatizado inicial para suporte técnico, com foco em:

  - Recuperação de acesso a contas Microsoft
  - Problemas com Microsoft Authenticator
  - Consulta de e-mails institucionais
  - Problemas no portal do aluno
  - Dúvidas gerais

-----

## 🚀 Funcionalidades

  - **Integração com WhatsApp Web:** Utiliza a biblioteca [`whatsapp-web.js`](https://www.google.com/search?q=%5Bhttps://github.com/pedroslopez/whatsapp-web.js%5D\(https://github.com/pedroslopez/whatsapp-web.js\)) para comunicação.
  - **Fluxos de Atendimento Automatizados:** Menu interativo para guiar o usuário na resolução de problemas comuns e na abertura de chamados.
  - **Persistência de Dados com MongoDB e Google Sheets:** Salva todos os detalhes do chamado em um banco de dados **MongoDB Atlas** para garantir robustez e escalabilidade. Simultaneamente, os dados são enviados em tempo real para uma planilha Google Sheets, que funciona como um painel de visualização e sistema de tickets para a equipe.
  - **Integração com Google Drive:** Envia os prints de erros diretamente para uma pasta no Google Drive e anexa o link compartilhável ao chamado, garantindo acesso fácil para a equipe de suporte.
  - **Formatação Avançada da Planilha:** Utiliza Google Apps Script para formatar a planilha de chamados automaticamente, incluindo cabeçalhos estilizados, cores de linha alternadas e botões de status interativos e coloridos.
  - **Gestão de Atendimento Humano:** Possui agenda de plantão para direcionar o usuário ao atendente correto e permite "congelar" a automação para que um humano possa assumir a conversa. 
  - **Comandos administrativos via grupo de suporte:** (`!congelarbot`, `!liberarbot`, `!listarcongelados`) permitem o controle manual do estado de automação dos chats, além da sincronização com a planilha de chamados.
  - **Coleta Detalhada de Descrição do Problema:** Permite que os usuários forneçam uma descrição textual detalhada do problema em fluxos específicos (Opções 1 e 2), aprimorando a triagem e o atendimento do suporte humano.
  - **Notificação Multi-Atendente:** Aprimorado para notificar e mencionar todos os atendentes que estão de plantão durante um período de sobreposição de turnos, garantindo que nenhum chamado seja perdido.

-----

## 🛠️ Tecnologias Utilizadas

  - Node.js
  - MongoDB
  - whatsapp-web.js
  - googleapis (API do Google Sheets e Google Drive)
  - qrcode-terminal
  - Google Apps Script
  - moment-timezone

-----

## 📂 Estrutura dos Arquivos

  - `chatbot.js`: arquivo principal do bot.
  - `handleMessage.js`: controle da lógica de atendimento.
  - `fluxos.js`: define os fluxos de perguntas por opção de suporte.
  - `validacoes.js`: validação de dados do usuário.
  - `agendaSuporte.js`: controle dos plantonistas por horário.
  - `salvarChamado.js`: salva o chamado no banco de dados MongoDB e envia para o Google Sheets.
  - `userdatas.json`: (Obsoleto) armazenamento local de chamados, agora substituído pelo MongoDB.
  - `sheets.js`: Módulo que lida com a comunicação com a API do Google Sheets.
  - `drive.js`: Módulo responsável por fazer o upload de imagens para o Google Drive.
  - `prints/`: Pasta anteriormente usada para salvar imagens localmente, agora substituída pela integração com Google Drive.

-----

## ✅ Melhorias e Correções

 - **Correção de Fluxo de Imagem:** Resolvido o problema que interrompia o fluxo de conversa após o envio de uma imagem pelo usuário.
- **Ajuste no Mapeamento de Dados:** Corrigida a lógica de mapeamento de respostas para o Google Sheets, garantindo que a descrição do problema e a URL da imagem sejam salvas nas colunas corretas.
- **Validação Aprimorada de E-mail Institucional:** Implementada uma validação mais específica para e-mails institucionais, garantindo que o domínio `@edum.rn.senac.br` seja seguido e fornecendo feedback claro ao usuário em caso de formato incorreto.
- **Persistência de Congelamento de Chats:** Corrigida a lógica dos comandos administrativos (`!congelarbot`, `!liberarbot`, `!listarcongelados`) para garantir que os congelamentos de chat manuais sejam persistentes e corretamente listados, evitando que sejam desfeitos após ciclos de sincronização da planilha.
- **Inclusão da Opção Escolhida:** Adicionado um campo na planilha do Google Sheets para registrar a opção do menu inicial escolhida pelo usuário ao abrir um chamado, aprimorando a triagem.
- **Estabilidade de Conexão em VMs:** Resolvidos problemas de conexão do WhatsApp Web em ambientes de VM Linux, garantindo a inicialização robusta do cliente.

-----

## ⚠️ Requisitos e Avisos

> ⚠️ **Este projeto não está pronto para execução direta fora do ambiente interno.**

  - A integração com as APIs do Google requer um arquivo de credenciais (`credentials/google-service-account.json`), que **não está incluído no repositório**. A conta de serviço precisa de permissão nas APIs do Google Sheets e Google Drive.
  - É necessário configurar a string de conexão do **MongoDB Atlas** como uma variável de ambiente (`MONGO_URI`).
  - O ID do grupo de suporte, os IDs dos atendentes e o ID da pasta do Google Drive precisam ser configurados manualmente nos arquivos de código ou via variáveis de ambiente.
  - O bot só funcionará se for escaneado por uma conta do WhatsApp ativa.

-----

## 🔐 LGPD

O bot exibe uma mensagem automática informando que os dados dos usuários são tratados conforme a **Lei Geral de Proteção de Dados (LGPD - Lei n° 13.709/2018)**.

-----

## 📄 Licença

Projeto de uso interno/acadêmico no contexto do **Senac-RN**. Reutilização permitida para fins educacionais.

-----

## 🏃 Como Executar (Ambiente Interno)

Para configurar e rodar o chatbot em um ambiente de desenvolvimento ou VM:

1.  **Clone o repositório:**
    `git clone [URL_DO_SEU_REPOSITORIO]`
    `cd chatbot-senac`
2.  **Instale as dependências:**
    `npm install`
3.  **Configure as variáveis de ambiente:** Crie um arquivo `.env` na raiz do projeto com as chaves necessárias (MONGO_URI, ID_PLANILHA, ID_PASTA_DRIVE, ID_GRUPO_SUPORTE).
4.  **Prepare a Planilha e o Drive:**
    - Configure o arquivo de credenciais `credentials/google-service-account.json`.
    - Crie a planilha Google Sheets com os cabeçalhos esperados e a pasta no Google Drive.
5.  **Inicie o bot:**
    `node chatbot.js`
    Escaneie o QR Code exibido no terminal.

*(Certifique-se de que sua VM Linux possui as dependências do Chromium instaladas para o Puppeteer funcionar corretamente.)*

## 🙋‍♂️ Autoria e Contribuições

Este projeto foi idealizado e desenvolvido por **Felipe Lemos**, responsável por:

  - Toda a estrutura funcional do chatbot (fluxos, validações, armazenamento)
  - Organização modular e lógica de controle de estado por usuário
  - Integração com WhatsApp Web, Google Sheets e **MongoDB**
  - Integração com Google Drive para upload de imagens
  - Implementação de Google Apps Script para formatação avançada da planilha
  - Mecanismos de controle por horário, plantonistas e comandos administrativos
  - Persistência de dados e registro de imagens enviadas pelo usuário
  - Implementação da agenda de plantonistas e validações personalizadas
  - Lógica de resposta automática inteligente e mensagens conforme a LGPD
  - Estruturação de código limpa e preparada para manutenção/escalabilidade futura

Projeto desenvolvido no contexto de estágio no setor de Tecnologia Educacional do Senac-RN.
