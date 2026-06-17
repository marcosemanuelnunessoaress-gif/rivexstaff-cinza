CREATE TABLE IF NOT EXISTS guild_configs (
  guild_id TEXT PRIMARY KEY,
  system_name TEXT DEFAULT 'Sistema de Atividade',
  embed_color TEXT DEFAULT '#2B2D31',
  footer_text TEXT DEFAULT 'Bot de Atividade',
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  log_call_channel_id TEXT,
  log_general_channel_id TEXT,
  log_command_channel_id TEXT,
  log_admin_channel_id TEXT,

  week_start_day INTEGER DEFAULT 6,
  count_muted INTEGER DEFAULT 1,
  count_deafened INTEGER DEFAULT 1,
  count_alone_in_call INTEGER DEFAULT 1,
  min_call_minutes INTEGER DEFAULT 1,
  message_cooldown_seconds INTEGER DEFAULT 30,

  module_messages INTEGER DEFAULT 1,
  module_calls INTEGER DEFAULT 1,
  module_goals INTEGER DEFAULT 1,
  module_logs INTEGER DEFAULT 1,
  module_auto_rank INTEGER DEFAULT 1,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  msg_daily INTEGER DEFAULT 0,
  msg_weekly INTEGER DEFAULT 0,
  msg_monthly INTEGER DEFAULT 0,
  msg_total INTEGER DEFAULT 0,

  call_daily INTEGER DEFAULT 0,
  call_weekly INTEGER DEFAULT 0,
  call_monthly INTEGER DEFAULT 0,
  call_total INTEGER DEFAULT 0,

  streak_days INTEGER DEFAULT 0,
  last_message_at TEXT,
  last_call_at TEXT,
  last_active_at TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS voice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  joined_at TEXT NOT NULL,
  left_at TEXT,
  duration_seconds INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS message_cooldowns (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_message_at TEXT NOT NULL,
  PRIMARY KEY (guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT,

  msg_daily_goal INTEGER DEFAULT 0,
  msg_weekly_goal INTEGER DEFAULT 0,
  msg_monthly_goal INTEGER DEFAULT 0,

  call_daily_goal INTEGER DEFAULT 0,
  call_weekly_goal INTEGER DEFAULT 0,
  call_monthly_goal INTEGER DEFAULT 0,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS ignored_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'all',
  UNIQUE(guild_id, channel_id, type)
);

CREATE TABLE IF NOT EXISTS ignored_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'all',
  UNIQUE(guild_id, role_id, type)
);

CREATE TABLE IF NOT EXISTS allowed_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  permission_type TEXT NOT NULL,
  UNIQUE(guild_id, role_id, permission_type)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  executor_id TEXT,
  target_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goal_notifications (
  guild_id TEXT,
  user_id TEXT,
  periodo TEXT,
  tipo TEXT,
  notified INTEGER DEFAULT 0,
  PRIMARY KEY (guild_id, user_id, periodo, tipo)
);

CREATE TABLE IF NOT EXISTS role_goals (
  guild_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  msg_weekly_goal INTEGER DEFAULT 0,
  msg_monthly_goal INTEGER DEFAULT 0,
  PRIMARY KEY (guild_id, role_id)
);