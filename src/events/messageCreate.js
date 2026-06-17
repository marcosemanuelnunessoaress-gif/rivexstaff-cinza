const { buscarConfigGuild, garantirConfigGuild } = require('../services/configService');
const {
  podeContarMensagem,
  atualizarCooldownMensagem,
  adicionarMensagem,
  buscarStats
} = require('../services/activityService');
const { buscarMetaCargo } = require('../services/metaCargoService');
const { jaNotificado, marcarNotificado } = require('../services/notificacaoService');
const { temCargoStaff } = require('../utils/roles');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    // só conta se tiver cargo Staff
    if (!temCargoStaff(message.member)) return;

    garantirConfigGuild(message.guild.id);
    const config = buscarConfigGuild(message.guild.id);

    if (!config.module_messages) return;

    const cooldown = config.message_cooldown_seconds || 30;
    const podeContar = podeContarMensagem(
      message.guild.id,
      message.author.id,
      cooldown
    );

    if (!podeContar) return;

    // conta mensagem
    adicionarMensagem(message.guild.id, message.author.id, 1);
    atualizarCooldownMensagem(message.guild.id, message.author.id);

    // sistema de meta
    const stats = buscarStats(message.guild.id, message.author.id);
    const membro = message.member;
    if (!membro) return;

    for (const role of membro.roles.cache.values()) {
      const meta = buscarMetaCargo(message.guild.id, role.id);
      if (!meta) continue;

      // meta semanal
      if (
        meta.msg_weekly_goal > 0 &&
        stats.msg_weekly >= meta.msg_weekly_goal &&
        !jaNotificado(message.guild.id, message.author.id, 'weekly', 'msg')
      ) {
        marcarNotificado(message.guild.id, message.author.id, 'weekly', 'msg');

        await message.author.send(
          '🎉 Parabéns! Você bateu a meta semanal de mensagens!'
        ).catch(() => {});

        const canal = message.guild.channels.cache.find(c => c.name === 'logs');
        if (canal) {
          await canal.send(`🏆 <@${message.author.id}> bateu a meta semanal!`);
        }
      }

      // meta mensal
      if (
        meta.msg_monthly_goal > 0 &&
        stats.msg_monthly >= meta.msg_monthly_goal &&
        !jaNotificado(message.guild.id, message.author.id, 'monthly', 'msg')
      ) {
        marcarNotificado(message.guild.id, message.author.id, 'monthly', 'msg');

        await message.author.send(
          '🔥 Parabéns! Você bateu a meta mensal de mensagens!'
        ).catch(() => {});

        const canal = message.guild.channels.cache.find(c => c.name === 'logs');
        if (canal) {
          await canal.send(`🏆 <@${message.author.id}> bateu a meta mensal!`);
        }
      }
    }
  }
};