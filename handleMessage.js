const fluxos = require('./fluxos');
const salvarChamado = require('./salvarChamado');
const {
    valImagem
} = require('./validacoes');

const delay = ms => new Promise(res => setTimeout(res, ms));

// Função para verificar dia útil e horário comercial
function dentroDoHorario() {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = domingo, 6 = sábado
    const hora = agora.getHours(); // 0 a 23

    // Segunda a Sexta, das 08:00 às 21:00
    const diaUtil = dia >= 1 && dia <= 5;
    const horarioUtil = hora >= 8 && hora < 21;

    return diaUtil && horarioUtil;
}

async function handleMessage(msg, client, usersData) {
    const chatId = msg.from;

    // Usuário está em um fluxo ativo
    if (usersData[chatId]) {
        const user = usersData[chatId];
        const passos = fluxos[user.opcao];
        const passoAtual = user.step;

        let valido = false;

        // Validação específica para imagem na opção 1, passo 4
        if ((user.opcao === '1' || user.opcao === '2') && passoAtual === 4) {
            valido = valImagem(msg);
        } else {
            valido = passos[passoAtual].valida(msg.body || '');
        }

        if (!valido) {
            await client.sendMessage(chatId, `Entrada inválida! ${passos[passoAtual].pergunta}`);
            return;
        }

        // Armazena resposta
        if ((user.opcao === '1' || user.opcao === '2') && passoAtual === 4) {
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
            await salvarChamado(user.opcao, user.respostas, chatId); // Mantém a chamada com chatId para o sheets.js
            delete usersData[chatId];
            return;
        }

        await client.sendMessage(chatId, passos[user.step].pergunta);
        return;
    }

    // Mensagem inicial - MENU (regex atualizada)
    if (msg.body.match(/(menu|Menu|oi|Oi|Olá|olá|boa|Boa)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || "Usuário";

        // Mensagem de menu atualizada com as novas opções
        await client.sendMessage(msg.from,
            `Olá! ${name.split(" ")[0]} Sou o assistente virtual do Senac-RN EduTech! Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n` +
            `1 - Recuperação de acesso a conta Microsoft\n` +
            `2 - Problemas com Microsoft Authenticator\n` +
            `3 - Consultar meu e-mail institucional\n` +
            `4 - Problema no portal do aluno\n` +
            `5 - Dúvidas sobre cursos e matrículas\n` +
            `6 - Falar com o suporte humano\n`
        );

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        // Mensagem da LGPD atualizada
        await client.sendMessage(msg.from,
            `Após o envio da mensagem, aguarde. Não reenvie mensagens ou realize ligações, pois alteram a sua vez na fila de espera.\n` +
            `Informamos que o Senac-RN preserva seus dados pessoais de forma segura e transparente, baseado na nova Lei n°13.709/2018 LGPD (Lei Geral de Proteção de Dados).`
        );
        return;
    }

    // Usuário escolheu uma das opções (lista de opções atualizada)
    if (['1', '2', '3', '4', '5', '6'].includes(msg.body) && msg.from.endsWith('@c.us')) {
        const opcao = msg.body;

        if (opcao === '3') {
            // Mensagem da opção 3 atualizada
            await client.sendMessage(chatId, 'Para consultar seu e-mail institucional, acesse o link abaixo e informe seu CPF:\n\n🔗 https://salavirtual.rn.senac.br/\n\nLá você verá qual é seu e-mail institucional.');
            await delay(3000);
            await client.sendMessage(msg.from, 'Para retornar ao Menu digite: "menu"');
            return;
        }

        // Nova opção 5: Dúvidas sobre matrículas e cursos
        if (opcao === '5') {
            await client.sendMessage(chatId, 'Informações sobre matrículas e cursos do SENAC-RN você pode entrar em contato com a central de atendimento: (84) 4005-1000 ou pelo site: Senac RN - CURSOS.');
            await delay(3000);
            await client.sendMessage(msg.from, 'Para retornar ao Menu digite: "menu"');
            return;
        }
        
        // Nova opção 6: Falar com o suporte humano
        if (opcao === '6') {
            if (dentroDoHorario()) {
                await client.sendMessage(chatId, 'Você será encaminhado para um de nossos atendentes humanos. Aguarde um momento...');
                // Aqui pode colocar lógica de alerta, envio para grupo, ou apenas registrar
            } else {
                await client.sendMessage(chatId, 'O nosso atendimento humano funciona de segunda a sexta-feira, das 08:00 às 21:00. Por favor, entre em contato nesse período.');
            }
            await delay(3000);
            await client.sendMessage(msg.from, 'Para retornar ao Menu digite: "menu"');
            return;
        }

        // Inicia o fluxo para as opções 1, 2 e 4
        usersData[chatId] = { opcao, step: 0, respostas: [] };
        await client.sendMessage(chatId, fluxos[opcao][0].pergunta);
        return;
    }

    // Fallback
    await client.sendMessage(chatId, 'Por favor, digite "menu" para ver as opções disponíveis.');
}

module.exports = handleMessage;