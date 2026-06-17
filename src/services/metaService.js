const { db } = require('../database/db');

function garantirMeta(guildId, userId = null) {
  const existente = db.prepare(`
    SELECT * FROM goals
    WHERE guild_id = ? AND user_id IS ?
  `).get(guildId, userId);

  if (!existente) {
    db.prepare(`
      INSERT INTO goals (
        guild_id, user_id,
        msg_daily_goal, msg_weekly_goal, msg_monthly_goal,
        call_daily_goal, call_weekly_goal, call_monthly_goal
      )
      VALUES (?, ?, 0, 0, 0, 0, 0, 0)
    `).run(guildId, userId);
  }

  return buscarMeta(guildId, userId);
}

function buscarMeta(guildId, userId = null) {
  return db.prepare(`
    SELECT * FROM goals
    WHERE guild_id = ? AND user_id IS ?
  `).get(guildId, userId);
}

function definirMeta(guildId, userId, dados) {
  garantirMeta(guildId, userId);

  db.prepare(`
    UPDATE goals
    SET
      msg_daily_goal = ?,
      msg_weekly_goal = ?,
      msg_monthly_goal = ?,
      call_daily_goal = ?,
      call_weekly_goal = ?,
      call_monthly_goal = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ? AND user_id IS ?
  `).run(
    dados.msg_daily_goal ?? 0,
    dados.msg_weekly_goal ?? 0,
    dados.msg_monthly_goal ?? 0,
    dados.call_daily_goal ?? 0,
    dados.call_weekly_goal ?? 0,
    dados.call_monthly_goal ?? 0,
    guildId,
    userId
  );

  return buscarMeta(guildId, userId);
}

module.exports = {
  garantirMeta,
  buscarMeta,
  definirMeta
};