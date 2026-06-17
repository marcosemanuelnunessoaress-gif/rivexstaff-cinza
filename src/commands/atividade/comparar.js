const { SlashCommandBuilder } = require('discord.js');
const { buscarStats, garantirUserStats } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { formatarSegundos } = require('../../utils/time');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comparar')
    .setDescription('Compara a atividade de dois usuários.')
    .addUserOption(option =>
      option.setName('usuario1').setDescription('Primeiro usuário').setRequired(true)
    )
    .addUserOption(option =>
      option.setName('usuario2').setDescription('Segundo usuário').setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const usuario1 = interaction.options.getUser('usuario1');
    const usuario2 = interaction.options.getUser('usuario2');

    garantirConfigGuild(guildId);
    garantirUserStats(guildId, usuario1.id);
    garantirUserStats(guildId, usuario2.id);

    const config = buscarConfigGuild(guildId);
    const a = buscarStats(guildId, usuario1.id);
    const b = buscarStats(guildId, usuario2.id);

    const embed = criarEmbed({
      titulo: '<:sinfo:1482885110813691926> Comparação de Atividade',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `**${usuario1.username}**\n` +
        `<:kosame_msg:1495572103016222852> Msg total: **${a.msg_total}**\n` +
        `<:kosame_speaker:1495835243637243944> Call total: **${formatarSegundos(a.call_total)}**\n\n` +
        `**${usuario2.username}**\n` +
        `<:kosame_msg:1495572103016222852> Msg total: **${b.msg_total}**\n` +
        `<:kosame_speaker:1495835243637243944> Call total: **${formatarSegundos(b.call_total)}**`
    });

    await interaction.reply({ embeds: [embed] });
  }
};