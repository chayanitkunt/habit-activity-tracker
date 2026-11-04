CREATE TABLE IF NOT EXISTS activity_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (btrim(name) <> ''),
  description text,
  unit text NOT NULL CHECK (btrim(unit) <> ''),
  min_value numeric(12, 2) NOT NULL CHECK (min_value >= 0),
  max_value numeric(12, 2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activity_templates_value_range_check CHECK (min_value <= max_value)
);

CREATE INDEX IF NOT EXISTS activity_templates_active_catalog_idx ON activity_templates (is_active, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS activity_templates_name_unique ON activity_templates (name);
