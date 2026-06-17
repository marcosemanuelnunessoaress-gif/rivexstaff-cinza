require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];

function lerComandos(dir) {
  const itens = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of itens) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      lerComandos(fullPath);
    } else if (item.name.endsWith('.js')) {
      const comando = require(fullPath);
      if (comando.data) {
        commands.push(comando.data.toJSON());
      }
    }
  }
}

lerComandos(path.join(__dirname, 'src', 'commands'));

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();