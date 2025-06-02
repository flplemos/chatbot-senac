# 🤖 Chatbot SENAC-RN EduTech

Este projeto é um chatbot desenvolvido durante estágio no setor de Tecnologia Educacional do **Senac-RN**, com o objetivo de **automatizar os atendimentos do suporte técnico via WhatsApp**, otimizando a triagem de solicitações e dúvidas dos usuários.

## 📌 Objetivo

Oferecer um atendimento inicial automatizado para suporte técnico, focado em:
- Recuperação de acesso a contas Microsoft
- Problemas com Microsoft Authenticator
- Consulta de e-mails institucionais
- Problemas no portal do aluno
- Dúvidas gerais

## 🚀 Funcionalidades

- Atendimento via **WhatsApp Web** usando `whatsapp-web.js`
- Geração de QR Code para autenticação
- Menu inicial com 5 opções de suporte
- Coleta de informações como nome, CPF, e-mails e imagens
- Validação de dados básicos (CPF, e-mail, imagem)
- Armazenamento dos chamados em um arquivo JSON (`userdatas.json`)
- Armazenamento de imagens recebidas em uma pasta local

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- `fs` para manipulação de arquivos
- `moment-timezone` (embora não utilizado no código atual, está no package)

## 📂 Estrutura dos Arquivos

- `chatbot.js`: arquivo principal do bot
- `userdatas.json`: armazenamento dos chamados abertos
- `prints/`: pasta onde são salvas imagens enviadas pelos usuários

## 💻 Como Usar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/flplemos/chatbot-senac.git
   cd chatbot-senac
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o bot:
   ```bash
   node chatbot.js
   ```

Leia o QR Code com o app do WhatsApp no seu celular.

O bot responderá automaticamente com um menu assim que o usuário enviar "menu", "oi", "olá" etc.

🔐 LGPD
O bot exibe uma mensagem automática informando que os dados dos usuários são tratados conforme a Lei Geral de Proteção de Dados (LGPD - Lei n° 13.709/2018).

📄 Licença
Projeto de uso interno/acadêmico no contexto do Senac-RN. Reutilização livre para fins educacionais.

🙋‍♂️ Autor
Desenvolvido por Felipe Lemos, estagiário no setor de Tecnologia Educacional do Senac-RN.
