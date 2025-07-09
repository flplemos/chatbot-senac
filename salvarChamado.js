// 1. Importações necessárias: MongoClient para o DB e o 'adicionarLinha' para o Sheets.
const { MongoClient } = require("mongodb");
const { adicionarLinha, lerStatusChamados } = require("./sheets"); // IMPORTAÇÃO CORRETA
const ID_GRUPO_SUPORTE = process.env.ID_GRUPO_SUPORTE;

const OPCAO_DESCRICOES = {
  '1': 'Recuperação de acesso a conta Microsoft ou Teams',
  '2': 'Problemas com Microsoft Authenticator',
  '3': 'Consultar e-mail institucional',
  '4': 'Problema no portal do aluno',
  '5': 'Dúvidas sobre cursos e matrículas',
  '6': 'Outros'
};


function getDataHoraBrasilia() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife", // ou 'America/Fortaleza' se preferir
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
}

// 2. Configurações do Banco de Dados (use as variáveis de ambiente!)
const MONGO_URI = process.env.MONGO_URI; // Sua string de conexão do Atlas virá daqui
const DB_NAME = "chatbot_senac_db"; // Nome do seu banco de dados
const COLLECTION_NAME = "chamados"; // Nome da sua coleção (tabela)

// Modifique a assinatura da função para receber o 'client' do WhatsApp
async function salvarChamado(opcao, respostas, chatId, client) {
  // O objeto 'chamado' que será salvo no MongoDB.
  const chamado = {
    opcao: opcao,
    respostas: respostas,
    chatId: chatId,
    dataRegistro: new Date(), // formato UTC (ótimo para queries)
    dataLocal: getDataHoraBrasilia(), // formato BR (ótimo para humanos)
    status: "Em aberto", // Adicionando um status inicial
  };

  // Prepara a linha para o Google Sheets
  let linhaSheets = [];

 // NOVO: Obter a descrição da opção
  const opcaoDescricao = OPCAO_DESCRICOES[opcao] || `Opção ${opcao} (Desconhecida)`;

  // Lógica condicional para montar linhaSheets com base na opção
  if (opcao === "4") {
    linhaSheets = [
      Date.now(),
      chatId,
      opcaoDescricao, // NOVO: Adiciona a descrição da opção aqui (índice 2)
      respostas[0] || "", // Nome Completo (agora índice 3)
      respostas[1] || "", // CPF (agora índice 4)
      respostas[2] || "", // Email Pessoal (agora índice 5)
      "",                 // Email Institucional (Vazio, agora índice 6)
      respostas[3] || "", // Descrição do Problema (agora índice 7)
      respostas[4]?.startsWith("http") ? respostas[4] : "", // Print/Foto Erro (agora índice 8)
      getDataHoraBrasilia(),
      "Em aberto",
      "", "", "", ""
    ];
  } else {
    // Para as demais opções (1, 2, etc.), usa a lógica padrão
    linhaSheets = [
      Date.now(),
      chatId,
      opcaoDescricao, // NOVO: Adiciona a descrição da opção aqui (índice 2)
      respostas[0] || "", // Nome (agora índice 3)
      respostas[1] || "", // CPF (agora índice 4)
      respostas[2] || "", // Email Pessoal (agora índice 5)
      respostas[3] || "", // Email Institucional (agora índice 6)
      respostas[4] || "", // Descrição do Problema (agora índice 7)
      respostas[5]?.startsWith("http") ? respostas[5] : "", // URL da Imagem (agora índice 8)
      getDataHoraBrasilia(),
      "Em aberto",
      "", "", "", ""
    ];
  }

  // 3. Conexão e inserção no MongoDB
  const mongoClient = new MongoClient(MONGO_URI); // Cria um novo cliente

  try {
    // --- LÓGICA DO MONGODB ---
    await mongoClient.connect(); // Conecta ao servidor
    const db = mongoClient.db(DB_NAME); // Seleciona o banco de dados
    const collection = db.collection(COLLECTION_NAME); // Seleciona a coleção

    // --- VERIFICAÇÃO NA PLANILHA ---
    const chamados = await lerStatusChamados();

    const chatIdNormalizado = chatId.includes("@c.us")
      ? chatId
      : `${chatId}@c.us`;

    const chamadoExistente = chamados.find(
      (chamado) =>
        (chamado.numero.includes("@c.us")
          ? chamado.numero
          : `${chamado.numero}@c.us`) === chatIdNormalizado &&
        chamado.status === "em aberto"
    );

    if (chamadoExistente) {
      await client.sendMessage(
        chatId,
        "⚠️ Já existe um chamado em aberto para seu número. Por favor, aguarde o atendimento antes de registrar outro."
      );
      console.log(`Chamado duplicado evitado para ${chatId}`);
      return; // Não prossegue com o novo registro
    }

    await collection.insertOne(chamado); // Insere o documento do chamado
    console.log("Chamado registrado no MongoDB com sucesso!");

    // --- LÓGICA DO GOOGLE SHEETS (após salvar no DB) ---
    await adicionarLinha(linhaSheets);
    console.log("Chamado registrado na planilha com sucesso!");

    // --- Enviar notificação para o grupo de suporte (após tudo dar certo) ---
    const nomeSolicitante = respostas[0] || "Não informado";
    const msgParaGrupo = `✅ Novo chamado registrado!\n\n*Solicitante:* ${nomeSolicitante}\n*Status:* Aguardando atendente abrir chamado no GLPI.`;

    await client.sendMessage(ID_GRUPO_SUPORTE, msgParaGrupo);
    console.log("Notificação enviada para o grupo de suporte.");
  } catch (err) {
    console.error("Erro ao processar o chamado:", err);
    // Opcional: Enviar uma mensagem de erro para o usuário ou para o suporte
  } finally {
    // 4. Garante que a conexão com o banco de dados seja sempre fechada
    await mongoClient.close();
  }
}

module.exports = salvarChamado;
