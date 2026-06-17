const { db } = require('../database/db');

function garantirConfigGuild(guildId) {
  const existente = db.prepare('SELECT * FROM guild_configs WHERE guild_id = ?').get(guildId);

  if (!existente) {
    db.prepare(`
      INSERT INTO guild_configs (guild_id)
      VALUES (?)
    `).run(guildId);
  }

  return buscarConfigGuild(guildId);
}

function buscarConfigGuild(guildId) {
  return db.prepare('SELECT * FROM guild_configs WHERE guild_id = ?').get(guildId);
}

function atualizarConfigGuild(guildId, campo, valor) {
  const camposPermitidos = [
    'system_name',
    'embed_color',
    'footer_text',
    'timezone',
    'log_call_channel_id',
    'log_general_channel_id',
    'log_command_channel_id',
    'log_admin_channel_id',
    'week_start_day',
    'count_muted',
    'count_deafened',
    'count_alone_in_call',
    'min_call_minutes',
    'message_cooldown_seconds',
    'module_messages',
    'module_calls',
    'module_goals',
    'module_logs',
    'module_auto_rank'
  ];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`Campo de config inválido: ${campo}`);
  }

  garantirConfigGuild(guildId);

  db.prepare(`
    UPDATE guild_configs
    SET ${campo} = ?, updated_at = CURRENT_TIMESTAMP
    WHERE guild_id = ?
  `).run(valor, guildId);

  return buscarConfigGuild(guildId);
}

function mapearCampoLog(tipo) {
  const mapa = {
    call: 'log_call_channel_id',
    general: 'log_general_channel_id',
    command: 'log_command_channel_id',
    admin: 'log_admin_channel_id'
  };

  return mapa[tipo] || null;
}

function atualizarCanalLog(guildId, tipo, channelId) {
  const campo = mapearCampoLog(tipo);

  if (!campo) {
    throw new Error('Tipo de log inválido.');
  }

  return atualizarConfigGuild(guildId, campo, channelId);
}

module.exports = {
  garantirConfigGuild,
  buscarConfigGuild,
  atualizarConfigGuild,
  atualizarCanalLog,
  mapearCampoLog
};