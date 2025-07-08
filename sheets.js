// sheets.js
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials', 'google-service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = process.env.ID_PLANILHA;

async function adicionarLinha(dados) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'cabecalhos_chamados!A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [dados],
    },
  });
}

async function lerStatusChamados() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'cabecalhos_chamados!A1:Z1000',
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];

  const chatIdIndex = headers.findIndex(h => h.toLowerCase().includes('chat id') || h.toLowerCase().includes('id do usuário'));
  const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status'));

  if (chatIdIndex === -1) {
    console.warn("Aviso: Coluna 'ID do Chat' ou 'ID do Usuário' não encontrada no Google Sheet. Verifique os cabeçalhos.");
    return [];
  }
  if (statusIndex === -1) {
    console.warn("Aviso: Coluna 'Status' não encontrada no Google Sheet. Verifique os cabeçalhos.");
    return [];
  }

  const chamados = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const numero = row[chatIdIndex];
    const status = row[statusIndex];
    if (numero && status) {
      chamados.push({ numero, status: status.toLowerCase() });
    }
  }

  return chamados;
}

module.exports = {
  adicionarLinha,
  lerStatusChamados
};
