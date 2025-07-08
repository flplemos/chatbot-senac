const { uploadImagem } = require("./drive");

const fluxos = require("./fluxos");
const salvarChamado = require("./salvarChamado");
const agenda = require("./agendaSuporte");
const { valImagem } = require("./validacoes");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const ID_GRUPO_SUPORTE = process.env.ID_GRUPO_SUPORTE;

function dentroDoHorario() {
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours();
  const diaUtil = dia >= 1 && dia <= 5;
  const horarioUtil = hora >= 8 && hora < 21;
  return diaUtil && horarioUtil;
}

// Função para buscar atendentes ativos no momento
function getAtendentesDaVez() {
  const agora = new Date();
  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const plantonistasAtivos = agenda.filter(
    (turno) =>
      turno.dia === diaAtual &&
      horaAtual >= turno.horaInicio &&
      horaAtual < turno.horaFim
  );
  return plantonistasAtivos; // Retorna um array de objetos de atendente
}

async function handleMessage(
  msg,
  client,
  usersData,
  chatsCongelados,
  usuariosAtendimentoHumanoLocal
) {
  const chatId = msg.from;

  // Buscando informações de chat e contato UMA única vez
  const chat = await msg.getChat();
  const contact = await msg.getContact();

  // --- Ignorar mensagens de grupos que não são o de suporte ---
  if (chat.isGroup && chatId !== ID_GRUPO_SUPORTE) {
    return;
  }

  if (msg.from === ID_GRUPO_SUPORTE) {
    if (msg.body.toLowerCase().startsWith("!liberarbot ")) {
      const partes = msg.body.split(" ");
      const numeroAlvo = partes[1] ? partes[1].trim() : null;

      if (!numeroAlvo) {
        return await client.sendMessage(
          ID_GRUPO_SUPORTE,
          "⚠️ Formato incorreto. Use: !liberarbot <numero_do_usuario>"
        );
      }
      const chatIdAlvo = `${numeroAlvo}@c.us`;

      if (
        chatsCongelados.has(chatIdAlvo) ||
        usuariosAtendimentoHumanoLocal.has(chatIdAlvo)
      ) {
        chatsCongelados.delete(chatIdAlvo);
        usuariosAtendimentoHumanoLocal.delete(chatIdAlvo);
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `✅ Bot liberado para o usuário ${numeroAlvo}.`
        );
      } else {
        console.log(`Falha ao liberar. ID buscado: ${chatIdAlvo}`);
        console.log("IDs congelados no momento:", Array.from(chatsCongelados));
        await client.sendMessage(
          ID_GRUPO_SUPORTE,
          `⚠️ O bot já estava ativo para o usuário ${numeroAlvo}.`
        );
      }
      return;
    }

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
      return;
    }

    if (msg.body.toLowerCase().startsWith("!listarcongelados")) {
      const listaPlanilha = Array.from(chatsCongelados).map(
        (id) => `🔹 ${id.replace("@c.us", "")}`
      );
      const listaLocal = Array.from(usuariosAtendimentoHumanoLocal).map(
        (id) => `🟢 ${id.replace("@c.us", "")}`
      );

      const resposta =
        `📌 *Usuários congelados (Planilha + Opção 6)*\n\n` +
        `🔷 *Planilha:* ${listaPlanilha.length > 0 ? listaPlanilha.join("\n") : "Nenhum"
        }\n\n` +
        `🟢 *Opção 6 (local):* ${listaLocal.length > 0 ? listaLocal.join("\n") : "Nenhum"
        }`;

      await client.sendMessage(ID_GRUPO_SUPORTE, resposta);
      return;
    }

    return;
  }

  if (chatsCongelados.has(chatId)) {
    // Mensagem opcional avisando que bot está congelado
    // await client.sendMessage(
    //   chatId,
    //   "🤖 O bot está congelado pois você está em atendimento humano. Por favor, aguarde o retorno da equipe."
    // );
    return;
  }

  if (usersData[chatId]) {
    const user = usersData[chatId];
    const passos = fluxos[user.opcao];
    const passoAtual = user.step;

    if (passoAtual >= passos.length) {
      delete usersData[chatId];
      return;
    }

    let valido = false;

    if (
      (user.opcao === "1" || user.opcao === "2" || user.opcao === "4") &&
      passoAtual === fluxos[user.opcao].length - 1
    ) {
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

    if (
      (user.opcao === "1" || user.opcao === "2" || user.opcao === "4") &&
      passoAtual === fluxos[user.opcao].length - 1
    ) {

      const media = await msg.downloadMedia();

      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!tiposPermitidos.includes(media.mimetype)) {
        await client.sendMessage(chatId, '❌ O tipo de arquivo enviado não é uma imagem válida. Envie uma imagem nos formatos JPEG ou PNG.');
        return;
      }

      const fileName = `${chatId}_${Date.now()}.jpeg`;
      const imageUrl = await uploadImagem(media.data, media.mimetype, fileName);

      const isValidUrl = imageUrl && imageUrl.startsWith('http');

      if (!isValidUrl) {
        await client.sendMessage(chatId, '❌ Erro ao enviar a imagem. Tente novamente ou envie outra imagem válida.');
        return; // Encerra aqui, usuário precisa reenviar
      }

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
    await delay(3000);
    await chat.sendStateTyping();
    await delay(3000);

    const name = contact.pushname || "Usuário";

    await client.sendMessage(
      msg.from,
      `Olá! ${name.split(" ")[0]} Sou o assistente virtual do Senac-RN EduTech! Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n` +
      `1 - Recuperação de acesso a conta Microsoft ou Microsoft Teams\n` +
      `2 - Problemas com Microsoft Authenticator\n` +
      `3 - Consultar meu e-mail institucional\n` +
      `4 - Problema no portal do aluno\n` +
      `5 - Dúvidas sobre cursos e matrículas\n` +
      `6 - Outros\n`
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
      await client.sendMessage(msg.from, 'Para retornar ao Menu digite: "menu"');
      return;
    }

    if (opcao === "6") {
      if (dentroDoHorario()) {
        const atendentesAtivos = getAtendentesDaVez();

        if (atendentesAtivos.length > 0) {
          const nomeUsuario = contact.pushname || msg.from;
          const numeroUsuario = msg.from.replace("@c.us", "");

          const mentions = atendentesAtivos.map((a) => a.id);
          const nomesAtendentes = atendentesAtivos
            .map((a) => `*${a.atendente}* (@${a.id.replace("@c.us", "")})`)
            .join(" e ");

          const msgParaGrupo =
            `*Novo chamado para atendimento humano!*\n\n` +
            `*Solicitante:* ${nomeUsuario}\n` +
            `*Contato:* ${numeroUsuario}\n\n` +
            `Atenção, ${nomesAtendentes}! Por favor, assumam o atendimento.\n\n` +
            `*‼️ Bot nesta conversa está congelado.*\n\n` +
            `🧊 Para liberar depois, envie: *!liberarbot ${numeroUsuario}*`;

          await client.sendMessage(ID_GRUPO_SUPORTE, msgParaGrupo, {
            mentions: mentions,
          });

          usuariosAtendimentoHumanoLocal.add(chatId);
          chatsCongelados.add(chatId); // CONGELA IMEDIATAMENTE o bot para o usuário

          let responseToUser = `Certo! Notifiquei `;
          if (atendentesAtivos.length === 1) {
            responseToUser += `o(a) atendente *${atendentesAtivos[0].atendente}*`;
          } else {
            responseToUser += `os(as) atendentes ${atendentesAtivos
              .map((a) => `*${a.atendente}*`)
              .join(" e ")}`;
          }
          responseToUser +=
            ` e ele(s) já está(ão) ciente(s) da sua solicitação. Em breve, ele(s) responderá(ão) aqui mesmo nesta conversa.`;

          await client.sendMessage(chatId, responseToUser);
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
