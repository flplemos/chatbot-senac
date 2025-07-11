const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const stream = require('stream');

const PASTA_ID = process.env.ID_PASTA_DRIVE;

const CREDENTIALS_PATH = path.join(__dirname, 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Carrega as credenciais OAuth2
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
const { client_secret, client_id, redirect_uris } = credentials.installed;

// Cria o cliente OAuth2
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Carrega o token salvo e configura as credenciais
const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
oAuth2Client.setCredentials(token);

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

async function uploadImagem(base64Data, mimeType, fileName) {
  const buffer = Buffer.from(base64Data, 'base64');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  try {
    // Faz upload do arquivo para a pasta especificada
    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [PASTA_ID],
        mimeType,
      },
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: 'id, webViewLink',
    });

    // Define permissão para leitura pública
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log(`Imagem ${fileName} enviada para o Drive com sucesso!`);
    return file.data.webViewLink;

  } catch (error) {
    console.error('Erro ao fazer upload para o Google Drive:', error);
    return 'Falha no upload da imagem';
  }
}

module.exports = { uploadImagem };