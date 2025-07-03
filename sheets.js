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
    range: 'cabecalhos_chamados!A1:Z1000', // Ajuste se sua aba for diferente
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const numeroIndex = headers.findIndex(h => h.toLowerCase().includes('número'));
  const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status'));

  const chamados = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const numero = row[numeroIndex];
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
