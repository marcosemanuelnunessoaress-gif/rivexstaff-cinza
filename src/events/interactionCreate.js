const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  ChannelType
} = require('discord.js');

const { enviarLog } = require('../utils/logger');
const {
  buscarConfigGuild,
  garantirConfigGuild,
  atualizarCanalLog
} = require('../services/configService');
const { criarEmbed } = require('../utils/embeds');

function canalOuNaoDefinido(channelId) {
  return channelId ? `<#${channelId}>` : 'Não definido';
}

function criarEmbedLogs(config) {
  return criarEmbed({
    titulo: '<:config:1482880474782367744> Configurações de Logs',
    cor: config.embed_color,
    footer: config.footer_text,
    descricao:
      `<:kosame_mic:1495572104651735140> Logs Call: ${canalOuNaoDefinido(config.log_call_channel_id)}\n` +
      `<:kosame_regra:1495826663005753546> Logs Geral: ${canalOuNaoDefinido(config.log_general_channel_id)}\n` +
      `<:kosame_manu:1495826661239820452> Logs Comandos: ${canalOuNaoDefinido(config.log_command_channel_id)}\n` +
      `<:kosame_settings:1495826664175698083> Logs Admin: ${canalOuNaoDefinido(config.log_admin_channel_id)}\n\n` +
      `-# <:kosame_outage:1495827005885906944> Para configurar, clique no menu abaixo!`
  });
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const comando = client.commands.get(interaction.commandName);
        if (!comando) return;

        await comando.execute(interaction, client);

        if (interaction.guild) {
          await enviarLog(client, interaction.guild, 'command', {
            titulo: '⌨️ Comando executado',
            descricao: `<@${interaction.user.id}> usou \`/${interaction.commandName}\``
          });
        }

        return;
      }

      if (!interaction.guild) return;
      garantirConfigGuild(interaction.guild.id);

      if (interaction.isButton()) {
        const config = buscarConfigGuild(interaction.guild.id);

        if (interaction.customId === 'config_logs') {
          const embed = criarEmbedLogs(config);

          const selectTipoLog = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('logs_tipo_select')
              .setPlaceholder('Selecione a log que deseja configurar')
              .addOptions([
                {
                  label: 'Definir Logs Call',
                  description: 'Escolha o canal para logs de call',
                  value: 'call',
                  emoji: '🎧'
                },
                {
                  label: 'Definir Logs Geral',
                  description: 'Escolha o canal para logs gerais',
                  value: 'general',
                  emoji: '🌐'
                },
                {
                  label: 'Definir Logs Comandos',
                  description: 'Escolha o canal para logs de comandos',
                  value: 'command',
                  emoji: '💻'
                },
                {
                  label: 'Definir Logs Admin',
                  description: 'Escolha o canal para logs administrativos',
                  value: 'admin',
                  emoji: '🛡️'
                }
              ])
          );

          return interaction.reply({
            embeds: [embed],
            components: [selectTipoLog],
            ephemeral: true
          });
        }

        if (interaction.customId === 'config_sistema') {
          const embed = criarEmbed({
            titulo: '<:commit:1470816458547265678> Sistema ( Backend )',
            cor: config.embed_color,
            footer: config.footer_text,
            descricao:
              `> Olá! Abaixo está todas as informações do meu sistema!`
          });
    embed.addFields(
      {
        name: '<:7619planet:1495818283042210034> TimeZone',
        value: '`☁️` America/Sao_Paulo',
        inline: true
      },
      {
        name: '<:code_StorM:1470816457519530076> System',
        value: '`🟢` Funcionando',
        inline: true
      },

  {
    name: '<:suporte_Codex:1482877655790649344> Mín Call',
    value: '`🎧` 1 Min',
    inline: true
  },

  {
    name: '<:rocket:1495830214775803957> Cooldown Geral',
    value: '`⏱️` 30 Segundos',
    inline: true
  },

    {
    name: '<:code_StorM:1470816457519530076> Cooldown Comandos',
    value: '`⏱️` 20 Segundos',
    inline: true
  },

    {
    name: '<:sinfo:1482885110813691926> Hospedagem',
    value: '`🟢` Online',
    inline: true
  },
    );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.customId === 'config_modulos') {
          const embed = criarEmbed({
            titulo: '<:emoji_91:1495569481001472113> Módulos do Sistema',
            cor: config.embed_color,
            footer: config.footer_text,
            descricao:
              `> Olá! Abaixo estão os módulos disponíveis no sistema de bate-ponto.`
          });

              embed.addFields(
      {
        name: '<:kosame_msg:1495572103016222852> Mensagens',
        value: '`🟢` Online',
        inline: true
      },
      {
        name: '<:kosame_mic:1495572104651735140> Chamadas',
        value: '`🟢` Online',
        inline: true
      },

  {
    name: '<:kosame_regra:1495826663005753546> Metas',
    value: '`🟢` Online',
    inline: true
  },

  {
    name: '<:kosame_manu:1495826661239820452> Auto-Ranking',
    value: '`🟢` Online',
    inline: true
  }
    );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }

      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'logs_tipo_select') {
          const tipoSelecionado = interaction.values[0];
          const config = buscarConfigGuild(interaction.guild.id);

          const embed = criarEmbed({
            titulo: '⚙️ Configurações de Logs',
            cor: config.embed_color,
            footer: config.footer_text,
            descricao:
              `🎯 Tipo selecionado: **${tipoSelecionado}**\n\n` +
              `> Agora escolha abaixo o canal que será usado para esse log.`
          });

          const canalSelect = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId(`logs_channel_select:${tipoSelecionado}`)
              .setPlaceholder('Selecione um canal')
              .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
              .setMinValues(1)
              .setMaxValues(1)
          );

          return interaction.update({
            embeds: [embed],
            components: [canalSelect]
          });
        }
      }

      if (interaction.isChannelSelectMenu()) {
        if (interaction.customId.startsWith('logs_channel_select:')) {
          const tipo = interaction.customId.split(':')[1];
          const channelId = interaction.values[0];

          atualizarCanalLog(interaction.guild.id, tipo, channelId);

          const novoConfig = buscarConfigGuild(interaction.guild.id);
          const embedAtualizada = criarEmbedLogs(novoConfig);

          const selectTipoLog = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('logs_tipo_select')
              .setPlaceholder('Selecione o tipo de log para configurar')
              .addOptions([
                {
                  label: 'Definir Logs Call',
                  description: 'Escolha o canal para logs de call',
                  value: 'call',
                  emoji: '🎧'
                },
                {
                  label: 'Definir Logs Geral',
                  description: 'Escolha o canal para logs gerais',
                  value: 'general',
                  emoji: '🌐'
                },
                {
                  label: 'Definir Logs Comandos',
                  description: 'Escolha o canal para logs de comandos',
                  value: 'command',
                  emoji: '💻'
                },
                {
                  label: 'Definir Logs Admin',
                  description: 'Escolha o canal para logs administrativos',
                  value: 'admin',
                  emoji: '🛡️'
                }
              ])
          );

          await interaction.update({
            embeds: [embedAtualizada],
            components: [selectTipoLog]
          });

          return interaction.followUp({
            content: '✅ Canal configurado com sucesso.',
            ephemeral: true
          });
        }
      }
    } catch (error) {
      console.error('Erro interaction:', error);

      if (interaction.replied || interaction.deferred) {
        interaction.followUp({
          content: 'Erro ao executar esta interação.',
          ephemeral: true
        }).catch(() => {});
      } else {
        interaction.reply({
          content: 'Erro ao executar esta interação.',
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};