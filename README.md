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
  - **Correção de Bugs:** Resolvido o problema que interrompia o fluxo de conversa após o envio de uma imagem pelo usuário.

-----

## 🛠️ Tecnologias Utilizadas

  - Node.js
  - **MongoDB**
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

**Rafael Moura** contribuiu com:

  - A função de verificação de horário útil (`dentroDoHorario`)
  - Um fluxo adicional de atendimento (opção 6), sem integração com operadores

Projeto desenvolvido no contexto de estágio no setor de Tecnologia Educacional do Senac-RN.