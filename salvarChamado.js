// 1. Importações necessárias: MongoClient para o DB e o 'adicionarLinha' para o Sheets.
const { MongoClient } = require('mongodb');
const { adicionarLinha } = require('./sheets');
const ID_GRUPO_SUPORTE = process.env.ID_GRUPO_SUPORTE;

// 2. Configurações do Banco de Dados (use as variáveis de ambiente!)
const MONGO_URI = process.env.MONGO_URI; // Sua string de conexão do Atlas virá daqui
const DB_NAME = 'chatbot_senac_db';      // Nome do seu banco de dados
const COLLECTION_NAME = 'chamados';      // Nome da sua coleção (tabela)

// Modifique a assinatura da função para receber o 'client' do WhatsApp
async function salvarChamado(opcao, respostas, chatId, client) { 
  // O objeto 'chamado' que será salvo no MongoDB.
  const chamado = {
    opcao: opcao,
    respostas: respostas,
    chatId: chatId,
    dataRegistro: new Date(),
    status: 'Em aberto' // Adicionando um status inicial
  };

  // Prepara a linha para o Google Sheets (lógica original mantida)
  const linhaSheets = [
    Date.now(),
    chatId,
    respostas[0] || '',
    respostas[1] || '',
    respostas[2] || '',
    respostas[3] || '',
    respostas[4]?.startsWith('http') ? '' : respostas[4] || '',
    respostas[4]?.startsWith('http') ? respostas[4] : '',
    new Date().toLocaleString('pt-BR'),
    'Em aberto',
    '', '', '', ''
  ];

  // 3. Conexão e inserção no MongoDB
  const mongoClient = new MongoClient(MONGO_URI); // Cria um novo cliente
  
  try {
    // --- LÓGICA DO MONGODB ---
    await mongoClient.connect(); // Conecta ao servidor
    const db = mongoClient.db(DB_NAME); // Seleciona o banco de dados
    const collection = db.collection(COLLECTION_NAME); // Seleciona a coleção
    await collection.insertOne(chamado); // Insere o documento do chamado
    console.log('Chamado registrado no MongoDB com sucesso!');

    // --- LÓGICA DO GOOGLE SHEETS (após salvar no DB) ---
    await adicionarLinha(linhaSheets);
    console.log('Chamado registrado na planilha com sucesso!');

    // --- Enviar notificação para o grupo de suporte (após tudo dar certo) ---
    const nomeSolicitante = respostas[0] || 'Não informado';
    const msgParaGrupo = `✅ Novo chamado registrado!\n\n*Solicitante:* ${nomeSolicitante}\n*Status:* Aguardando atendente abrir chamado no GLPI.`;
    
    await client.sendMessage(ID_GRUPO_SUPORTE, msgParaGrupo);
    console.log('Notificação enviada para o grupo de suporte.');

  } catch (err) {
    console.error('Erro ao processar o chamado:', err);
    // Opcional: Enviar uma mensagem de erro para o usuário ou para o suporte
    
  } finally {
    // 4. Garante que a conexão com o banco de dados seja sempre fechada
    await mongoClient.close();
  }
}

module.exports = salvarChamado;