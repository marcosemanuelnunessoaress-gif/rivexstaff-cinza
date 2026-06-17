const { db } = require('../database/db');
const { agoraISO, diffSegundos } = require('../utils/time');
const { adicionarCallSegundos } = require('./activityService');
const { buscarConfigGuild, garantirConfigGuild } = require('./configService');

function buscarSessaoAtiva(guildId, userId) {
  return db.prepare(`
    SELECT * FROM voice_sessions
    WHERE guild_id = ? AND user_id = ? AND active = 1
    ORDER BY id DESC
    LIMIT 1
  `).get(guildId, userId);
}

function iniciarSessaoCall(guildId, userId, channelId) {
  garantirConfigGuild(guildId);

  const ativa = buscarSessaoAtiva(guildId, userId);
  if (ativa) return ativa;

  const joinedAt = agoraISO();

  const info = db.prepare(`
    INSERT INTO voice_sessions (guild_id, user_id, channel_id, joined_at, active)
    VALUES (?, ?, ?, ?, 1)
  `).run(guildId, userId, channelId, joinedAt);

  return db.prepare(`SELECT * FROM voice_sessions WHERE id = ?`).get(info.lastInsertRowid);
}

function finalizarSessaoCall(guildId, userId) {
  const sessao = buscarSessaoAtiva(guildId, userId);
  if (!sessao) return null;

  const leftAt = agoraISO();
  const duracaoSegundos = diffSegundos(sessao.joined_at, leftAt);

  db.prepare(`
    UPDATE voice_sessions
    SET left_at = ?, duration_seconds = ?, active = 0
    WHERE id = ?
  `).run(leftAt, duracaoSegundos, sessao.id);

  const config = buscarConfigGuild(guildId);

  const minCallSegundos = (config?.min_call_minutes || 1) * 60;
  if (duracaoSegundos >= minCallSegundos) {
    adicionarCallSegundos(guildId, userId, duracaoSegundos);
  }

  return {
    ...sessao,
    left_at: leftAt,
    duration_seconds: duracaoSegundos,
    counted: duracaoSegundos >= minCallSegundos
  };
}

function trocarCanalCall(guildId, userId, novoChannelId) {
  const finalizada = finalizarSessaoCall(guildId, userId);
  const nova = iniciarSessaoCall(guildId, userId, novoChannelId);

  return { finalizada, nova };
}

module.exports = {
  buscarSessaoAtiva,
  iniciarSessaoCall,
  finalizarSessaoCall,
  trocarCanalCall
};