const fs = require('fs');
const { adicionarLinha } = require('./sheets');

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

  const linha = [
    Date.now(), // ID_Chamado
    chatId,     // ChatID_Usuario
    respostas[0] || '',
    respostas[1] || '',
    respostas[2] || '',
    respostas[3] || '',
    respostas[4]?.startsWith('prints') ? '' : respostas[4] || '',
    respostas[4]?.startsWith('prints') ? respostas[4] : '',
    new Date().toLocaleString('pt-BR'),
    'Em aberto',
    '', '', '', ''
  ];

  try {
    await adicionarLinha(linha);
    console.log('Chamado registrado na planilha com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar dados para a planilha:', err);
  }
}

module.exports = salvarChamado;
