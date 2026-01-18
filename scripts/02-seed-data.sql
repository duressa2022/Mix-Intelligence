-- Drought Monitoring System - Sample Data
-- This script populates the database with sample data for testing and demonstration

-- Insert organizations
INSERT INTO organizations (id, name, created_at) VALUES
  ('org-001', 'National Water Authority', NOW()),
  ('org-002', 'Agricultural Resources Management', NOW()),
  ('org-003', 'Climate Research Institute', NOW());

-- Insert users
INSERT INTO users (id, email, password_hash, name, role, organization_id, created_at) VALUES
  ('user-001', 'admin@waterauth.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Admin User', 'admin', 'org-001', NOW()),
  ('user-002', 'scientist@climate.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Dr. Climate', 'scientist', 'org-003', NOW()),
  ('user-003', 'manager@agri.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Farm Manager', 'manager', 'org-002', NOW()),
  ('user-004', 'viewer@waterauth.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Data Viewer', 'viewer', 'org-001', NOW());

-- Insert regions
INSERT INTO regions (id, name, country, latitude, longitude, area_km2, population, primary_crop, created_at) VALUES
  ('region-001', 'Central Valley', 'United States', 36.5, -120.5, 52000, 3500000, 'Almonds', NOW()),
  ('region-002', 'California Desert', 'United States', 32.8, -116.5, 84000, 1200000, 'Vegetables', NOW()),
  ('region-003', 'Rio Grande Basin', 'Mexico', 31.7, -106.4, 45000, 800000, 'Corn', NOW()),
  ('region-004', 'Indus Valley', 'Pakistan', 32.5, 71.5, 156000, 15000000, 'Rice/Wheat', NOW()),
  ('region-005', 'Nile Delta', 'Egypt', 30.8, 31.5, 25000, 25000000, 'Cotton', NOW()),
  ('region-006', 'Murray-Darling', 'Australia', -34.2, 142.5, 1000000, 100000, 'Wheat', NOW()),
  ('region-007', 'Sahel', 'West Africa', 15.5, -5.0, 800000, 8000000, 'Millet', NOW()),
  ('region-008', 'Amazon Basin', 'Brazil', -5.5, -63.5, 2500000, 2000000, 'Sugar', NOW());

-- Insert weather data for Central Valley (sample)
INSERT INTO weather_data (id, region_id, temperature, precipitation, humidity, wind_speed, evapotranspiration, source, recorded_date, created_at) VALUES
  (gen_random_uuid(), 'region-001', 25.5, 2.1, 45, 12.5, 7.2, 'NOAA', NOW() - INTERVAL '7 days', NOW()),
  (gen_random_uuid(), 'region-001', 26.2, 0.5, 42, 13.5, 7.8, 'NOAA', NOW() - INTERVAL '6 days', NOW()),
  (gen_random_uuid(), 'region-001', 28.5, 0.0, 38, 15.2, 8.5, 'NOAA', NOW() - INTERVAL '5 days', NOW()),
  (gen_random_uuid(), 'region-001', 29.1, 0.0, 35, 16.5, 9.1, 'NOAA', NOW() - INTERVAL '4 days', NOW()),
  (gen_random_uuid(), 'region-001', 27.8, 1.5, 40, 14.2, 8.2, 'NOAA', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), 'region-001', 26.5, 3.2, 48, 12.1, 7.5, 'NOAA', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-001', 25.2, 2.8, 50, 11.5, 6.9, 'NOAA', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-001', 24.8, 1.2, 52, 10.2, 6.5, 'NOAA', NOW(), NOW());

-- Insert weather data for California Desert
INSERT INTO weather_data (id, region_id, temperature, precipitation, humidity, wind_speed, evapotranspiration, source, recorded_date, created_at) VALUES
  (gen_random_uuid(), 'region-002', 32.5, 0.0, 25, 18.5, 11.2, 'NOAA', NOW() - INTERVAL '5 days', NOW()),
  (gen_random_uuid(), 'region-002', 33.8, 0.0, 22, 19.5, 11.8, 'NOAA', NOW() - INTERVAL '4 days', NOW()),
  (gen_random_uuid(), 'region-002', 35.2, 0.0, 20, 20.2, 12.5, 'NOAA', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), 'region-002', 34.5, 0.0, 21, 19.8, 12.1, 'NOAA', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-002', 33.2, 0.0, 23, 18.5, 11.6, 'NOAA', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-002', 32.1, 0.0, 24, 17.2, 11.0, 'NOAA', NOW(), NOW());

-- Insert satellite data
INSERT INTO satellite_data (id, region_id, ndvi, data_source, captured_date, created_at) VALUES
  (gen_random_uuid(), 'region-001', 0.65, 'Landsat', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), 'region-001', 0.62, 'Landsat', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-001', 0.58, 'Landsat', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-001', 0.55, 'Landsat', NOW(), NOW()),
  (gen_random_uuid(), 'region-002', 0.35, 'Landsat', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), 'region-002', 0.32, 'Landsat', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-002', 0.28, 'Landsat', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-002', 0.25, 'Landsat', NOW(), NOW());

