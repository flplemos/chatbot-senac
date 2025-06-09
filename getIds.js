// getIds.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 🔹 Instanciação do cliente deve vir antes de usá-lo
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Cliente pronto! Aguardando carregamento de conversas...');

    setTimeout(async () => {
        try {
            const chats = await client.getChats();
            console.log(`Total de conversas carregadas: ${chats.length}`);

            const grupos = chats.filter(chat => chat.isGroup);
            console.log(`Total de grupos: ${grupos.length}`);

            grupos.forEach(chat => {
                console.log(`Nome do Grupo: ${chat.name}, ID: ${chat.id._serialized}`);
            });

            if (grupos.length === 0) {
                console.log('Nenhum grupo encontrado. Verifique se a conta participa de grupos ou se há limitações.');
            }

        } catch (error) {
            console.error('Erro ao listar conversas:', error);
        }
    }, 3000);
});

client.initialize();
