function valNome(text) {
    return text.trim().length > 0;
}

function valCPF(text) {
  const cpf = text.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // Rejeita se não tem 11 dígitos ou todos os dígitos iguais
  }

  // Valida o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) digito1 = 0;
  if (digito1 !== parseInt(cpf[9])) return false;

  // Valida o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) digito2 = 0;
  if (digito2 !== parseInt(cpf[10])) return false;

  return true;
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
