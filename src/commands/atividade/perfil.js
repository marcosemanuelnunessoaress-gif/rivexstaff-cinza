const { SlashCommandBuilder } = require('discord.js');
const { buscarStats, garantirUserStats } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { formatarSegundos } = require('../../utils/time');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Mostra as estatísticas de atividade de um usuário.')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuário para consultar')
        .setRequired(false)
    ),

  async execute(interaction) {
    const alvo = interaction.options.getUser('usuario') || interaction.user;
    const guildId = interaction.guild.id;

    garantirConfigGuild(guildId);
    garantirUserStats(guildId, alvo.id);

    const config = buscarConfigGuild(guildId);
    const stats = buscarStats(guildId, alvo.id);

  const embed = criarEmbed({
  titulo: `<:membro:1495571715617460264> Perfil de ${alvo.username}`,
  cor: config.embed_color,
  footer: config.footer_text,
  descricao: '<:kosame_msg:1495572103016222852> **Mensagens**'
});

embed.addFields(
  {
    name: '<:kosame_nitroboost:1495835242215375061> Hoje',
    value: `**${stats.msg_daily}**`,
    inline: true
  },
  {
    name: '<:kosame_nitroboost:1495835242215375061> Semanal',
    value: `**${stats.msg_weekly}**`,
    inline: true
  },
  {
    name: '<:kosame_nitroboost:1495835242215375061>Mensal',
    value: `**${stats.msg_monthly}**`,
    inline: true
  },
  {
    name: 'Total',
    value: `**${stats.msg_total}**`,
    inline: true
  },

  {
    name: '<:kosame_mic:1495572104651735140> **Chamadas**',
    value: '\u200B',
    inline: false
  },

  {
    name: '<:kosame_speaker:1495835243637243944> Hoje',
    value: `**${formatarSegundos(stats.call_daily)}**`,
    inline: true
  },
  {
    name: '<:kosame_speaker:1495835243637243944> Semanal',
    value: `**${formatarSegundos(stats.call_weekly)}**`,
    inline: true
  },
  {
    name: '<:kosame_speaker:1495835243637243944> Mensal',
    value: `**${formatarSegundos(stats.call_monthly)}**`,
    inline: true
  },
  {
    name: 'Total',
    value: `**${formatarSegundos(stats.call_total)}**`,
    inline: true
  }
);

    await interaction.reply({ embeds: [embed] });
  }
};