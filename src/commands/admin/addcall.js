const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { adicionarCallSegundos } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { formatarSegundos } = require('../../utils/time');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcall')
    .setDescription('Adiciona tempo de call manualmente.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('usuario').setDescription('Usuário').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('minutos').setDescription('Minutos a adicionar').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const usuario = interaction.options.getUser('usuario');
    const minutos = interaction.options.getInteger('minutos');

    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    const stats = adicionarCallSegundos(guildId, usuario.id, minutos * 60);

    const embed = criarEmbed({
      titulo: '<:1364975619720613959:1475886423918776481> - Tempo Adicionado',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `> Foram adicionados **${minutos} min** para <@${usuario.id}>.\n\n` +
        `Hoje: **${formatarSegundos(stats.call_daily)}**\n` +
        `Semanal: **${formatarSegundos(stats.call_weekly)}**\n` +
        `Mensal: **${formatarSegundos(stats.call_monthly)}**\n` +
        `Total: **${formatarSegundos(stats.call_total)}**`
    });

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};