const fs = require('fs');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const credentials = require('./client_secret.json');

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authUrl);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter the code from that page here: ', (code) => {
  readline.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('\n✅ Refresh Token gerado com sucesso!\n');
    console.log('👉 Refresh Token:', token.refresh_token);
    // Salva o token em um arquivo para uso posterior
    fs.writeFileSync('token.json', JSON.stringify(token, null, 2));
    console.log('\n🔒 Token salvo no arquivo token.json\n');
  });
});