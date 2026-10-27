CREATE TABLE habits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL CHECK(length(trim(name)) > 0),
    spheres_json TEXT NOT NULL CHECK(json_valid(spheres_json) AND json_array_length(spheres_json) > 0)
);

CREATE TABLE activities (
    id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL REFERENCES habits(id),
    habit_name_snapshot TEXT NOT NULL,
    spheres_snapshot_json TEXT NOT NULL CHECK(json_valid(spheres_snapshot_json) AND json_array_length(spheres_snapshot_json) > 0),
    occurred_on TEXT NOT NULL CHECK(length(occurred_on) = 10 AND occurred_on GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
    recorded_at TEXT NOT NULL,
    timezone TEXT NOT NULL,
    UNIQUE(habit_id, occurred_on)
);

CREATE INDEX activities_by_day ON activities(occurred_on DESC, recorded_at DESC);
