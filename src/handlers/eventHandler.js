const fs = require('fs');
const path = require('path');

async function carregarEventos(client) {
  const pastaEventos = path.join(__dirname, '..', 'events');
  const arquivos = fs.readdirSync(pastaEventos).filter(file => file.endsWith('.js'));

  for (const arquivo of arquivos) {
    const caminho = path.join(pastaEventos, arquivo);
    const evento = require(caminho);

    if (!evento.name || !evento.execute) {
      console.warn(`⚠️ Evento ignorado: ${arquivo} (faltando name ou execute)`);
      continue;
    }

    if (evento.once) {
      client.once(evento.name, (...args) => evento.execute(...args, client));
    } else {
      client.on(evento.name, (...args) => evento.execute(...args, client));
    }

    console.log(`📌 Evento carregado: ${evento.name}`);
  }
}

module.exports = { carregarEventos };