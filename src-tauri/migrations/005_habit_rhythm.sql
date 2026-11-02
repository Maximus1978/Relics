-- Additive authoritative history only. No progression counters, no old snapshot edits.
CREATE TABLE habit_frequency_segments (
 id TEXT PRIMARY KEY NOT NULL CHECK(length(trim(id)) BETWEEN 1 AND 256),
 habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE RESTRICT,
 frequency TEXT NOT NULL CHECK(frequency IN ('daily','three_per_week','weekly')),
 effective_on TEXT NOT NULL CHECK(length(effective_on)=10 AND effective_on BETWEEN '0001-01-01' AND '9999-12-31' AND date(effective_on,'+0 days') IS NOT NULL AND date(effective_on,'+0 days')=effective_on),
 created_on TEXT NOT NULL CHECK(length(created_on)=10 AND created_on BETWEEN '0001-01-01' AND '9999-12-31' AND date(created_on,'+0 days') IS NOT NULL AND date(created_on,'+0 days')=created_on),
 version INTEGER NOT NULL CHECK(version=1),
 UNIQUE(habit_id,effective_on),CHECK(effective_on>=created_on)
);
CREATE INDEX habit_frequency_lookup ON habit_frequency_segments(habit_id,effective_on);
CREATE TABLE habit_archive_pauses (
 id TEXT PRIMARY KEY NOT NULL CHECK(length(trim(id)) BETWEEN 1 AND 256),
 habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE RESTRICT,
 start_on TEXT CHECK(start_on IS NULL OR (length(start_on)=10 AND start_on BETWEEN '0001-01-01' AND '9999-12-31' AND date(start_on,'+0 days') IS NOT NULL AND date(start_on,'+0 days')=start_on)),
 end_exclusive_on TEXT CHECK(end_exclusive_on IS NULL OR (length(end_exclusive_on)=10 AND end_exclusive_on BETWEEN '0001-01-01' AND '9999-12-31' AND date(end_exclusive_on,'+0 days') IS NOT NULL AND date(end_exclusive_on,'+0 days')=end_exclusive_on)),
 reason TEXT NOT NULL CHECK(reason='archive'),
 provenance TEXT NOT NULL CHECK(provenance IN ('recorded','legacy_unknown')),
 CHECK((provenance='recorded' AND start_on IS NOT NULL) OR (provenance='legacy_unknown' AND start_on IS NULL)),
 CHECK(start_on IS NULL OR end_exclusive_on IS NULL OR end_exclusive_on>=start_on)
);
CREATE UNIQUE INDEX habit_archive_open ON habit_archive_pauses(habit_id) WHERE end_exclusive_on IS NULL;
CREATE UNIQUE INDEX habit_archive_unknown ON habit_archive_pauses(habit_id) WHERE start_on IS NULL;
CREATE TRIGGER habit_archive_no_overlap_insert BEFORE INSERT ON habit_archive_pauses
WHEN EXISTS(SELECT 1 FROM habit_archive_pauses p WHERE p.habit_id=NEW.habit_id
 AND (NEW.end_exclusive_on IS NULL OR p.start_on IS NULL OR NEW.end_exclusive_on>p.start_on)
 AND (p.end_exclusive_on IS NULL OR NEW.start_on IS NULL OR p.end_exclusive_on>NEW.start_on))
BEGIN SELECT RAISE(ABORT,'Overlapping archive pauses'); END;
CREATE TRIGGER habit_archive_no_overlap_update BEFORE UPDATE ON habit_archive_pauses
WHEN EXISTS(SELECT 1 FROM habit_archive_pauses p WHERE p.id<>OLD.id AND p.habit_id=NEW.habit_id
 AND (NEW.end_exclusive_on IS NULL OR p.start_on IS NULL OR NEW.end_exclusive_on>p.start_on)
 AND (p.end_exclusive_on IS NULL OR NEW.start_on IS NULL OR p.end_exclusive_on>NEW.start_on))
BEGIN SELECT RAISE(ABORT,'Overlapping archive pauses'); END;
-- Old archived_at has no trustworthy local start date. Never guess one.
INSERT INTO habit_archive_pauses(id,habit_id,start_on,end_exclusive_on,reason,provenance)
 SELECT lower(hex(randomblob(16))),id,NULL,NULL,'archive','legacy_unknown' FROM habits WHERE archived_at IS NOT NULL;
