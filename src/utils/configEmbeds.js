const { EmbedBuilder } = require('discord.js');

function canalOuNaoDefinido(channelId) {
  return channelId ? `<#${channelId}>` : 'Não definido';
}

function criarEmbedLogs(config) {
  return new EmbedBuilder()
    .setTitle('⚙️ Configurações de Logs')
    .setColor(config.embed_color || '#2B2D31')
    .setDescription(
      `🎧 Logs Call: ${canalOuNaoDefinido(config.log_call_channel_id)}\n` +
      `🌐 Logs Geral: ${canalOuNaoDefinido(config.log_general_channel_id)}\n` +
      `</> Logs Comandos: ${canalOuNaoDefinido(config.log_command_channel_id)}\n` +
      `🛡️ Logs Admin: ${canalOuNaoDefinido(config.log_admin_channel_id)}\n\n` +
      `🔔 Para configurar, clique no menu abaixo!`
    )
    .setFooter({ text: config.footer_text || 'Bot de Atividade' })
    .setTimestamp();
}

module.exports = {
  criarEmbedLogs
};