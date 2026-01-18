-- Comprehensive Drought Prediction and Monitoring System Schema
-- Production-ready with proper indexing, constraints, and audit fields

-- ==================== USERS AND AUTH ====================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- admin, scientist, manager, user
  organization VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ==================== GEOGRAPHIC REGIONS ====================
CREATE TABLE IF NOT EXISTS regions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  area_sq_km NUMERIC(15, 2),
  population INT,
  administrative_level VARCHAR(50), -- country, state, district, watershed
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_country ON regions(country);
CREATE INDEX idx_regions_is_active ON regions(is_active);
CREATE INDEX idx_regions_location ON regions(latitude, longitude);

-- ==================== WEATHER DATA ====================
CREATE TABLE IF NOT EXISTS weather_data (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  temperature_celsius NUMERIC(5, 2),
  humidity_percentage NUMERIC(5, 2),
  precipitation_mm NUMERIC(10, 2),
  wind_speed_kmh NUMERIC(6, 2),
  pressure_hpa NUMERIC(7, 2),
  solar_radiation_w_per_m2 NUMERIC(8, 2),
  evapotranspiration_mm NUMERIC(8, 2),
  data_source VARCHAR(100), -- OpenWeather, NOAA, ERA5, etc.
  quality_flag VARCHAR(50) DEFAULT 'good',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weather_region_timestamp ON weather_data(region_id, timestamp DESC);
CREATE INDEX idx_weather_timestamp ON weather_data(timestamp DESC);
CREATE INDEX idx_weather_data_source ON weather_data(data_source);

-- ==================== SATELLITE DATA ====================
CREATE TABLE IF NOT EXISTS satellite_data (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  ndvi NUMERIC(4, 3), -- Normalized Difference Vegetation Index (-1 to 1)
  ndmi NUMERIC(4, 3), -- Normalized Difference Moisture Index
  svi NUMERIC(4, 3), -- Soil Vegetation Index
  lst_celsius NUMERIC(6, 2), -- Land Surface Temperature
  evi NUMERIC(4, 3), -- Enhanced Vegetation Index
  cloud_cover_percentage NUMERIC(5, 2),
  satellite_name VARCHAR(50), -- Landsat, Sentinel, MODIS, etc.
  resolution_meters INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_satellite_region_timestamp ON satellite_data(region_id, timestamp DESC);
CREATE INDEX idx_satellite_ndvi ON satellite_data(ndvi);
CREATE INDEX idx_satellite_timestamp ON satellite_data(timestamp DESC);

-- ==================== SOIL AND HYDROLOGICAL DATA ====================
CREATE TABLE IF NOT EXISTS soil_data (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  soil_moisture_percentage NUMERIC(5, 2),
  soil_temperature_celsius NUMERIC(5, 2),
  groundwater_level_meters NUMERIC(8, 2),
  soil_type VARCHAR(100),
  wilting_point_percentage NUMERIC(5, 2),
  field_capacity_percentage NUMERIC(5, 2),
  available_water_capacity_mm NUMERIC(8, 2),
  data_source VARCHAR(100), -- SMAP, SMOS, In-situ stations, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_soil_region_timestamp ON soil_data(region_id, timestamp DESC);
CREATE INDEX idx_soil_moisture ON soil_data(soil_moisture_percentage);

-- ==================== WATER RESOURCES ====================
CREATE TABLE IF NOT EXISTS water_resources (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  reservoir_level_meters NUMERIC(8, 2),
  reservoir_capacity_cubic_meters NUMERIC(18, 0),
  river_discharge_cubic_meters_per_sec NUMERIC(10, 2),
  groundwater_volume_cubic_km NUMERIC(10, 2),
  water_use_agricultural_million_cubic_m NUMERIC(10, 2),
  water_use_industrial_million_cubic_m NUMERIC(10, 2),
  water_use_municipal_million_cubic_m NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_water_resources_region_timestamp ON water_resources(region_id, timestamp DESC);
CREATE INDEX idx_water_resources_reservoir_level ON water_resources(reservoir_level_meters);

-- ==================== DROUGHT INDICES ====================
CREATE TABLE IF NOT EXISTS drought_indices (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  spi_3month NUMERIC(5, 2), -- Standardized Precipitation Index (3-month)
  spi_6month NUMERIC(5, 2),
  spi_12month NUMERIC(5, 2),
  spei_1month NUMERIC(5, 2), -- Standardized Precipitation Evapotranspiration Index
  spei_3month NUMERIC(5, 2),
  pdsi NUMERIC(5, 2), -- Palmer Drought Severity Index
  vci NUMERIC(5, 2), -- Vegetation Condition Index
  tci NUMERIC(5, 2), -- Temperature Condition Index
  vhi NUMERIC(5, 2), -- Vegetation Health Index
  sdi NUMERIC(5, 2), -- Soil Drought Index
  dvi NUMERIC(5, 2), -- Drought Vulnerability Index
  drought_category VARCHAR(50), -- Normal, Mild, Moderate, Severe, Extreme
  confidence_score NUMERIC(5, 2), -- 0-1 confidence in predictions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drought_indices_region_timestamp ON drought_indices(region_id, timestamp DESC);
CREATE INDEX idx_drought_indices_category ON drought_indices(drought_category);
CREATE INDEX idx_drought_indices_dvi ON drought_indices(dvi DESC);

-- ==================== PREDICTIONS ====================
CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  forecast_date TIMESTAMP NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  drought_probability_percentage NUMERIC(5, 2),
  predicted_severity VARCHAR(50), -- Normal, Mild, Moderate, Severe, Extreme
  confidence_level NUMERIC(5, 2), -- 0-1
  model_name VARCHAR(100), -- LSTM, RandomForest, XGBoost, etc.
  model_version VARCHAR(50),
  precipitation_forecast_mm NUMERIC(10, 2),
  temperature_forecast_celsius NUMERIC(5, 2),
  key_factors JSON, -- JSON array of factors contributing to prediction
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_predictions_region_valid_date ON predictions(region_id, valid_from, valid_until);
CREATE INDEX idx_predictions_forecast_date ON predictions(forecast_date DESC);
CREATE INDEX idx_predictions_severity ON predictions(predicted_severity);
CREATE INDEX idx_predictions_probability ON predictions(drought_probability_percentage DESC);

-- ==================== ALERTS AND NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- drought_warning, extreme_event, resource_low, etc.
  severity_level VARCHAR(50), -- low, medium, high, critical
  title VARCHAR(255),
  message TEXT,
  trigger_threshold NUMERIC(8, 2),
  trigger_value NUMERIC(8, 2),
  trigger_metric VARCHAR(100), -- spi, vhi, reservoir_level, etc.
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_region_active ON alerts(region_id, is_active);
CREATE INDEX idx_alerts_severity ON alerts(severity_level);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_alert_type ON alerts(alert_type);

-- ==================== ALERT SUBSCRIPTIONS ====================
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  alert_type VARCHAR(50),
  severity_threshold VARCHAR(50), -- low, medium, high, critical
  notification_method VARCHAR(50), -- email, sms, push, in_app
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alert_subscriptions_user_region ON alert_subscriptions(user_id, region_id);
CREATE INDEX idx_alert_subscriptions_enabled ON alert_subscriptions(is_enabled);

-- ==================== MITIGATION STRATEGIES ====================
CREATE TABLE IF NOT EXISTS mitigation_strategies (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  strategy_type VARCHAR(100), -- irrigation, crop_selection, water_conservation, policy, etc.
  implementation_status VARCHAR(50), -- planned, ongoing, completed
  effectiveness_score NUMERIC(5, 2), -- 0-1 scale
  cost_estimate NUMERIC(15, 2),
  start_date DATE,
  end_date DATE,
  responsible_agency VARCHAR(255),
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mitigation_strategies_region_status ON mitigation_strategies(region_id, implementation_status);

-- ==================== IMPACT ASSESSMENTS ====================
CREATE TABLE IF NOT EXISTS impact_assessments (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  assessment_date TIMESTAMP NOT NULL,
  drought_index_value NUMERIC(8, 2),
  affected_population INT,
  affected_agricultural_area_sq_km NUMERIC(12, 2),
  water_deficit_cubic_meters NUMERIC(15, 0),
  estimated_economic_loss NUMERIC(18, 2),
  livestock_affected INT,
  crop_yield_impact_percentage NUMERIC(5, 2),
  assessment_type VARCHAR(50), -- forecast, observation, post_event
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_impact_assessments_region_date ON impact_assessments(region_id, assessment_date DESC);
CREATE INDEX idx_impact_assessments_type ON impact_assessments(assessment_type);

-- ==================== AUDIT LOGS ====================
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id BIGINT,
  changes JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ==================== SYSTEM CONFIGURATION ====================
CREATE TABLE IF NOT EXISTS system_config (
  id BIGSERIAL PRIMARY KEY,
  config_key VARCHAR(255) UNIQUE NOT NULL,
  config_value TEXT,
  data_type VARCHAR(50), -- string, number, boolean, json
  description TEXT,
  is_editable BOOLEAN DEFAULT true,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configurations
INSERT INTO system_config (config_key, config_value, data_type, description) VALUES
  ('api_openweather_enabled', 'true', 'boolean', 'Enable OpenWeather API integration'),
  ('api_noaa_enabled', 'true', 'boolean', 'Enable NOAA API integration'),
  ('satellite_data_enabled', 'true', 'boolean', 'Enable satellite data processing'),
  ('ml_model_name', 'XGBoost', 'string', 'Active ML model for predictions'),
  ('alert_check_interval_minutes', '60', 'number', 'Interval between alert checks'),
  ('data_retention_days', '1825', 'number', 'Data retention period in days (default 5 years)'),
  ('default_forecast_days', '30', 'number', 'Default forecast period in days'),
  ('drought_threshold_spi', '-1.5', 'number', 'SPI threshold for drought classification')
ON CONFLICT (config_key) DO NOTHING;

-- ==================== VIEWS FOR ANALYTICS ====================
CREATE VIEW drought_status_latest AS
SELECT 
  r.id,
  r.name,
  r.country,
  r.latitude,
  r.longitude,
  di.drought_category,
  di.dvi,
  di.vhi,
  di.spi_3month,
  di.timestamp as last_update,
  p.drought_probability_percentage,
  p.predicted_severity,
  p.valid_until as prediction_valid_until
FROM regions r
LEFT JOIN drought_indices di ON r.id = di.region_id 
  AND di.timestamp = (SELECT MAX(timestamp) FROM drought_indices WHERE region_id = r.id)
LEFT JOIN predictions p ON r.id = p.region_id 
  AND p.valid_from <= CURRENT_TIMESTAMP 
  AND p.valid_until >= CURRENT_TIMESTAMP
WHERE r.is_active = true;

CREATE VIEW alert_summary AS
SELECT 
  region_id,
  alert_type,
  severity_level,
  COUNT(*) as count,
  MAX(triggered_at) as latest_trigger
FROM alerts
WHERE is_active = true
GROUP BY region_id, alert_type, severity_level;

CREATE VIEW water_stress_indicators AS
SELECT 
  r.id,
  r.name,
  ROUND((wr.reservoir_level_meters / NULLIF(wr.reservoir_capacity_cubic_meters, 0)) * 100, 2) as reservoir_fill_percentage,
  di.spi_3month,
  sd.soil_moisture_percentage,
  sd.groundwater_level_meters,
  (100 - sd.soil_moisture_percentage) as soil_stress_index,
  CASE 
    WHEN sd.soil_moisture_percentage < 20 THEN 'Critical'
    WHEN sd.soil_moisture_percentage < 40 THEN 'Severe'
    WHEN sd.soil_moisture_percentage < 60 THEN 'Moderate'
    ELSE 'Normal'
  END as stress_category
FROM regions r
LEFT JOIN water_resources wr ON r.id = wr.region_id 
  AND wr.timestamp = (SELECT MAX(timestamp) FROM water_resources WHERE region_id = r.id)
LEFT JOIN drought_indices di ON r.id = di.region_id 
  AND di.timestamp = (SELECT MAX(timestamp) FROM drought_indices WHERE region_id = r.id)
LEFT JOIN soil_data sd ON r.id = sd.region_id 
  AND sd.timestamp = (SELECT MAX(timestamp) FROM soil_data WHERE region_id = r.id);
