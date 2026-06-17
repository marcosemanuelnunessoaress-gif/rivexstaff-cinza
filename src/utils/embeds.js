const { EmbedBuilder } = require('discord.js');

function criarEmbed({ titulo, descricao, cor = '#2B2D31', footer = 'Bot de Atividade' }) {
  return new EmbedBuilder()
    .setTitle(titulo)
    .setDescription(descricao || null)
    .setColor(cor)
    .setFooter({ text: footer })
    .setTimestamp();
}

function criarErroEmbed(mensagem) {
  return new EmbedBuilder()
    .setColor('#ff4d4d')
    .setTitle('❌ Erro')
    .setDescription(mensagem)
    .setTimestamp();
}

function criarSucessoEmbed(mensagem) {
  return new EmbedBuilder()
    .setColor('#57F287')
    .setTitle('✅ Sucesso')
    .setDescription(mensagem)
    .setTimestamp();
}

module.exports = {
  criarEmbed,
  criarErroEmbed,
  criarSucessoEmbed
};