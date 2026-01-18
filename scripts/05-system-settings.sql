-- Migration to add system settings
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial settings
INSERT INTO system_settings (key, value, description)
VALUES 
  ('alert_thresholds', '{"low": 0.2, "medium": 0.5, "high": 0.8}', 'Drought anomaly score thresholds for alert levels'),
  ('data_polling', '{"interval_ms": 5000, "enabled": true}', 'Global dashboard data polling configuration'),
  ('regional_sync', '{"auto_ingest": false, "source": "Open-Meteo"}', 'Automatic data ingestion settings')
ON CONFLICT (key) DO NOTHING;
