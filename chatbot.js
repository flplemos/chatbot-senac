const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const handleMessage = require('./handleMessage'); // importa o controlador
const usersData = {}; // controle de fluxo dos usuários

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp conectado!');
});

client.on('message', async msg => {
    await handleMessage(msg, client, usersData);
});

client.initialize();
