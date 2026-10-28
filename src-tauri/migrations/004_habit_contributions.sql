-- Additive: old activity snapshots stay unknown (NULL).
ALTER TABLE habits ADD COLUMN contribution_profile_json TEXT
 CHECK (contribution_profile_json IS NULL OR CASE WHEN json_valid(contribution_profile_json)
 THEN json_type(contribution_profile_json) = 'object' ELSE 0 END);
ALTER TABLE activities ADD COLUMN contribution_snapshot_json TEXT
 CHECK (contribution_snapshot_json IS NULL OR CASE WHEN json_valid(contribution_snapshot_json)
 THEN json_type(contribution_snapshot_json) = 'object' ELSE 0 END);

-- Fail the migrator's transaction on invalid legacy sphere sets; never guess.
CREATE TEMP TABLE _relics_contribution_validation (valid INTEGER NOT NULL CHECK(valid = 1));
INSERT INTO _relics_contribution_validation
SELECT CASE WHEN json_type(spheres_json) = 'array' AND json_array_length(spheres_json) BETWEEN 1 AND 5
 AND NOT EXISTS (SELECT 1 FROM json_each(spheres_json) WHERE type <> 'text' OR value NOT IN ('body','mind','relationships','work','recovery'))
 AND (SELECT count(DISTINCT value) FROM json_each(spheres_json)) = json_array_length(spheres_json)
 THEN 1 ELSE 0 END FROM habits;
DROP TABLE _relics_contribution_validation;
UPDATE habits SET contribution_profile_json = json_object('version',1,'origin','legacy-default','values',
 json_object('body',CASE WHEN EXISTS(SELECT 1 FROM json_each(spheres_json) WHERE value='body') THEN 5 ELSE 0 END,
 'mind',CASE WHEN EXISTS(SELECT 1 FROM json_each(spheres_json) WHERE value='mind') THEN 5 ELSE 0 END,
 'relationships',CASE WHEN EXISTS(SELECT 1 FROM json_each(spheres_json) WHERE value='relationships') THEN 5 ELSE 0 END,
 'work',CASE WHEN EXISTS(SELECT 1 FROM json_each(spheres_json) WHERE value='work') THEN 5 ELSE 0 END,
 'recovery',CASE WHEN EXISTS(SELECT 1 FROM json_each(spheres_json) WHERE value='recovery') THEN 5 ELSE 0 END));

-- Validate current definitions even across stale/older SQL writers; no silent zero/default coercion.
CREATE TRIGGER contribution_habit_insert BEFORE INSERT ON habits
WHEN COALESCE((json_valid(NEW.contribution_profile_json)
 AND json_type(NEW.contribution_profile_json)='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_profile_json))=3
 AND json_type(NEW.contribution_profile_json,'$.version')='integer' AND json_extract(NEW.contribution_profile_json,'$.version')=1
 AND json_extract(NEW.contribution_profile_json,'$.origin') IN ('user','legacy-default')
 AND json_type(NEW.contribution_profile_json,'$.values')='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_profile_json,'$.values'))=5
 AND json_type(NEW.spheres_json)='array' AND json_array_length(NEW.spheres_json) BETWEEN 1 AND 5
 AND NOT EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE type<>'text' OR value NOT IN ('body','mind','relationships','work','recovery'))
 AND (SELECT count(DISTINCT value) FROM json_each(NEW.spheres_json))=json_array_length(NEW.spheres_json)
 AND (json_type(NEW.contribution_profile_json,'$.values.body')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='body') THEN json_extract(NEW.contribution_profile_json,'$.values.body') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.body')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.body')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.mind')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='mind') THEN json_extract(NEW.contribution_profile_json,'$.values.mind') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.mind')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.mind')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.relationships')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='relationships') THEN json_extract(NEW.contribution_profile_json,'$.values.relationships') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.relationships')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.relationships')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.work')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='work') THEN json_extract(NEW.contribution_profile_json,'$.values.work') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.work')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.work')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.recovery')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='recovery') THEN json_extract(NEW.contribution_profile_json,'$.values.recovery') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.recovery')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.recovery')=0 END)),0)<>1
