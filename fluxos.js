const {
    valNome,
    valCPF,
    valEmail,
    valTextoSimples,
    valImagem,
    valEmailInstitucional
} = require('./validacoes');

const fluxos = {
    '1': [
        { pergunta: 'Por favor, informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional (o e-mail institucional é aquele que termina com @edum.rn.senac.br):', valida: valEmailInstitucional },
        { pergunta: 'Descreva brevemente o seu problema (Em uma única mensagem!):', valida: valTextoSimples }, // Novo passo aqui!
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '2': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional (o e-mail institucional é aquele que termina com @edum.rn.senac.br):', valida: valEmailInstitucional },
        { pergunta: 'Descreva brevemente o seu problema (Em uma única mensagem!):', valida: valTextoSimples }, // Novo passo aqui!
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '4': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF }, // Adicionado
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail }, // Adicionado
        { pergunta: 'Descreva o problema no portal do aluno (Em uma única mensagem!):', valida: valTextoSimples },
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem } // Adicionado
    ]
    // O fluxo para a opção '5' foi removido, pois agora ela tem uma resposta direta em handleMessage.js
};

module.exports = fluxos;