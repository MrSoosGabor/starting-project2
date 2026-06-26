CREATE TABLE note (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content_json TEXT NOT NULL,
  share_enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

CREATE INDEX note_user_id_updated_at_idx ON note (user_id, updated_at DESC);

CREATE TABLE note_share (
  id TEXT PRIMARY KEY NOT NULL,
  note_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  disabled_at TEXT,
  FOREIGN KEY (note_id) REFERENCES note (id) ON DELETE CASCADE
);

CREATE INDEX note_share_note_id_idx ON note_share (note_id);
