const cron = require("node-cron");
const { db } = require("../database/db");

function resetDaily() {
  db.prepare(`
    UPDATE user_stats
    SET 
      msg_daily = 0,
      call_daily = 0,
      updated_at = CURRENT_TIMESTAMP
  `).run();

  db.prepare(`
    DELETE FROM goal_notifications
    WHERE periodo = 'daily'
  `).run();

  console.log("[RESET] Diário resetado.");
}

function resetWeekly() {
  db.prepare(`
    UPDATE user_stats
    SET 
      msg_weekly = 0,
      call_weekly = 0,
      updated_at = CURRENT_TIMESTAMP
  `).run();

  db.prepare(`
    DELETE FROM goal_notifications
    WHERE periodo = 'weekly'
  `).run();

  console.log("[RESET] Semanal resetado.");
}

function resetMonthly() {
  db.prepare(`
    UPDATE user_stats
    SET 
      msg_monthly = 0,
      call_monthly = 0,
      updated_at = CURRENT_TIMESTAMP
  `).run();

  db.prepare(`
    DELETE FROM goal_notifications
    WHERE periodo = 'monthly'
  `).run();

  console.log("[RESET] Mensal resetado.");
}

function startResetJob() {
  cron.schedule("0 0 * * *", resetDaily, {
    timezone: "America/Sao_Paulo"
  });

  cron.schedule("0 0 * * 1", resetWeekly, {
    timezone: "America/Sao_Paulo"
  });

  cron.schedule("0 0 1 * *", resetMonthly, {
    timezone: "America/Sao_Paulo"
  });

  console.log("✅ Sistema de reset automático iniciado.");
}

module.exports = {
  startResetJob,
  resetDaily,
  resetWeekly,
  resetMonthly
};