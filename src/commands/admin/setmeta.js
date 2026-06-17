const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { definirMeta } = require('../../services/metaService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmeta')
    .setDescription('Define metas de atividade para um usuário.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('usuario').setDescription('Usuário').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('msg_diaria').setDescription('Meta diária de mensagens').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('msg_semanal').setDescription('Meta semanal de mensagens').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('msg_mensal').setDescription('Meta mensal de mensagens').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('call_diaria_min').setDescription('Meta diária de call em minutos').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('call_semanal_min').setDescription('Meta semanal de call em minutos').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('call_mensal_min').setDescription('Meta mensal de call em minutos').setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const usuario = interaction.options.getUser('usuario');

    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    const meta = definirMeta(guildId, usuario.id, {
      msg_daily_goal: interaction.options.getInteger('msg_diaria'),
      msg_weekly_goal: interaction.options.getInteger('msg_semanal'),
      msg_monthly_goal: interaction.options.getInteger('msg_mensal'),
      call_daily_goal: interaction.options.getInteger('call_diaria_min') * 60,
      call_weekly_goal: interaction.options.getInteger('call_semanal_min') * 60,
      call_monthly_goal: interaction.options.getInteger('call_mensal_min') * 60
    });

    const embed = criarEmbed({
      titulo: '<:1364975619720613959:1475886423918776481> - Metas atualizadas',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `> Metas de <@${usuario.id}> definidas com sucesso.\n\n` +
        `**<:kosame_msg:1495572103016222852> Mensagens**\n` +
        `Diária: ${meta.msg_daily_goal}\n` +
        `Semanal: ${meta.msg_weekly_goal}\n` +
        `Mensal: ${meta.msg_monthly_goal}\n\n` +
        `**<:kosame_speaker:1495835243637243944> Chamadas (min)**\n` +
        `Diária: ${meta.call_daily_goal / 60}\n` +
        `Semanal: ${meta.call_weekly_goal / 60}\n` +
        `Mensal: ${meta.call_monthly_goal / 60}`
    });

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};