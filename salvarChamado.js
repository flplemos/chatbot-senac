const fs = require('fs');
const { adicionarLinha } = require('./sheets');
const ID_GRUPO_SUPORTE = '120363140070487039@g.us'; // Adicione o ID do grupo aqui

// Modifique a assinatura da função para receber o 'client'
async function salvarChamado(opcao, respostas, chatId, client) { 
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

  const linha = [
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

  try {
    await adicionarLinha(linha);
    console.log('Chamado registrado na planilha com sucesso!');

    // --- Enviar notificação para o grupo de suporte ---
    const nomeSolicitante = respostas[0] || 'Não informado';
    const msgParaGrupo = `✅ Novo chamado registrado!\n\n*Solicitante:* ${nomeSolicitante}\n*Status:* Aguardando atendente abrir chamado no GLPI.`;
    
    await client.sendMessage(ID_GRUPO_SUPORTE, msgParaGrupo);
    console.log('Notificação enviada para o grupo de suporte.');

  } catch (err) {
    console.error('Erro ao processar o chamado:', err);
  }
}

module.exports = salvarChamado;