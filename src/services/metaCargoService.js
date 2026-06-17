const { db } = require('../database/db');

function definirMetaCargo(guildId, roleId, dados) {
  db.prepare(`
    INSERT INTO role_goals (
      guild_id, role_id, msg_weekly_goal, msg_monthly_goal
    )
    VALUES (?, ?, ?, ?)
    ON CONFLICT(guild_id, role_id)
    DO UPDATE SET
      msg_weekly_goal = excluded.msg_weekly_goal,
      msg_monthly_goal = excluded.msg_monthly_goal
  `).run(
    guildId,
    roleId,
    dados.msg_weekly_goal ?? 0,
    dados.msg_monthly_goal ?? 0
  );
}

function buscarMetaCargo(guildId, roleId) {
  return db.prepare(`
    SELECT * FROM role_goals
    WHERE guild_id = ? AND role_id = ?
  `).get(guildId, roleId);
}

function listarMetasCargo(guildId) {
  return db.prepare(`
    SELECT * FROM role_goals
    WHERE guild_id = ?
    ORDER BY role_id ASC
  `).all(guildId);
}

module.exports = {
  definirMetaCargo,
  buscarMetaCargo,
  listarMetasCargo
};