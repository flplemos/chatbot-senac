require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const handleMessage = require('./handleMessage');
const usersData = {};
const chatsCongelados = new Set();

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp conectado!');
});

client.on('message', async msg => {
    await handleMessage(msg, client, usersData, chatsCongelados);
});

const { lerStatusChamados } = require('./sheets');

async function atualizarStatusDosChats() {
  try {
    const chamados = await lerStatusChamados();

    chamados.forEach(({ numero, status }) => {
      const chatId = numero.includes('@c.us') ? numero : `${numero}@c.us`;

      if (status === 'em andamento') {
        chatsCongelados.add(chatId);
      } else if (status === 'finalizado') {
        chatsCongelados.delete(chatId);
      }
    });
  } catch (err) {
    console.error('Erro ao atualizar status dos chats:', err.message);
  }
}

// Atualiza a cada 30 segundos
setInterval(atualizarStatusDosChats, 30000);

client.initialize();