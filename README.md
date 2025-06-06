# 🤖 Chatbot SENAC-RN EduTech

Este projeto é um **chatbot automatizado para suporte técnico via WhatsApp**, desenvolvido durante estágio no setor de Tecnologia Educacional do **Senac-RN**. Seu objetivo é **agilizar o atendimento inicial** a alunos e colaboradores, triando demandas recorrentes relacionadas a acesso e sistemas institucionais.

---

## 📌 Objetivo

Oferecer um atendimento automatizado inicial para suporte técnico, com foco em:

- Recuperação de acesso a contas Microsoft
- Problemas com Microsoft Authenticator
- Consulta de e-mails institucionais
- Problemas no portal do aluno
- Dúvidas gerais

---

## 🚀 Funcionalidades

- Integração com **WhatsApp Web** via [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
- Geração de QR Code para autenticação
- Menu de suporte com opções automatizadas
- Coleta e validação de informações (nome, CPF, e-mails, imagens)
- Armazenamento dos chamados localmente (`userdatas.json`)
- Suporte à integração com **Google Sheets** (via API)
- Definição de **agenda de plantão** com redirecionamento de atendimentos
- Congelamento/liberação de chats por atendentes via comandos no grupo de suporte

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- whatsapp-web.js
- qrcode-terminal
- fs (sistema de arquivos)
- googleapis (API do Google Sheets)
- moment-timezone

---

## 📂 Estrutura dos Arquivos

- `chatbot.js`: arquivo principal do bot
- `handleMessage.js`: controle da lógica de atendimento
- `fluxos.js`: define os fluxos de perguntas por opção de suporte
- `validacoes.js`: validação de dados do usuário
- `agendaSuporte.js`: controle dos plantonistas por horário
- `salvarChamado.js`: salva o chamado localmente e no Google Sheets
- `userdatas.json`: armazenamento local de chamados
- `prints/`: pasta onde são salvas as imagens enviadas

---

## ⚠️ Requisitos e Avisos

> ⚠️ **Este projeto não está pronto para execução direta fora do ambiente interno.**

- A integração com Google Sheets requer um arquivo de credenciais (`credentials/google-service-account.json`), que **não está incluído no repositório** por questões de segurança.
- O ID do grupo de suporte (`ID_GRUPO_SUPORTE`) e os IDs dos atendentes também precisam ser configurados manualmente.
- O bot só funcionará se for escaneado por uma conta do WhatsApp ativa, com permissão para atuar no grupo de suporte.

---

## 🔐 LGPD

O bot exibe uma mensagem automática informando que os dados dos usuários são tratados conforme a **Lei Geral de Proteção de Dados (LGPD - Lei n° 13.709/2018)**.

---

## 📄 Licença

Projeto de uso interno/acadêmico no contexto do **Senac-RN**. Reutilização permitida para fins educacionais.

---

## 🙋‍♂️ Autoria e Contribuições

Este projeto foi idealizado e desenvolvido por **Felipe Lemos**, responsável por:

- Toda a estrutura funcional do chatbot (fluxos, validações, armazenamento)
- Organização modular e lógica de controle de estado por usuário
- Integração com WhatsApp Web e Google Sheets
- Mecanismos de controle por horário, plantonistas e comandos administrativos
- Persistência de dados local e registro de imagens enviadas pelo usuário
- Implementação da agenda de plantonistas e validações personalizadas
- Lógica de resposta automática inteligente e mensagens conforme a LGPD
- Estruturação de código limpa e preparada para manutenção/escalabilidade futura

**Rafael Moura** contribuiu com:
- A função de verificação de horário útil (`dentroDoHorario`)
- Um fluxo adicional de atendimento (opção 6), sem integração com operadores

Projeto desenvolvido no contexto de estágio no setor de Tecnologia Educacional do Senac-RN.
