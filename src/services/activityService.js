const { db } = require('../database/db');
const { agoraISO } = require('../utils/time');
const { garantirConfigGuild } = require('./configService');

function garantirUserStats(guildId, userId) {
  garantirConfigGuild(guildId);

  const existente = db.prepare(`
    SELECT * FROM user_stats
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId);

  if (!existente) {
    db.prepare(`
      INSERT INTO user_stats (guild_id, user_id)
      VALUES (?, ?)
    `).run(guildId, userId);
  }

  return buscarStats(guildId, userId);
}

function buscarStats(guildId, userId) {
  return db.prepare(`
    SELECT * FROM user_stats
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId);
}

function podeContarMensagem(guildId, userId, cooldownSegundos) {
  const row = db.prepare(`
    SELECT last_message_at
    FROM message_cooldowns
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId);

  if (!row) return true;

  const ultimo = new Date(row.last_message_at).getTime();
  const agora = Date.now();
  const diff = (agora - ultimo) / 1000;

  return diff >= cooldownSegundos;
}

function atualizarCooldownMensagem(guildId, userId) {
  const agora = agoraISO();

  db.prepare(`
    INSERT INTO message_cooldowns (guild_id, user_id, last_message_at)
    VALUES (?, ?, ?)
    ON CONFLICT(guild_id, user_id)
    DO UPDATE SET last_message_at = excluded.last_message_at
  `).run(guildId, userId, agora);
}

function adicionarMensagem(guildId, userId, quantidade = 1) {
  garantirUserStats(guildId, userId);
  const agora = agoraISO();

  db.prepare(`
    UPDATE user_stats
    SET
      msg_daily = msg_daily + ?,
      msg_weekly = msg_weekly + ?,
      msg_monthly = msg_monthly + ?,
      msg_total = msg_total + ?,
      last_message_at = ?,
      last_active_at = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ? AND user_id = ?
  `).run(
    quantidade,
    quantidade,
    quantidade,
    quantidade,
    agora,
    agora,
    guildId,
    userId
  );

  return buscarStats(guildId, userId);
}

function removerMensagem(guildId, userId, quantidade = 1) {
  garantirUserStats(guildId, userId);

  db.prepare(`
    UPDATE user_stats
    SET
      msg_daily = MAX(msg_daily - ?, 0),
      msg_weekly = MAX(msg_weekly - ?, 0),
      msg_monthly = MAX(msg_monthly - ?, 0),
      msg_total = MAX(msg_total - ?, 0),
      updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ? AND user_id = ?
  `).run(
    quantidade,
    quantidade,
    quantidade,
    quantidade,
    guildId,
    userId
  );

  return buscarStats(guildId, userId);
}

function adicionarCallSegundos(guildId, userId, segundos) {
  garantirUserStats(guildId, userId);
  const agora = agoraISO();

  db.prepare(`
    UPDATE user_stats
    SET
      call_daily = call_daily + ?,
      call_weekly = call_weekly + ?,
      call_monthly = call_monthly + ?,
      call_total = call_total + ?,
      last_call_at = ?,
      last_active_at = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ? AND user_id = ?
  `).run(
    segundos,
    segundos,
    segundos,
    segundos,
    agora,
    agora,
    guildId,
    userId
  );

  return buscarStats(guildId, userId);
}

function removerCallSegundos(guildId, userId, segundos) {
  garantirUserStats(guildId, userId);

  db.prepare(`
    UPDATE user_stats
    SET
      call_daily = MAX(call_daily - ?, 0),
      call_weekly = MAX(call_weekly - ?, 0),
      call_monthly = MAX(call_monthly - ?, 0),
      call_total = MAX(call_total - ?, 0),
      updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ? AND user_id = ?
  `).run(
    segundos,
    segundos,
    segundos,
    segundos,
    guildId,
    userId
  );

  return buscarStats(guildId, userId);
}

function resetarPeriodo(guildId, periodo) {
  const mapa = {
    daily: ['msg_daily = 0', 'call_daily = 0'],
    weekly: ['msg_weekly = 0', 'call_weekly = 0'],
    monthly: ['msg_monthly = 0', 'call_monthly = 0']
  };

  if (!mapa[periodo]) throw new Error('Período inválido.');

  const setClause = mapa[periodo].join(', ');

  db.prepare(`
    UPDATE user_stats
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ?
  `).run(guildId);
}

function listarInativos(guildId, limite = 10) {
  return db.prepare(`
    SELECT *
    FROM user_stats
    WHERE guild_id = ?
    ORDER BY last_active_at IS NOT NULL DESC, last_active_at ASC
    LIMIT ?
  `).all(guildId, limite);
}

module.exports = {
  garantirUserStats,
  buscarStats,
  podeContarMensagem,
  atualizarCooldownMensagem,
  adicionarMensagem,
  removerMensagem,
  adicionarCallSegundos,
  removerCallSegundos,
  resetarPeriodo,
  listarInativos
};