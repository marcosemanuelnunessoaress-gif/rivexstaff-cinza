const { db } = require('../database/db');

function getPeriodoColumns(periodo) {
  if (periodo === 'daily') {
    return {
      msg: 'msg_daily',
      call: 'call_daily'
    };
  }

  if (periodo === 'weekly') {
    return {
      msg: 'msg_weekly',
      call: 'call_weekly'
    };
  }

  if (periodo === 'monthly') {
    return {
      msg: 'msg_monthly',
      call: 'call_monthly'
    };
  }

  return {
    msg: 'msg_total',
    call: 'call_total'
  };
}

function buscarRanking(guildId, tipo = 'total', periodo = 'weekly', limite = 10) {
  const cols = getPeriodoColumns(periodo);

  let orderBy = '';
  if (tipo === 'msg') {
    orderBy = cols.msg;
  } else if (tipo === 'call') {
    orderBy = cols.call;
  } else {
    orderBy = `(${cols.msg} + (${cols.call} / 60.0))`;
  }

  return db.prepare(`
    SELECT
      guild_id,
      user_id,
      msg_daily,
      msg_weekly,
      msg_monthly,
      msg_total,
      call_daily,
      call_weekly,
      call_monthly,
      call_total,
      ${cols.msg} AS periodo_msg,
      ${cols.call} AS periodo_call,
      ${orderBy} AS score
    FROM user_stats
    WHERE guild_id = ?
    ORDER BY score DESC, periodo_msg DESC, periodo_call DESC
    LIMIT ?
  `).all(guildId, limite);
}

module.exports = {
  buscarRanking
};