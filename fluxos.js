const {
    valNome,
    valCPF,
    valEmail,
    valTextoSimples,
    valImagem
} = require('./validacoes');

const fluxos = {
    '1': [
        { pergunta: 'Por favor, informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional:', valida: valEmail },
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '2': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Agora informe seu CPF (somente números):', valida: valCPF },
        { pergunta: 'Por favor, informe seu email pessoal:', valida: valEmail },
        { pergunta: 'Agora informe seu email institucional:', valida: valEmail },
        { pergunta: 'Por favor, envie uma foto ou print do erro (imagem):', valida: valImagem }
    ],
    '4': [
        { pergunta: 'Informe seu nome completo:', valida: valNome },
        { pergunta: 'Descreva o problema no portal do aluno:', valida: valTextoSimples }
    ]
    // O fluxo para a opção '5' foi removido, pois agora ela tem uma resposta direta em handleMessage.js
};

module.exports = fluxos;