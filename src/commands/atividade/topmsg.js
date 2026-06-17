const { SlashCommandBuilder } = require('discord.js');
const { buscarRanking } = require('../../services/rankingService');
const { buscarConfigGuild, garantirConfigGuild } = require('../../services/configService');
const { criarEmbed } = require('../../utils/embeds');
const { formatarSegundos } = require('../../utils/time');

function nomePeriodo(periodo) {
  if (periodo === 'daily') return 'Diário';
  if (periodo === 'weekly') return 'Semanal';
  if (periodo === 'monthly') return 'Mensal';
  return 'Geral';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topmsg')
    .setDescription('Mostra o ranking de mensagens.')
    .addStringOption(option =>
      option
        .setName('periodo')
        .setDescription('Período do ranking')
        .setRequired(true)
        .addChoices(
          { name: 'Diário', value: 'daily' },
          { name: 'Semanal', value: 'weekly' },
          { name: 'Mensal', value: 'monthly' },
          { name: 'Geral', value: 'total' }
        )
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    garantirConfigGuild(guildId);

    const config = buscarConfigGuild(guildId);
    const periodo = interaction.options.getString('periodo');
    const ranking = buscarRanking(guildId, 'msg', periodo, 10);

    const linhas = await Promise.all(
      ranking.map(async (item, index) => {
        let membro = null;

        try {
          membro = await interaction.guild.members.fetch(item.user_id);
        } catch {
          membro = null;
        }

        const nome = membro ? `<@${item.user_id}>` : `Usuário ${item.user_id}`;

        return `${index + 1}. ${nome} | Msg: ${item.periodo_msg} | Call: ${formatarSegundos(item.periodo_call)}`;
      })
    );

    const embed = criarEmbed({
      titulo: '<:kosame_msg:1495572103016222852> Ranking de Mensagens',
      cor: config.embed_color,
      footer: config.footer_text,
      descricao:
        `<:kosame_list:1495954538740584449> **Período:** ${nomePeriodo(periodo)}\n\n` +
        `${linhas.length ? linhas.join('\n') : 'Nenhum dado encontrado.'}\n\n` +
        `> <:kosame_nitroboost:1495835242215375061> Acima está o rank de usuários da nossa staff!`
    });

    await interaction.reply({ embeds: [embed] });
  }
};