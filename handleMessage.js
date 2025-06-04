const fluxos = require('./fluxos');
const salvarChamado = require('./salvarChamado');
const {
    valImagem
} = require('./validacoes');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function handleMessage(msg, client, usersData) {
    const chatId = msg.from;

    // Usuário está em um fluxo ativo
    if (usersData[chatId]) {
        const user = usersData[chatId];
        const passos = fluxos[user.opcao];
        const passoAtual = user.step;

        let valido = false;

        if (user.opcao === '1' && passoAtual === 4) {
            valido = valImagem(msg);
        } else {
            valido = passos[passoAtual].valida(msg.body || '');
        }

        if (!valido) {
            await client.sendMessage(chatId, `Entrada inválida! ${passos[passoAtual].pergunta}`);
            return;
        }

        // Armazena resposta
        if (user.opcao === '1' && passoAtual === 4) {
            const media = await msg.downloadMedia();
            const base64Data = media.data;
            const mimeType = media.mimetype;
            const extension = mimeType.split('/')[1];
            const fileName = `prints/${chatId}_${Date.now()}.${extension}`;

            const fs = require('fs');
            if (!fs.existsSync('prints')) {
                fs.mkdirSync('prints');
            }

            fs.writeFileSync(fileName, Buffer.from(base64Data, 'base64'));
            user.respostas[passoAtual] = fileName;
        } else {
            user.respostas[passoAtual] = msg.body.trim();
        }

        user.step++;

        if (user.step >= passos.length) {
            await client.sendMessage(chatId, 'Obrigado! Seu chamado foi registrado. Aguarde nosso contato.\n\nPara retornar ao menu digite: "Menu"');
            await salvarChamado(user.opcao, user.respostas, chatId);
            delete usersData[chatId];
            return;
        }

        await client.sendMessage(chatId, passos[user.step].pergunta);
        return;
    }

    // Mensagem inicial - MENU
    if (msg.body.match(/(menu|Menu|oi|Oi|Olá|olá)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || "Usuário";

        await client.sendMessage(msg.from,
            `Olá, ${name.split(" ")[0]}! Sou o assistente virtual do Senac-RN EduTech! Como posso ajudá-lo hoje? Digite uma das opções abaixo:\n\n` +
            `1 - Recuperação de acesso à conta Microsoft\n` +
            `2 - Problemas com Microsoft Authenticator\n` +
            `3 - Consultar meu e-mail institucional\n` +
            `4 - Problema no portal do aluno\n` +
            `5 - Nenhuma dessas opções\n`
        );

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from,
            `Após o envio da mensagem, aguarde. Não reenvie mensagens ou realize ligações, pois isso altera sua posição na fila.\n` +
            `Informamos que o Senac-RN preserva seus dados pessoais conforme a LGPD (Lei nº 13.709/2018).`
        );
        return;
    }

    // Usuário escolheu uma das opções
    if (['1', '2', '3', '4', '5'].includes(msg.body) && msg.from.endsWith('@c.us')) {
        const opcao = msg.body;

        if (opcao === '3') {
            await client.sendMessage(chatId, 'Para consultar seu e-mail institucional, acesse:\n\n🔗 https://salavirtual.rn.senac.br/\n\nDigite seu CPF e veja o e-mail.');
            await delay(3000);
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Para retornar ao menu, digite: "menu"');
            return;
        }

        usersData[chatId] = { opcao, step: 0, respostas: [] };
        await client.sendMessage(chatId, fluxos[opcao][0].pergunta);
        return;
    }

    // Fallback
    await client.sendMessage(chatId, 'Por favor, digite "menu" para ver as opções disponíveis.');
}

module.exports = handleMessage;
