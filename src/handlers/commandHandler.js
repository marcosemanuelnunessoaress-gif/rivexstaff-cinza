const fs = require('fs');
const path = require('path');

async function carregarComandos(client) {
  const pastaComandos = path.join(__dirname, '..', 'commands');

  function lerDiretorio(dir) {
    const itens = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of itens) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        lerDiretorio(fullPath);
      } else if (item.name.endsWith('.js')) {
        const comando = require(fullPath);

        if (!comando.data || !comando.execute) {
          console.warn(`⚠️ Comando ignorado: ${item.name} (faltando data ou execute)`);
          continue;
        }

        client.commands.set(comando.data.name, comando);
        console.log(`✅ Comando carregado: ${comando.data.name}`);
      }
    }
  }

  lerDiretorio(pastaComandos);
}

module.exports = { carregarComandos };