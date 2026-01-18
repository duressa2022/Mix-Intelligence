CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO organizations (id, name) VALUES ('org-default', 'Default Organization') ON CONFLICT DO NOTHING;

-- Optional: Link users to organizations if you want to switch to relation-based
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id VARCHAR(50) REFERENCES organizations(id);
