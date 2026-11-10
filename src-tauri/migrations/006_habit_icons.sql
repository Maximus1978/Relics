ALTER TABLE habits
ADD COLUMN icon_id TEXT NOT NULL DEFAULT 'sigil'
CHECK (icon_id IN (
  'sigil', 'walk', 'strength', 'book', 'language', 'music',
  'bicycle', 'conversation', 'work', 'sleep', 'meditation', 'creativity'
));
