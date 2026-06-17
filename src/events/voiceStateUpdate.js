const { iniciarSessaoCall, finalizarSessaoCall, trocarCanalCall } = require('../services/callService');
const { buscarConfigGuild, garantirConfigGuild } = require('../services/configService');
const { enviarLog } = require('../utils/logger');
const { formatarSegundos } = require('../utils/time');
const { temCargoStaff } = require('../utils/roles');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    if (!newState.guild) return;
    if (newState.member?.user?.bot) return;

    // ✅ só conta call se tiver cargo Staff
    if (!temCargoStaff(newState.member)) return;

    garantirConfigGuild(newState.guild.id);
    const config = buscarConfigGuild(newState.guild.id);

    if (!config.module_calls) return;

    const guildId = newState.guild.id;
    const userId = newState.member.id;
    const guild = newState.guild;

    const antes = oldState.channelId;
    const depois = newState.channelId;

    if (!antes && depois) {
      iniciarSessaoCall(guildId, userId, depois);

      await enviarLog(client, guild, 'call', {
        titulo: '📥 Entrada em call',
        descricao: `<@${userId}> entrou em <#${depois}>.`,
        campos: [
          { name: 'Usuário', value: `<@${userId}>`, inline: true },
          { name: 'Canal', value: `<#${depois}>`, inline: true }
        ]
      });
      return;
    }

    if (antes && !depois) {
      const sessao = finalizarSessaoCall(guildId, userId);
      if (!sessao) return;

      await enviarLog(client, guild, 'call', {
        titulo: '📤 Saída de call',
        descricao: `<@${userId}> saiu da call.`,
        campos: [
          { name: 'Usuário', value: `<@${userId}>`, inline: true },
          { name: 'Canal', value: `<#${antes}>`, inline: true },
          { name: 'Tempo total', value: formatarSegundos(sessao.duration_seconds), inline: true },
          { name: 'Contou?', value: sessao.counted ? 'Sim' : 'Não', inline: true }
        ]
      });
      return;
    }

    if (antes && depois && antes !== depois) {
      const { finalizada } = trocarCanalCall(guildId, userId, depois);

      await enviarLog(client, guild, 'call', {
        titulo: '🔄 Troca de canal de voz',
        descricao: `<@${userId}> trocou de canal.`,
        campos: [
          { name: 'Usuário', value: `<@${userId}>`, inline: true },
          { name: 'Canal anterior', value: `<#${antes}>`, inline: true },
          { name: 'Novo canal', value: `<#${depois}>`, inline: true },
          {
            name: 'Tempo no canal anterior',
            value: finalizada ? formatarSegundos(finalizada.duration_seconds) : '0s',
            inline: true
          }
        ]
      });
    }
  }
};