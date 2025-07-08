require("dotenv").config();
const validarEnv = require('./envValidator');
validarEnv();
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const handleMessage = require("./handleMessage");
const usersData = {};
const chatsCongelados = new Set();

// 🔥 Novo Set para armazenar congelamentos locais (ex: opção 6)
const usuariosAtendimentoHumanoLocal = new Set();

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp conectado!");
});

client.on("message", async (msg) => {
  await handleMessage(
    msg,
    client,
    usersData,
    chatsCongelados,
    usuariosAtendimentoHumanoLocal
  );
});

const { lerStatusChamados } = require("./sheets");

async function atualizarStatusDosChats() {
  try {
    const chamados = await lerStatusChamados();

    const novosChats = new Set();

    chamados.forEach(({ numero, status }) => {
      const chatId = numero.includes("@c.us") ? numero : `${numero}@c.us`;
      if (status === "em andamento") {
        novosChats.add(chatId);
      }
    });

    // Atualiza apenas os chats congelados pela planilha
    chatsCongelados.clear();
    novosChats.forEach((chatId) => chatsCongelados.add(chatId));

    // NOTA: Não adicionamos os locais aqui para manter separação clara

  } catch (err) {
    console.error("Erro ao atualizar status dos chats:", err.message);
  }
}

// Atualiza a cada 30 segundos
setInterval(atualizarStatusDosChats, 30000);

client.initialize();

module.exports = {
  chatsCongelados,
  usuariosAtendimentoHumanoLocal,
  atualizarStatusDosChats,
};
