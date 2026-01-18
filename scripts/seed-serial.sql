-- Compatible Seed Data for Serial ID Schema

-- Users
INSERT INTO users (email, password_hash, full_name, role, organization, is_active, email_verified) VALUES
('admin@waterauth.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Admin User', 'admin', 'National Water Authority', true, true),
('scientist@climate.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Dr. Climate', 'scientist', 'Climate Research Institute', true, true),
('manager@agri.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Farm Manager', 'manager', 'Agricultural Resources Management', true, true),
('viewer@waterauth.com', '$2a$10$YIjZJZxIx0UsCq5Mwq/gmuU5iD7Y1xX1Y2X1Y2X1Y2X1Y2X1Y2', 'Data Viewer', 'user', 'National Water Authority', true, true);

-- Regions
INSERT INTO regions (name, country, latitude, longitude, area_sq_km, population, administrative_level) VALUES
('Central Valley', 'United States', 36.5, -120.5, 52000, 3500000, 'region'),
('California Desert', 'United States', 32.8, -116.5, 84000, 1200000, 'region'),
('Rio Grande Basin', 'Mexico', 31.7, -106.4, 45000, 800000, 'watershed'),
('Indus Valley', 'Pakistan', 32.5, 71.5, 156000, 15000000, 'region'),
('Nile Delta', 'Egypt', 30.8, 31.5, 25000, 25000000, 'district'),
('Murray-Darling', 'Australia', -34.2, 142.5, 1000000, 100000, 'watershed'),
('Sahel', 'West Africa', 15.5, -5.0, 800000, 8000000, 'region'),
('Amazon Basin', 'Brazil', -5.5, -63.5, 2500000, 2000000, 'watershed');

-- Weather Data (Assuming IDs 1-8 based on insertion order)
INSERT INTO weather_data (region_id, timestamp, temperature_celsius, precipitation_mm, humidity_percentage, wind_speed_kmh, evapotranspiration_mm, data_source) VALUES
(1, NOW() - INTERVAL '7 days', 25.5, 2.1, 45, 12.5, 7.2, 'NOAA'),
(1, NOW() - INTERVAL '6 days', 26.2, 0.5, 42, 13.5, 7.8, 'NOAA'),
(1, NOW() - INTERVAL '5 days', 28.5, 0.0, 38, 15.2, 8.5, 'NOAA'),
(1, NOW(), 24.8, 1.2, 52, 10.2, 6.5, 'NOAA'),
(2, NOW() - INTERVAL '5 days', 32.5, 0.0, 25, 18.5, 11.2, 'NOAA'),
(2, NOW(), 32.1, 0.0, 24, 17.2, 11.0, 'NOAA');

-- Drought Indices
INSERT INTO drought_indices (region_id, timestamp, spi_3month, spi_6month, drought_category, confidence_score) VALUES
(1, NOW(), -0.3, 0.5, 'Moderate', 0.89),
(2, NOW(), -2.3, -3.0, 'Extreme', 0.96),
(3, NOW(), 0.5, 1.0, 'Mild', 0.65),
(7, NOW(), -2.0, -2.5, 'Extreme', 0.91);

-- Alerts
INSERT INTO alerts (region_id, alert_type, severity_level, title, message, is_active, triggered_at) VALUES
(1, 'drought_warning', 'medium', 'Severe Drought Warning', 'Central Valley experiencing severe drought.', true, NOW()),
(2, 'extreme_event', 'critical', 'Extreme Drought Alert', 'California Desert in extreme drought.', true, NOW()),
(7, 'drought_warning', 'critical', 'Critical Drought Crisis', 'Sahel region in critical drought.', true, NOW());

-- System Config (Upsert handled in 01 script, skipping here or adding overrides if needed)
