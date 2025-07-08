function validarVariaveisObrigatorias() {
  const obrigatorias = [
    'MONGO_URI',
    'ID_PLANILHA',
    'ID_PASTA_DRIVE',
    'ID_GRUPO_SUPORTE'
  ];

  const faltando = obrigatorias.filter((key) => !process.env[key]);

  if (faltando.length > 0) {
    console.error(`❌ Variáveis de ambiente faltando: ${faltando.join(', ')}`);
    process.exit(1); // Encerra o processo imediatamente
  }
}

module.exports = validarVariaveisObrigatorias;
