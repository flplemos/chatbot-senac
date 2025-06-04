function valNome(text) {
    return text.trim().length > 0;
}

function valCPF(text) {
    return /^\d{11}$/.test(text.replace(/\D/g, ''));
}

function valEmail(text) {
    return /\S+@\S+\.\S+/.test(text);
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
    valImagem
};
