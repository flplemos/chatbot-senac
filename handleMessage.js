const { uploadImagem } = require("./drive");

const fluxos = require("./fluxos");
const salvarChamado = require("./salvarChamado");
const agenda = require("./agendaSuporte");
const { valImagem } = require("./validacoes");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const ID_GRUPO_SUPORTE = "120363140070487039@g.us"; // <-- LEMBRE-SE DE SUBSTITUIR

function dentroDoHorario() {
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours();
  const diaUtil = dia >= 1 && dia <= 5;
  const horarioUtil = hora >= 8 && hora < 21;
  return diaUtil && horarioUtil;
}

function getAtendenteDaVez() {
  const agora = new Date();
  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const plantonista = agenda.find(
    (turno) =>
      turno.dia === diaAtual &&
      horaAtual >= turno.horaInicio &&
      horaAtual < turno.horaFim
  );
  return plantonista;
}

async function handleMessage(msg, client, usersData, chatsCongelados) {
  const chatId = msg.from;

  // =================================================================
  //  NOVO: LÓGICA DE COMANDO PARA DESCONGELAR (USO DOS ATENDENTES)
  // =================================================================
  if (msg.from === ID_GRUPO_SUPORTE) {
    // --- Comando para LIBERAR o bot ---
    if (msg.body.toLowerCase().startsWith("!liberarbot ")) {
      const partes = msg.body.split(" ");
      // Pega a segunda parte do comando e remove espaços/quebras de linha
      const numeroAlvo = partes[1] ? partes[1].trim() : null;

      if (!numeroAlvo) {
        return await client.sendMessage(
          ID_GRUPO_SUPORTE,
          "⚠️ Formato incorreto. Use: !liberarbot <numero_do_usuario>"
        );
      }
      const chatIdAlvo = `${numeroAlvo}@c.us`;

      if (chatsCongelados.has(chatIdAlvo)) {
        chatsCongelados.delete(chatIdAlvo);
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `✅ Bot liberado para o usuário ${numeroAlvo}.`
        );
      } else {
        // Para depuração, pode ser útil verificar os valores aqui
        console.log(`Falha ao liberar. ID buscado: ${chatIdAlvo}`);
        console.log("IDs congelados no momento:", Array.from(chatsCongelados));
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `⚠️ O bot já estava ativo para o usuário ${numeroAlvo}.`
        );
      }
      return;
    }

    // --- NOVO: Comando para CONGELAR o bot ---
    if (msg.body.toLowerCase().startsWith("!congelarbot ")) {
      const numeroAlvo = msg.body.split(" ")[1];
      if (!numeroAlvo) {
        return await client.sendMessage(
          ID_GRUPO_SUPORTE,
          "⚠️ Formato incorreto. Use: !congelarbot <numero_do_usuario>"
        );
      }
      const chatIdAlvo = `${numeroAlvo}@c.us`;

      if (chatsCongelados.has(chatIdAlvo)) {
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `⚠️ O bot já estava congelado para o usuário ${numeroAlvo}.`
        );
      } else {
        chatsCongelados.add(chatIdAlvo);
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `✅ Bot congelado para o usuário ${numeroAlvo}. O bot não responderá mais a este usuário até ser liberado.`
        );
      }
      return; // Encerra a função após processar o comando
    }

    // Se a mensagem no grupo não for um comando, simplesmente ignora.
    return;
  }

  // =================================================================
  //  NOVO: VERIFICA SE O CHAT ESTÁ CONGELADO E IGNORA A MENSAGEM
  // =================================================================
  if (chatsCongelados.has(chatId)) {
    return; // Se o chat está na lista, o bot não faz nada.
  }

  if (usersData[chatId]) {
    const user = usersData[chatId];
    const passos = fluxos[user.opcao];
    const passoAtual = user.step;
    let valido = false;
    if ((user.opcao === "1" || user.opcao === "2") && passoAtual === 4) {
      valido = valImagem(msg);
    } else {
      valido = passos[passoAtual].valida(msg.body || "");
    }
    if (!valido) {
      await client.sendMessage(
        chatId,
        `Entrada inválida! ${passos[passoAtual].pergunta}`
      );
      return;
    }

    if ((user.opcao === "1" || user.opcao === "2") && passoAtual === 4) {
      const media = await msg.downloadMedia();
      const fileName = `${chatId}_${Date.now()}.jpeg`; // Nome do arquivo

      // Chama a função de upload e aguarda o link
      const imageUrl = await uploadImagem(media.data, media.mimetype, fileName);

      // Salva o link do Google Drive em vez do caminho local
      user.respostas[passoAtual] = imageUrl;
    } else {
      user.respostas[passoAtual] = msg.body.trim();
    }

    user.step++;
    if (user.step >= passos.length) {
      await client.sendMessage(
        chatId,
        'Obrigado! Seu chamado foi registrado. Aguarde nosso contato.\n\nPara retornar ao menu digite: "Menu"'
      );
      await salvarChamado(user.opcao, user.respostas, chatId, client);
      delete usersData[chatId];
      return;
    }
    await client.sendMessage(chatId, passos[user.step].pergunta);
    return;
  }

  if (
    msg.body.match(/(menu|Menu|oi|Oi|Olá|olá|boa|Boa)/i) &&
    msg.from.endsWith("@c.us")
  ) {
    // ... (código do menu inicial inalterado) ...
    const chat = await msg.getChat();
    await delay(3000);
    await chat.sendStateTyping();
    await delay(3000);
    const contact = await msg.getContact();
    const name = contact.pushname || "Usuário";
    await client.sendMessage(
      msg.from,
      `Olá! ${
        name.split(" ")[0]
      } Sou o assistente virtual do Senac-RN EduTech! Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n` +
        `1 - Recuperação de acesso a conta Microsoft\n` +
        `2 - Problemas com Microsoft Authenticator\n` +
        `3 - Consultar meu e-mail institucional\n` +
        `4 - Problema no portal do aluno\n` +
        `5 - Dúvidas sobre cursos e matrículas\n` +
        `6 - Falar com o suporte humano\n`
    );
    await chat.sendStateTyping();
    await delay(3000);
    await client.sendMessage(
      msg.from,
      `Após o envio da mensagem, aguarde. Não reenvie mensagens ou realize ligações, pois alteram a sua vez na fila de espera.\n` +
        `Informamos que o Senac-RN preserva seus dados pessoais de forma segura e transparente, baseado na nova Lei n°13.709/2018 LGPD (Lei Geral de Proteção de Dados).`
    );
    return;
  }

  if (
    ["1", "2", "3", "4", "5", "6"].includes(msg.body) &&
    msg.from.endsWith("@c.us")
  ) {
    const opcao = msg.body;

    if (opcao === "3" || opcao === "5") {
      if (opcao === "3") {
        await client.sendMessage(
          chatId,
          "Para consultar seu e-mail institucional, acesse o link abaixo e informe seu CPF:\n\n🔗 https://salavirtual.rn.senac.br/\n\nLá você verá qual é seu e-mail institucional."
        );
      }
      if (opcao === "5") {
        await client.sendMessage(
          chatId,
          "Informações sobre matrículas e cursos do SENAC-RN você pode entrar em contato com a central de atendimento: (84) 4005-1000 ou pelo site: 🔗 https://www.rn.senac.br/todos-os-cursos"
        );
      }
      await delay(3000);
      await client.sendMessage(
        msg.from,
        'Para retornar ao Menu digite: "menu"'
      );
      return;
    }

    // =================================================================
    //  ALTERADO: LÓGICA DA OPÇÃO 6 PARA CONGELAR O CHAT
    // =================================================================
    if (opcao === "6") {
      if (dentroDoHorario()) {
        const atendente = getAtendenteDaVez();
        if (atendente) {
          const contatoUsuario = await msg.getContact();
          const nomeUsuario = contatoUsuario.pushname || msg.from;
          const numeroUsuario = msg.from.replace("@c.us", "");

          // Mensagem para o grupo atualizada
          const msgParaGrupo =
            `*Novo chamado para atendimento humano!*\n\n` +
            `*Solicitante:* ${nomeUsuario}\n` +
            `*Contato:* ${numeroUsuario}\n\n` +
            `Atenção, @${atendente.id.replace(
              "@c.us",
              ""
            )}! Por favor, assuma o atendimento.\n\n` +
            `*‼️ Bot nesta conversa está congelado.*\n\n` +
            `🧊 Para liberar depois, envie: *!liberarbot ${numeroUsuario}*`;

          await client.sendMessage(ID_GRUPO_SUPORTE, msgParaGrupo, {
            mentions: [atendente.id],
          });

          // Congela o chat adicionando na lista
          chatsCongelados.add(chatId);

          await client.sendMessage(
            chatId,
            `Certo! Notifiquei o(a) atendente *${atendente.atendente}* e ele(a) já está ciente da sua solicitação. Em breve, ele(a) responderá aqui mesmo nesta conversa.`
          );
        } else {
          await client.sendMessage(
            chatId,
            "Estamos em horário de atendimento, mas não encontrei um atendente de plantão na agenda. Por favor, aguarde que logo alguém da equipe irá lhe responder."
          );
        }
      } else {
        await client.sendMessage(
          chatId,
          "Nosso atendimento humano funciona de segunda a sexta-feira, das 08:00 às 21:00. Por favor, entre em contato nesse período."
        );
      }
      return;
    }

    usersData[chatId] = { opcao, step: 0, respostas: [] };
    await client.sendMessage(chatId, fluxos[opcao][0].pergunta);
    return;
  }

  await client.sendMessage(
    chatId,
    'Por favor, digite "menu" para ver as opções disponíveis.'
  );
}

module.exports = handleMessage;
