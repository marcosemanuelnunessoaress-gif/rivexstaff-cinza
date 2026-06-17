const { garantirConfigGuild } = require('../services/configService');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    garantirConfigGuild(guild.id);
    console.log(`📥 Nova guild configurada: ${guild.name} (${guild.id})`);
  }
};