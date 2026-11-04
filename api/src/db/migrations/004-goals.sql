CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES activity_templates(id),
  target numeric(12, 2) NOT NULL CHECK (target > 0),
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT goals_date_range_check CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS goals_participant_idx ON goals (participant_id, start_date);
CREATE INDEX IF NOT EXISTS goals_template_idx ON goals (template_id);
