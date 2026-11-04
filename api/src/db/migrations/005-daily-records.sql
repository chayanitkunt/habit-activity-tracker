CREATE TABLE IF NOT EXISTS daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  quantity numeric(12, 2) NOT NULL CHECK (quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_records_goal_date_unique UNIQUE (goal_id, activity_date)
);

CREATE INDEX IF NOT EXISTS daily_records_goal_date_idx ON daily_records (goal_id, activity_date);
