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

  const descricaoProblema = respostas[4]?.startsWith('http') ? '' : respostas[4] || '';
  const linkImagem = respostas[4]?.startsWith('http') ? respostas[4] : '';

  const linha = [
    Date.now(),       // ID_Chamado
    chatId,           // ChatID_Usuario
    respostas[0] || '', // Nome
    respostas[1] || '', // CPF
    respostas[2] || '', // Email Pessoal
    respostas[3] || '', // Email Institucional
    descricaoProblema,  // Descrição (se não for link)
    linkImagem,         // Link da Imagem (se for link)
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