-- Insert soil data
INSERT INTO soil_data (id, region_id, soil_moisture, data_source, measured_date, created_at) VALUES
  (gen_random_uuid(), 'region-001', 45, 'SMAP', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-001', 42, 'SMAP', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-001', 38, 'SMAP', NOW(), NOW()),
  (gen_random_uuid(), 'region-002', 15, 'SMAP', NOW() - INTERVAL '2 days', NOW()),
  (gen_random_uuid(), 'region-002', 12, 'SMAP', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), 'region-002', 10, 'SMAP', NOW(), NOW());

-- Insert drought indices - Central Valley (moderate drought)
INSERT INTO drought_indices (id, region_id, spi_3month, spi_6month, ndvi, soil_moisture, anomaly_score, severity_level, confidence, data_source, created_at) VALUES
  (gen_random_uuid(), 'region-001', 1.2, 1.8, 0.55, 38, -0.35, 'moderate', 82, 'Computed', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'region-001', 0.8, 1.5, 0.52, 36, -0.42, 'moderate', 85, 'Computed', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'region-001', 0.2, 0.9, 0.48, 32, -0.58, 'severe', 88, 'Computed', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'region-001', -0.3, 0.5, 0.45, 28, -0.68, 'severe', 89, 'Computed', NOW());

-- Insert drought indices - California Desert (extreme drought)
INSERT INTO drought_indices (id, region_id, spi_3month, spi_6month, ndvi, soil_moisture, anomaly_score, severity_level, confidence, data_source, created_at) VALUES
  (gen_random_uuid(), 'region-002', -1.5, -2.2, 0.25, 10, -0.78, 'extreme', 92, 'Computed', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'region-002', -1.8, -2.5, 0.22, 8, -0.85, 'extreme', 93, 'Computed', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'region-002', -2.1, -2.8, 0.20, 6, -0.92, 'extreme', 95, 'Computed', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'region-002', -2.3, -3.0, 0.18, 5, -0.95, 'extreme', 96, 'Computed', NOW());

-- Insert drought indices - Other regions (various levels)
INSERT INTO drought_indices (id, region_id, spi_3month, spi_6month, ndvi, soil_moisture, anomaly_score, severity_level, confidence, data_source, created_at) VALUES
  (gen_random_uuid(), 'region-003', 0.5, 1.0, 0.60, 50, -0.15, 'mild', 65, 'Computed', NOW()),
  (gen_random_uuid(), 'region-004', -0.8, -0.5, 0.40, 30, -0.52, 'moderate', 79, 'Computed', NOW()),
  (gen_random_uuid(), 'region-005', -1.2, -1.5, 0.35, 25, -0.65, 'severe', 85, 'Computed', NOW()),
  (gen_random_uuid(), 'region-006', 1.5, 2.0, 0.75, 65, 0.20, 'none', 72, 'Computed', NOW()),
  (gen_random_uuid(), 'region-007', -2.0, -2.5, 0.15, 12, -0.88, 'extreme', 91, 'Computed', NOW()),
  (gen_random_uuid(), 'region-008', 0.8, 1.2, 0.70, 60, -0.05, 'mild', 58, 'Computed', NOW());

-- Insert water resources data
INSERT INTO water_resources (id, region_id, available_water, water_deficit, total_usage, reserve_percentage, created_at) VALUES
  (gen_random_uuid(), 'region-001', 8500, 2500, 8000, 77, NOW()),
  (gen_random_uuid(), 'region-002', 1200, 8800, 1000, 12, NOW()),
  (gen_random_uuid(), 'region-003', 6000, 4000, 5500, 60, NOW()),
  (gen_random_uuid(), 'region-004', 15000, 35000, 40000, 30, NOW()),
  (gen_random_uuid(), 'region-005', 3000, 12000, 12000, 20, NOW()),
  (gen_random_uuid(), 'region-006', 35000, 5000, 28000, 87, NOW()),
  (gen_random_uuid(), 'region-007', 800, 7200, 700, 10, NOW()),
  (gen_random_uuid(), 'region-008', 45000, 5000, 35000, 90, NOW());

