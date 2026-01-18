-- Socioeconomic Data Schema for Drought Prediction System

-- ==================== SOCIOECONOMIC DATA ====================

CREATE TABLE IF NOT EXISTS socioeconomic_data (
  id BIGSERIAL PRIMARY KEY,
  region_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  
  -- Agricultural Economics
  crop_yield_tonnes_per_hectare NUMERIC(8, 2),
  livestock_health_index NUMERIC(5, 2), -- 0-1 or 0-100 scale
  major_crop_type VARCHAR(100),
  
  -- Market Data
  staple_food_price_local_currency NUMERIC(10, 2),
  market_access_index NUMERIC(5, 2),
  
  -- Social Vulnerability
  water_price_per_liter NUMERIC(10, 2),
  human_displacement_count INT,
  malnutrition_rate_percentage NUMERIC(5, 2),
  
  data_source VARCHAR(100),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_socioeconomic_region_timestamp ON socioeconomic_data(region_id, timestamp DESC);
CREATE INDEX idx_socioeconomic_crop ON socioeconomic_data(major_crop_type);

-- View to combine Environmental and Socioeconomic Risk Factors
CREATE OR REPLACE VIEW regional_risk_overview AS
SELECT 
    r.id AS region_id,
    r.name,
    di.drought_category,
    di.spi_3month,
    sd.soil_moisture_percentage,
    se.crop_yield_tonnes_per_hectare,
    se.staple_food_price_local_currency,
    se.malnutrition_rate_percentage,
    CASE 
        WHEN di.drought_category = 'Extreme' AND se.malnutrition_rate_percentage > 15 THEN 'Critical Humanitarian Risk'
        WHEN di.drought_category IN ('Severe', 'Extreme') THEN 'High Risk'
        WHEN di.drought_category = 'Moderate' THEN 'Moderate Risk'
        ELSE 'Low Risk'
    END as composite_risk_level
FROM regions r
LEFT JOIN drought_indices di ON r.id = di.region_id 
  AND di.timestamp = (SELECT MAX(timestamp) FROM drought_indices WHERE region_id = r.id)
LEFT JOIN soil_data sd ON r.id = sd.region_id 
  AND sd.timestamp = (SELECT MAX(timestamp) FROM soil_data WHERE region_id = r.id)
LEFT JOIN socioeconomic_data se ON r.id = se.region_id
  AND se.timestamp = (SELECT MAX(timestamp) FROM socioeconomic_data WHERE region_id = r.id);
