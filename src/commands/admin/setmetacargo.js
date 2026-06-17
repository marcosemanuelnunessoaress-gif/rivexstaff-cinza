const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags
} = require('discord.js');

const { definirMetaCargo, buscarMetaCargo } = require('../../services/metaCargoService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmetacargo')
    .setDescription('Define metas de mensagens para um cargo.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option
        .setName('cargo')
        .setDescription('Cargo que receberá a meta')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('meta_semanal')
        .setDescription('Meta semanal de mensagens')
        .setRequired(true)
        .setMinValue(0)
    )
    .addIntegerOption(option =>
      option
        .setName('meta_mensal')
        .setDescription('Meta mensal de mensagens')
        .setRequired(true)
        .setMinValue(0)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const cargo = interaction.options.getRole('cargo');
    const metaSemanal = interaction.options.getInteger('meta_semanal');
    const metaMensal = interaction.options.getInteger('meta_mensal');

    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    definirMetaCargo(guildId, cargo.id, {
      msg_weekly_goal: metaSemanal,
      msg_monthly_goal: metaMensal
    });

    const metaAtualizada = buscarMetaCargo(guildId, cargo.id);

    const embed = criarEmbed({
      titulo: '🎯 Meta por cargo configurada',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `As metas do cargo ${cargo} foram atualizadas com sucesso.\n\n` +
        `**<:kosame_msg:1495572103016222852> Meta semanal:** ${metaAtualizada.msg_weekly_goal}\n` +
        `**<:kosame_regra:1495826663005753546> Meta mensal:** ${metaAtualizada.msg_monthly_goal}`
    });

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};