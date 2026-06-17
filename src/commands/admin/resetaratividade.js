const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { resetarPeriodo } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

function nomePeriodo(periodo) {
  if (periodo === 'daily') return 'diário';
  if (periodo === 'weekly') return 'semanal';
  return 'mensal';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetaratividade')
    .setDescription('Reseta estatísticas de atividade.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName('periodo')
        .setDescription('Período para resetar')
        .setRequired(true)
        .addChoices(
          { name: 'Diário', value: 'daily' },
          { name: 'Semanal', value: 'weekly' },
          { name: 'Mensal', value: 'monthly' }
        )
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const periodo = interaction.options.getString('periodo');

    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    resetarPeriodo(guildId, periodo);

    const embed = criarEmbed({
      titulo: '<:1364975619720613959:1475886423918776481> - Atividade resetada',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao: `As estatísticas do período **${nomePeriodo(periodo)}** foram resetadas com sucesso.`
    });

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};