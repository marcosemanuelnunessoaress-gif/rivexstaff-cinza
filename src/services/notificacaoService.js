const { db } = require('../database/db');

function jaNotificado(guildId, userId, periodo, tipo) {
  const row = db.prepare(`
    SELECT * FROM goal_notifications
    WHERE guild_id = ? AND user_id = ? AND periodo = ? AND tipo = ?
  `).get(guildId, userId, periodo, tipo);

  return row && row.notified === 1;
}

function marcarNotificado(guildId, userId, periodo, tipo) {
  db.prepare(`
    INSERT INTO goal_notifications (guild_id, user_id, periodo, tipo, notified)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(guild_id, user_id, periodo, tipo)
    DO UPDATE SET notified = 1
  `).run(guildId, userId, periodo, tipo);
}

module.exports = {
  jaNotificado,
  marcarNotificado
};