BEGIN SELECT RAISE(ABORT,'Invalid habit contribution profile'); END;
CREATE TRIGGER contribution_habit_update BEFORE UPDATE OF spheres_json,contribution_profile_json ON habits
WHEN COALESCE((json_valid(NEW.contribution_profile_json)
 AND json_type(NEW.contribution_profile_json)='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_profile_json))=3
 AND json_type(NEW.contribution_profile_json,'$.version')='integer' AND json_extract(NEW.contribution_profile_json,'$.version')=1
 AND json_extract(NEW.contribution_profile_json,'$.origin') IN ('user','legacy-default')
 AND json_type(NEW.contribution_profile_json,'$.values')='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_profile_json,'$.values'))=5
 AND json_type(NEW.spheres_json)='array' AND json_array_length(NEW.spheres_json) BETWEEN 1 AND 5
 AND NOT EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE type<>'text' OR value NOT IN ('body','mind','relationships','work','recovery'))
 AND (SELECT count(DISTINCT value) FROM json_each(NEW.spheres_json))=json_array_length(NEW.spheres_json)
 AND (json_type(NEW.contribution_profile_json,'$.values.body')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='body') THEN json_extract(NEW.contribution_profile_json,'$.values.body') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.body')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.body')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.mind')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='mind') THEN json_extract(NEW.contribution_profile_json,'$.values.mind') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.mind')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.mind')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.relationships')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='relationships') THEN json_extract(NEW.contribution_profile_json,'$.values.relationships') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.relationships')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.relationships')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.work')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='work') THEN json_extract(NEW.contribution_profile_json,'$.values.work') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.work')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.work')=0 END)
 AND (json_type(NEW.contribution_profile_json,'$.values.recovery')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_json) WHERE value='recovery') THEN json_extract(NEW.contribution_profile_json,'$.values.recovery') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_profile_json,'$.origin')='user' OR json_extract(NEW.contribution_profile_json,'$.values.recovery')=5) ELSE json_extract(NEW.contribution_profile_json,'$.values.recovery')=0 END)),0)<>1
BEGIN SELECT RAISE(ABORT,'Invalid habit contribution profile'); END;
CREATE TRIGGER contribution_activity_insert BEFORE INSERT ON activities
WHEN NEW.contribution_snapshot_json IS NOT NULL AND COALESCE((json_valid(NEW.contribution_snapshot_json)
 AND json_type(NEW.contribution_snapshot_json)='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_snapshot_json))=3
 AND json_type(NEW.contribution_snapshot_json,'$.version')='integer' AND json_extract(NEW.contribution_snapshot_json,'$.version')=1
 AND json_extract(NEW.contribution_snapshot_json,'$.origin') IN ('user','legacy-default')
 AND json_type(NEW.contribution_snapshot_json,'$.values')='object'
 AND (SELECT count(*) FROM json_each(NEW.contribution_snapshot_json,'$.values'))=5
 AND json_type(NEW.spheres_snapshot_json)='array' AND json_array_length(NEW.spheres_snapshot_json) BETWEEN 1 AND 5
 AND NOT EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE type<>'text' OR value NOT IN ('body','mind','relationships','work','recovery'))
 AND (SELECT count(DISTINCT value) FROM json_each(NEW.spheres_snapshot_json))=json_array_length(NEW.spheres_snapshot_json)
 AND (json_type(NEW.contribution_snapshot_json,'$.values.body')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE value='body') THEN json_extract(NEW.contribution_snapshot_json,'$.values.body') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_snapshot_json,'$.origin')='user' OR json_extract(NEW.contribution_snapshot_json,'$.values.body')=5) ELSE json_extract(NEW.contribution_snapshot_json,'$.values.body')=0 END)
 AND (json_type(NEW.contribution_snapshot_json,'$.values.mind')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE value='mind') THEN json_extract(NEW.contribution_snapshot_json,'$.values.mind') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_snapshot_json,'$.origin')='user' OR json_extract(NEW.contribution_snapshot_json,'$.values.mind')=5) ELSE json_extract(NEW.contribution_snapshot_json,'$.values.mind')=0 END)
 AND (json_type(NEW.contribution_snapshot_json,'$.values.relationships')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE value='relationships') THEN json_extract(NEW.contribution_snapshot_json,'$.values.relationships') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_snapshot_json,'$.origin')='user' OR json_extract(NEW.contribution_snapshot_json,'$.values.relationships')=5) ELSE json_extract(NEW.contribution_snapshot_json,'$.values.relationships')=0 END)
 AND (json_type(NEW.contribution_snapshot_json,'$.values.work')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE value='work') THEN json_extract(NEW.contribution_snapshot_json,'$.values.work') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_snapshot_json,'$.origin')='user' OR json_extract(NEW.contribution_snapshot_json,'$.values.work')=5) ELSE json_extract(NEW.contribution_snapshot_json,'$.values.work')=0 END)
 AND (json_type(NEW.contribution_snapshot_json,'$.values.recovery')='integer' AND CASE WHEN EXISTS(SELECT 1 FROM json_each(NEW.spheres_snapshot_json) WHERE value='recovery') THEN json_extract(NEW.contribution_snapshot_json,'$.values.recovery') BETWEEN 1 AND 10 AND (json_extract(NEW.contribution_snapshot_json,'$.origin')='user' OR json_extract(NEW.contribution_snapshot_json,'$.values.recovery')=5) ELSE json_extract(NEW.contribution_snapshot_json,'$.values.recovery')=0 END)),0)<>1
BEGIN SELECT RAISE(ABORT,'Invalid activity contribution snapshot'); END;
