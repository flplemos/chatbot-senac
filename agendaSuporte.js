// agendaSuporte.js
// Horários de Segunda a Sexta para 3 atendentes.

const agenda = [
    // --- SEGUNDA-FEIRA (dia: 1) ---
    { dia: 1, horaInicio: 8, horaFim: 13, atendente: 'NOME_ATENDENTE_MANHA', id: '55849xxxxxxxx@c.us' },
    { dia: 1, horaInicio: 13, horaFim: 17, atendente: 'NOME_ATENDENTE_TARDE', id: '55849yyyyyyyy@c.us' },
    { dia: 1, horaInicio: 17, horaFim: 21, atendente: 'NOME_ATENDENTE_NOITE', id: '55849zzzzzzzz@c.us' },

    // --- TERÇA-FEIRA (dia: 2) ---
    { dia: 2, horaInicio: 8, horaFim: 13, atendente: 'NOME_ATENDENTE_MANHA', id: '55849xxxxxxxx@c.us' },
    { dia: 2, horaInicio: 13, horaFim: 17, atendente: 'NOME_ATENDENTE_TARDE', id: '55849yyyyyyyy@c.us' },
    { dia: 2, horaInicio: 17, horaFim: 21, atendente: 'NOME_ATENDENTE_NOITE', id: '55849zzzzzzzz@c.us' },

    // --- QUARTA-FEIRA (dia: 3) ---
    { dia: 3, horaInicio: 8, horaFim: 13, atendente: 'NOME_ATENDENTE_MANHA', id: '55849xxxxxxxx@c.us' },
    { dia: 3, horaInicio: 13, horaFim: 17, atendente: 'NOME_ATENDENTE_TARDE', id: '55849yyyyyyyy@c.us' },
    { dia: 3, horaInicio: 17, horaFim: 21, atendente: 'NOME_ATENDENTE_NOITE', id: '55849zzzzzzzz@c.us' },

    // --- QUINTA-FEIRA (dia: 4) ---
    { dia: 4, horaInicio: 8, horaFim: 13, atendente: 'NOME_ATENDENTE_MANHA', id: '55849xxxxxxxx@c.us' },
    { dia: 4, horaInicio: 13, horaFim: 17, atendente: 'NOME_ATENDENTE_TARDE', id: '55849yyyyyyyy@c.us' },
    { dia: 4, horaInicio: 17, horaFim: 21, atendente: 'NOME_ATENDENTE_NOITE', id: '55849zzzzzzzz@c.us' },

    // --- SEXTA-FEIRA (dia: 5) ---
    { dia: 5, horaInicio: 8, horaFim: 13, atendente: 'NOME_ATENDENTE_MANHA', id: '55849xxxxxxxx@c.us' },
    { dia: 5, horaInicio: 13, horaFim: 17, atendente: 'NOME_ATENDENTE_TARDE', id: '55849yyyyyyyy@c.us' },
    { dia: 5, horaInicio: 17, horaFim: 21, atendente: 'NOME_ATENDENTE_NOITE', id: '55849zzzzzzzz@c.us' },
];

/*
Lembretes:
- O 'dia' segue o padrão do JavaScript: 1=Segunda, 2=Terça, ..., 5=Sexta.
- A 'horaFim' é exclusiva. Um turno com `horaFim: 13` termina às 12:59:59.
*/

module.exports = agenda;