-- Insert drought alerts
INSERT INTO drought_alerts (id, region_id, severity_level, alert_type, message, recommended_action, status, notification_channels, organization_id, created_by, created_at) VALUES
  (gen_random_uuid(), 'region-001', 'severe', 'Severe Drought Warning', 'Central Valley experiencing severe drought conditions with below-normal precipitation and declining soil moisture levels.', 'Implement water rationing measures. Increase irrigation efficiency. Monitor crop health closely.', 'active', ARRAY['email', 'sms'], 'org-001', 'user-001', NOW()),
  (gen_random_uuid(), 'region-002', 'extreme', 'Extreme Drought Alert', 'California Desert in extreme drought. Water reserves critically depleted. NDVI index showing severe vegetation stress.', 'Declare water emergency. Implement mandatory water restrictions. Suspend non-essential irrigation.', 'active', ARRAY['email', 'sms', 'webhook'], 'org-001', 'user-001', NOW()),
  (gen_random_uuid(), 'region-005', 'severe', 'Drought Warning', 'Nile Delta experiencing severe drought stress. Water availability declining rapidly.', 'Coordinate with government agencies. Implement emergency water management. Prepare for contingencies.', 'active', ARRAY['email'], 'org-001', 'user-001', NOW()),
  (gen_random_uuid(), 'region-003', 'mild', 'Drought Advisory', 'Rio Grande Basin showing early signs of drought development. Monitor precipitation closely.', 'Prepare contingency plans. Begin water conservation education. Monitor for further deterioration.', 'acknowledged', ARRAY['email'], 'org-002', 'user-003', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'region-007', 'extreme', 'Critical Drought Crisis', 'Sahel region in critical drought. Famine risk. Emergency humanitarian response needed.', 'Coordinate with international organizations. Emergency food and water aid. Livestock rescue programs.', 'active', ARRAY['email', 'sms', 'webhook'], 'org-003', 'user-002', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'region-004', 'moderate', 'Drought Watch', 'Indus Valley showing moderate drought indicators. Monitor water supply sources.', 'Increase water management coordination. Plan for potential water stress. Monitor groundwater levels.', 'resolved', ARRAY['email'], 'org-002', 'user-003', NOW() - INTERVAL '10 days');

-- Insert drought analytics (pre-computed)
INSERT INTO drought_analytics (id, period, total_regions_monitored, regions_with_drought, avg_severity_score, total_alerts_active, total_alerts_resolved, report_date, created_at) VALUES
  (gen_random_uuid(), '7_days', 8, 6, -0.52, 5, 1, NOW()::date - INTERVAL '7 days', NOW()),
  (gen_random_uuid(), '30_days', 8, 7, -0.48, 8, 3, NOW()::date - INTERVAL '30 days', NOW()),
  (gen_random_uuid(), '90_days', 8, 8, -0.45, 12, 8, NOW()::date - INTERVAL '90 days', NOW()),
  (gen_random_uuid(), 'current', 8, 7, -0.58, 5, 1, NOW()::date, NOW());

-- Insert audit logs
INSERT INTO audit_logs (id, user_id, organization_id, action, resource_type, resource_id, details, created_at) VALUES
  (gen_random_uuid(), 'user-001', 'org-001', 'CREATE', 'alert', 'alert-001', 'Created severe drought alert for Central Valley', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), 'user-002', 'org-003', 'UPDATE', 'drought_index', 'region-007', 'Updated drought index for Sahel region', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), 'user-003', 'org-002', 'VIEW', 'alert', 'alert-004', 'Viewed drought advisory for Rio Grande Basin', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), 'user-001', 'org-001', 'UPDATE', 'alert', 'alert-005', 'Acknowledged critical drought alert', NOW() - INTERVAL '15 minutes');

-- Create unique constraint on drought_indices if not exists
ALTER TABLE drought_indices
ADD CONSTRAINT unique_region_latest ON (region_id)
WHERE created_at = (
  SELECT MAX(created_at) FROM drought_indices AS di2
  WHERE di2.region_id = drought_indices.region_id
);

-- Insert data quality indicators
INSERT INTO data_quality_indicators (id, region_id, data_source, last_update, records_in_24h, data_freshness_hours, quality_score, created_at) VALUES
  (gen_random_uuid(), 'region-001', 'NOAA', NOW(), 24, 0.5, 98, NOW()),
  (gen_random_uuid(), 'region-001', 'Landsat', NOW() - INTERVAL '6 hours', 4, 6, 95, NOW()),
  (gen_random_uuid(), 'region-002', 'NOAA', NOW(), 24, 0.5, 97, NOW()),
  (gen_random_uuid(), 'region-002', 'SMAP', NOW() - INTERVAL '12 hours', 2, 12, 92, NOW());

-- Commit all inserts
COMMIT;

-- Verification queries
SELECT 'Organizations' as category, COUNT(*) as count FROM organizations
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Regions', COUNT(*) FROM regions
UNION ALL
SELECT 'Weather Data Points', COUNT(*) FROM weather_data
UNION ALL
SELECT 'Drought Indices', COUNT(*) FROM drought_indices
UNION ALL
SELECT 'Active Alerts', COUNT(*) FROM drought_alerts WHERE status = 'active'
UNION ALL
SELECT 'Water Resources', COUNT(*) FROM water_resources;
