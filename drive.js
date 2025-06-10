// drive.js
const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');

// Use as mesmas credenciais do sheets.js
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials', 'google-service-account.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Cole o ID da pasta que você copiou do Google Drive
const PASTA_ID = process.env.ID_PASTA_DRIVE;

/**
 * Faz o upload de uma imagem para o Google Drive e retorna o link compartilhável.
 * @param {string} base64Data O conteúdo da imagem em base64.
 * @param {string} mimeType O tipo MIME da imagem (ex: 'image/png').
 * @param {string} fileName O nome do arquivo a ser salvo.
 * @returns {Promise<string>} O link para visualizar a imagem no Drive.
 */
async function uploadImagem(base64Data, mimeType, fileName) {
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  // Converte a string base64 em um buffer e depois em um stream
  const buffer = Buffer.from(base64Data, 'base64');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  try {
    // 1. Faz o upload do arquivo
    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [PASTA_ID], // Especifica a pasta de destino
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
      fields: 'id,webViewLink', // Pede para a API retornar o ID e o link de visualização
    });

    const fileId = file.data.id;
    const fileLink = file.data.webViewLink;

    // 2. Torna o arquivo público para qualquer um com o link
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log(`Imagem ${fileName} enviada para o Drive com sucesso!`);
    return fileLink; // Retorna o link direto para visualização

  } catch (error) {
    console.error('Erro ao fazer upload para o Google Drive:', error);
    return 'Falha no upload da imagem';
  }
}

module.exports = { uploadImagem };