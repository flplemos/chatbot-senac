// getIds.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client();

client.on('ready', async () => {
    console.log('Cliente pronto! Listando conversas...');
    const chats = await client.getChats();

    console.log('\n--- GRUPOS ---');
    chats.filter(chat => chat.isGroup).forEach(chat => {
        // Mostra o nome e o ID de cada grupo
        console.log(`Nome do Grupo: ${chat.name}, ID: ${chat.id._serialized}`);
    });

    console.log('\n(Para fechar, pressione Ctrl+C)');
    // Não vamos destruir o cliente para que você tenha tempo de copiar os IDs.
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.initialize();