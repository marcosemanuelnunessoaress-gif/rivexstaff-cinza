const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { isAdministrador } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Abre o painel de configuração do sistema.'),

  async execute(interaction) {
    if (!isAdministrador(interaction.member)) {
      return interaction.reply({
        content: 'Você precisa ser administrador.',
        ephemeral: true
      });
    }

    garantirConfigGuild(interaction.guild.id);
    const config = buscarConfigGuild(interaction.guild.id);

    const embed = criarEmbed({
      titulo: '<:global_StorM:1495569937614241913> Painel de Controle',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao: `> Olá! Seja bem-vindo(a) ao painel de gerenciamento do sistema de bate-ponto da Rivex.`
    });

    embed.addFields(
      {
        name: '<:7619planet:1495818283042210034> Status do Sistema',
        value: '`🟢` Online',
        inline: true
      },
      {
        name: '<:code_StorM:1470816457519530076> Powered by',
        value: '`🏠` Rivex Apps',
        inline: true
      }
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('config_logs')
        .setLabel('Configurações de Logs')
        .setEmoji('<:config:1482880474782367744>')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('config_sistema')
        .setLabel('Sistema')
        .setEmoji('<:commit:1470816458547265678>')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('config_modulos')
        .setLabel('Módulos')
        .setEmoji('<:emoji_91:1495569481001472113>')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};