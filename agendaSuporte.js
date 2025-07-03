// agendaSuporte.js
const atendentes = {
  manha: { nome: 'Atendente1', id: '5584xxxxxxxx@c.us' },
  tarde: { nome: 'Atendente2', id: '5584xxxxxxxx@c.us' },
  noite: { nome: 'Atendente3', id: '558499223051@c.us' },
  novoAtendente: { nome: 'Atendente4', id: '5584yyyyyyyy@c.us' }, 
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
