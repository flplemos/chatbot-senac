const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const { adicionarLinha } = require('./sheets');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp conectado!');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

const usersData = {}; // estado por usuário

// Definição do fluxo de perguntas para cada opção
const fluxos = {
    '1': [
        { pergunta: 'Por favor, informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional:', valida: valEmail },
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '2': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional:', valida: valEmail },
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '4': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Descreva o problema no portal do aluno:', valida: valTextoSimples }
    ],
    '5': [
        { pergunta: 'Por favor, descreva sua dúvida ou questão:', valida: valTextoSimples }
    ]
};

// Funções de validação simples
function valNome(text) { return text.trim().length > 0; }
function valCPF(text) { return /^\d{11}$/.test(text.replace(/\D/g, '')); }
function valEmail(text) { return /\S+@\S+\.\S+/.test(text); }
function valTextoSimples(text) { return text.trim().length > 0; }
function valImagem(msg) { return msg.hasMedia; }

// Função para salvar chamado em JSON
async function salvarChamado(opcao, respostas, chatId) {
  const arquivo = './userdatas.json';
  let dados = [];

  if (fs.existsSync(arquivo)) {
    const json = fs.readFileSync(arquivo);
    dados = JSON.parse(json);
  }

  const chamado = {
    opcao,
    respostas,
    dataRegistro: new Date().toISOString()
  };

  dados.push(chamado);
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

  // Formata os dados para a planilha
  const linha = [
    Date.now(),                // ID_Chamado
    chatId,                    // ChatID_Usuario
    respostas[0] || '',        // Nome_Completo
    respostas[1] || '',        // CPF
    respostas[2] || '',        // Email_Pessoal
    respostas[3] || '',        // Email_Institucional
    respostas[4] || '',        // Descricao_Problema ou Caminho_Print
    respostas[4]?.startsWith('prints') ? respostas[4] : '', // Caminho_Print
    new Date().toLocaleString('pt-BR'), // Data_Hora_Registro_Bot
    'Em aberto',               // Status_Chamado
    '', '', '', ''             // Atendente_Responsavel, Data_Hora_Finalizacao_Atendente,               Resolucao_Confirmada_Usuario, Nota_Atendimento
  ];

  try {
    await adicionarLinha(linha);
    console.log('Chamado registrado na planilha com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar dados para a planilha:', err);
  }
}


client.on('message', async msg => {
    
    const chatId = msg.from;

    // Se usuário está no meio de um fluxo
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
            await client.sendMessage(chatId, 'Obrigado! Seu chamado foi registrado. Aguarde nosso contato.\n\n Para retornar ao menu digite: "Menu"');


            await salvarChamado(user.opcao, user.respostas, chatId);

            delete usersData[chatId];
            return;
        }

        await client.sendMessage(chatId, passos[user.step].pergunta);
        return;
    }

    // Início do atendimento: menu inicial
    if (msg.body.match(/(menu|Menu|oi|Oi|Olá|olá)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || "Usuário";
        await client.sendMessage(msg.from,
            `Olá! ${name.split(" ")[0]} Sou o assistente virtual do Senac-RN EduTech! Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n` +
            `1 - Recuperação de acesso a conta Microsoft\n` +
            `2 - Problemas com Microsoft Authenticator\n` +
            `3 - Consultar meu e-mail institucional\n` +
            `4 - Problema no portal do aluno\n` +
            `5 - Nenhuma dessas opções\n` 
        );
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from,
            `Após o envio da mensagem, aguarde. Não reenvie mensagens ou realize ligações, pois alteram a sua vez na fila de espera.\n` +
            `Informamos que o Senac-RN preserva seus dados pessoais de forma segura e transparente, baseado na nova Lei n°13.709/2018 LGPD (Lei Geral de Proteção de Dados).`
        );
        return;
    }

    // Usuário escolheu uma das opções
    if (['1', '2', '3', '4', '5'].includes(msg.body) && msg.from.endsWith('@c.us')) {
        const opcao = msg.body;

        // Resposta direta para opção 3
        if (opcao === '3') {
            await client.sendMessage(chatId, 'Para consultar seu e-mail institucional, acesse o link abaixo e informe seu CPF:\n\n🔗 https://salavirtual.rn.senac.br/\n\nLá você verá qual é seu e-mail institucional.');
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from,'Para retornar ao Menu digite: "menu"')
            return;
        }

        usersData[chatId] = { opcao, step: 0, respostas: [] };
        await client.sendMessage(chatId, fluxos[opcao][0].pergunta);
        return;
    }

    // Mensagem que não bate com nada
    await client.sendMessage(chatId, 'Por favor, digite "menu" para ver as opções disponíveis.');
});
