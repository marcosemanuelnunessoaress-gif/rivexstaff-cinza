require('dotenv').config();

const { client } = require('./src/client');
const { carregarEventos } = require('./src/handlers/eventHandler');
const { carregarComandos } = require('./src/handlers/commandHandler');
const { initDatabase } = require('./src/database/db');

const { startResetJob } = require('./src/jobs/resetJob');

(async () => {
  try {
    initDatabase();

    startResetJob();

    await carregarEventos(client);
    await carregarComandos(client);

    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('❌ Erro ao iniciar o bot:', error);
  }
})();