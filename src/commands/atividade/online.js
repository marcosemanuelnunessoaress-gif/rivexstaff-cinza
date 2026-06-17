const { SlashCommandBuilder } = require('discord.js');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('online')
    .setDescription('Mostra quem está em call agora.'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    const emCall = interaction.guild.members.cache
      .filter(member => !member.user.bot && member.voice.channelId)
      .map(member => `• <@${member.id}> em <#${member.voice.channelId}>`);

    const embed = criarEmbed({
      titulo: '`🟢` Usuários em Call',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao: emCall.length ? emCall.join('\n') : 'Ninguém está em call agora.'
    });

    await interaction.reply({ embeds: [embed] });
  }
};