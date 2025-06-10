const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Instancia o cliente com autenticação local
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // ou false se quiser ver o navegador abrindo
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Geração do QR Code
client.on("qr", (qr) => {
  console.log("Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

// Logs adicionais úteis
client.on("authenticated", () => console.log("✅ Autenticado com sucesso!"));
client.on("auth_failure", (msg) =>
  console.error("❌ Falha na autenticação:", msg)
);
client.on("disconnected", (reason) =>
  console.warn("⚠️ Cliente desconectado:", reason)
);

// Ao ficar pronto
client.on("ready", async () => {
  console.log("🟢 Cliente pronto! Aguardando carregamento de conversas...");

  // Aguarda 10 segundos para garantir que os chats sejam carregados
  setTimeout(async () => {
    try {
      console.log("🔍 Buscando chats...");
      const chats = await client.getChats();
      console.log(`📦 Total de conversas carregadas: ${chats.length}`);

      // Filtra apenas grupos
      const grupos = chats.filter((chat) => chat.isGroup);

      if (grupos.length === 0) {
        console.log("⚠️ Nenhum grupo encontrado.");
        return;
      }

      // Mostra os primeiros 5 grupos (ou menos, se houver menos que isso)
      console.log(
        `👥 Listando os primeiros ${Math.min(grupos.length, 5)} grupos:`
      );

      grupos.slice(0, 5).forEach((chat, index) => {
        console.log(
          `${index + 1}. Nome: ${chat.name} | ID: ${chat.id._serialized}`
        );
      });
    } catch (erro) {
      console.error("❌ Erro ao buscar os grupos:", erro);
    }
  }, 10000); // aguarda 10 segundos
});

// Inicializa o cliente
client.initialize();
