const { SlashCommandBuilder } = require('discord.js');
const { listarInativos } = require('../../services/activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inativos')
    .setDescription('Lista usuários menos ativos recentemente.'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    garantirConfigGuild(guildId);
    const config = buscarConfigGuild(guildId);

    const lista = listarInativos(guildId, 10);

    const linhas = lista.map((item, index) => {
      const data = item.last_active_at
        ? `<t:${Math.floor(new Date(item.last_active_at).getTime() / 1000)}:R>`
        : 'Nunca';

      return `${index + 1}. <@${item.user_id}> — Última atividade: **${data}**`;
    });

    const embed = criarEmbed({
      titulo: '<:7619planet:1495818283042210034> Staffs Inativos',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao: linhas.length ? linhas.join('\n') : 'Nenhum dado encontrado.'
    });

    await interaction.reply({ embeds: [embed] });
  }
};