const { criarEmbed } = require('./embeds');
const { buscarConfigGuild } = require('../services/configService');

async function enviarLog(client, guild, tipo, dados = {}) {
  try {
    const config = buscarConfigGuild(guild.id);
    if (!config) return;

    let channelId = null;

    if (tipo === 'call') channelId = config.log_call_channel_id;
    else if (tipo === 'command') channelId = config.log_command_channel_id;
    else if (tipo === 'admin') channelId = config.log_admin_channel_id;
    else channelId = config.log_general_channel_id;

    if (!channelId) return;

    const canal = guild.channels.cache.get(channelId);
    if (!canal) return;

    const embed = criarEmbed({
      titulo: dados.titulo || 'Log do Sistema',
      descricao: dados.descricao || 'Sem detalhes.',
      cor: config.embed_color || '#2B2D31',
      footer: config.footer_text || 'Bot de Atividade'
    });

    if (dados.campos?.length) {
      embed.addFields(dados.campos);
    }

    await canal.send({ embeds: [embed] });
  } catch (error) {
    console.error('Erro ao enviar log:', error);
  }
}

module.exports = {
  enviarLog
};