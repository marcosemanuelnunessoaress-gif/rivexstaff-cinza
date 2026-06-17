const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { adicionarMensagem } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmsg')
    .setDescription('Adiciona mensagens manualmente.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('usuario').setDescription('Usuário').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('quantidade').setDescription('Quantidade').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const usuario = interaction.options.getUser('usuario');
    const quantidade = interaction.options.getInteger('quantidade');

    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    const stats = adicionarMensagem(guildId, usuario.id, quantidade);

    const embed = criarEmbed({
      titulo: '<:1364975619720613959:1475886423918776481> - Mensagens adicionadas',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `> Foram adicionadas **${quantidade}** mensagens para <@${usuario.id}>.\n\n` +
        `Hoje: **${stats.msg_daily}**\n` +
        `Semanal: **${stats.msg_weekly}**\n` +
        `Mensal: **${stats.msg_monthly}**\n` +
        `Total: **${stats.msg_total}**`
    });

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};