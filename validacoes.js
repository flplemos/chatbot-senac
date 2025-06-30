function valNome(text) {
    return text.trim().length > 0;
}

function valCPF(text) {
    return /^\d{11}$/.test(text.replace(/\D/g, ''));
}

function valEmail(text) {
    return /\S+@\S+\.\S+/.test(text);
}

// NOVA FUNÇÃO: Valida se é um e-mail com o domínio institucional correto
function valEmailInstitucional(text) {
    // Primeiro, verifica se é um formato de e-mail básico,
    // E depois se termina com '@edum.rn.senac.br' (ignorando maiúsculas/minúsculas)
    return /\S+@\S+\.\S+/.test(text) && text.toLowerCase().endsWith('@edum.rn.senac.br');
}

function valTextoSimples(text) {
    return text.trim().length > 0;
}

function valImagem(msg) {
    return msg.hasMedia;
}

module.exports = {
    valNome,
    valCPF,
    valEmail,
    valTextoSimples,
    valImagem,
    valEmailInstitucional
};
