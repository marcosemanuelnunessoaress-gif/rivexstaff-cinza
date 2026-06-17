const { SlashCommandBuilder } = require('discord.js');
const { buscarMeta, garantirMeta } = require('../../services/metaService');
const { buscarStats, garantirUserStats } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { formatarSegundos } = require('../../utils/time');

function progresso(atual, meta) {
  if (!meta || meta <= 0) return 'Sem meta';
  const pct = Math.min(100, Math.floor((atual / meta) * 100));
  return `${pct}%`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meta')
    .setDescription('Mostra as metas do usuário.')
    .addUserOption(option =>
      option.setName('usuario').setDescription('Usuário').setRequired(false)
    ),

  async execute(interaction) {
    const alvo = interaction.options.getUser('usuario') || interaction.user;
    const guildId = interaction.guild.id;

    garantirConfigGuild(guildId);
    garantirUserStats(guildId, alvo.id);
    garantirMeta(guildId, alvo.id);

    const config = buscarConfigGuild(guildId);
    const stats = buscarStats(guildId, alvo.id);
    const meta = buscarMeta(guildId, alvo.id);

    const embed = criarEmbed({
      titulo: `🎯 Metas - ${alvo.username}`,
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `**<:kosame_msg:1495572103016222852> Mensagens**\n` +
        `Diária: **${stats.msg_daily}/${meta.msg_daily_goal}** (${progresso(stats.msg_daily, meta.msg_daily_goal)})\n` +
        `Semanal: **${stats.msg_weekly}/${meta.msg_weekly_goal}** (${progresso(stats.msg_weekly, meta.msg_weekly_goal)})\n` +
        `Mensal: **${stats.msg_monthly}/${meta.msg_monthly_goal}** (${progresso(stats.msg_monthly, meta.msg_monthly_goal)})\n\n` +
        `**<:kosame_speaker:1495835243637243944> Chamadas**\n` +
        `Diária: **${formatarSegundos(stats.call_daily)}/${formatarSegundos(meta.call_daily_goal)}** (${progresso(stats.call_daily, meta.call_daily_goal)})\n` +
        `Semanal: **${formatarSegundos(stats.call_weekly)}/${formatarSegundos(meta.call_weekly_goal)}** (${progresso(stats.call_weekly, meta.call_weekly_goal)})\n` +
        `Mensal: **${formatarSegundos(stats.call_monthly)}/${formatarSegundos(meta.call_monthly_goal)}** (${progresso(stats.call_monthly, meta.call_monthly_goal)})`
    });

    await interaction.reply({ embeds: [embed] });
  }
};