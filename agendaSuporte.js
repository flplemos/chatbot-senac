// agendaSuporte.js
const atendentes = {
  manha: { nome: 'Felipe', id: '558491203743@c.us' },
  tarde: { nome: 'Paulo', id: '558496391314@c.us' },
  noite: { nome: 'Rafael', id: '558488706966@c.us' },
  novoAtendente: { nome: 'Gustavo', id: '558486339337@c.us' }, 
};

const agenda = [];

for (let dia = 1; dia <= 5; dia++) {
  agenda.push(
    {
      dia,
      horaInicio: 8,
      horaFim: 13,
      atendente: atendentes.manha.nome,
      id: atendentes.manha.id,
    },
    {
      dia,
      horaInicio: 13,
      horaFim: 17,
      atendente: atendentes.tarde.nome,
      id: atendentes.tarde.id,
    },
     {
      dia,
      horaInicio: 14,
      horaFim: 18, // Novo atendente das 14h às 17:59
      atendente: atendentes.novoAtendente.nome,
      id: atendentes.novoAtendente.id,
    },
    {
      dia,
      horaInicio: 17,
      horaFim: 21,
      atendente: atendentes.noite.nome,
      id: atendentes.noite.id,
    }
  );
}

/*
Lembretes:
- O 'dia' segue o padrão do JavaScript: 1=Segunda, 2=Terça, ..., 5=Sexta.
- A 'horaFim' é exclusiva (ex: 13 significa até 12:59).
*/

module.exports = agenda;
