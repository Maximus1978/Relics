ALTER TABLE habits ADD COLUMN archived_at TEXT;

CREATE INDEX habits_by_archive ON habits(archived_at);
