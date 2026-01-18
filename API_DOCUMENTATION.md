# Drought Prediction & Monitoring System - API Documentation

## Overview

Production-ready REST API for drought prediction, monitoring, and management system. Includes real-time data ingestion, predictive modeling, alerts, and analytics.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints (except `/auth/*`) require Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account and organization.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "organizationName": "Water Authority"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "viewer",
    "organization_id": "uuid"
  },
  "token": "eyJhbGc..."
}
```

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "user": {...},
  "token": "eyJhbGc..."
}
```

---

## Data Collection Endpoints

### Submit Weather Data

**POST** `/data/weather`

Ingest weather observations from ground stations or APIs.

**Request Body:**
```json
{
  "region_id": "region-uuid",
  "temperature": 28.5,
  "precipitation": 5.2,
  "humidity": 45.3,
  "wind_speed": 12.5,
  "evapotranspiration": 8.1,
  "source": "NOAA"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "region_id": "region-uuid",
    "temperature": 28.5,
    "recorded_date": "2024-01-15T10:30:00Z"
  },
  "droughtIndex": {
    "anomaly_score": -0.35,
    "severity_level": "moderate",
    "confidence": 78
  }
}
```

### Get Weather Data

**GET** `/data/weather?region_id=<region_id>&days=30`

Retrieve historical weather observations.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "region_id": "region-uuid",
      "temperature": 28.5,
      "precipitation": 5.2,
      "recorded_date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Batch Data Ingestion

**POST** `/data/ingest`

Ingest multiple records from multiple data sources simultaneously.

**Request Body:**
```json
{
  "datasource": "Landsat",
  "regions": [
    {
      "region_id": "region-1",
      "temperature": 28.5,
      "precipitation": 5.2,
      "humidity": 45.3,
      "wind_speed": 12.5,
      "evapotranspiration": 8.1,
      "ndvi": 0.65,
      "soil_moisture": 45
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Data ingested successfully",
  "results": [
    {
      "region_id": "region-1",
      "weatherInserted": true,
      "droughtIndexUpdated": true
    }
  ]
}
```

---

## Drought Index Endpoints

### Get Current Drought Indices

**GET** `/data/drought-indices?region_id=<region_id>`

Get current drought indices for a region.

**Response (200):**
```json
{
  "current": {
    "id": "uuid",
    "region_id": "region-uuid",
    "spi_3month": 1.5,
    "spi_6month": 2.1,
    "ndvi": 0.65,
    "soil_moisture": 45,
    "anomaly_score": -0.35,
    "severity_level": "moderate",
    "confidence": 78,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Get Drought Predictions

**GET** `/data/drought-indices?region_id=<region_id>&type=prediction`

Get 30-day drought severity predictions using ML models.

**Response (200):**
```json
{
  "predictions": [
    {
      "date": "2024-01-16",
      "predictedSeverity": "moderate",
      "probability": 72
    },
    {
      "date": "2024-01-17",
      "predictedSeverity": "severe",
      "probability": 68
    }
  ]
}
```

### Get Affected Areas

**GET** `/data/drought-indices?type=affected&severity=severe`

List all regions currently experiencing specified drought severity.

**Query Parameters:**
- `severity`: none | mild | moderate | severe | extreme

**Response (200):**
```json
{
  "affectedAreas": [
    {
      "id": "region-uuid",
      "name": "Central Valley",
      "latitude": 36.5,
      "longitude": -120.5,
      "severity_level": "severe",
      "anomaly_score": -0.65
    }
  ]
}
```

### Submit Drought Index

**POST** `/data/drought-indices`

Submit calculated drought indices from external models.

**Request Body:**
```json
{
  "region_id": "region-uuid",
  "spi_3month": 1.5,
  "spi_6month": 2.1,
  "ndvi": 0.65,
  "soil_moisture": 45,
  "anomaly_score": -0.35,
  "severity_level": "moderate",
  "confidence": 78,
  "source": "Custom Model"
}
```

---

## Alerts Endpoints

### Get Alerts

**GET** `/alerts?status=active&limit=50`

Retrieve drought alerts with filtering.

**Query Parameters:**
- `status`: active | acknowledged | resolved
- `limit`: Max records to return (default: 50)

**Response (200):**
```json
{
  "alerts": [
    {
      "id": "alert-uuid",
      "region_id": "region-uuid",
      "severity_level": "severe",
      "alert_type": "Extreme Drought Warning",
      "message": "Region experiencing extreme drought conditions",
      "recommended_action": "Implement water rationing measures",
      "status": "active",
      "notification_channels": ["email", "sms"],
      "created_at": "2024-01-15T08:00:00Z"
    }
  ]
}
```

### Create Alert

**POST** `/alerts`

Generate new alert for critical drought condition.

**Request Body:**
```json
{
  "region_id": "region-uuid",
  "severity_level": "extreme",
  "alert_type": "Extreme Drought Warning",
  "message": "Critical drought conditions detected",
  "recommended_action": "Activate emergency water conservation",
  "notification_channels": ["email", "sms", "webhook"]
}
```

**Response (201):**
```json
{
  "alert": {
    "id": "alert-uuid",
    "region_id": "region-uuid",
    "severity_level": "extreme",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Update Alert Status

**PATCH** `/alerts`

Update alert status (acknowledge or resolve).

**Request Body:**
```json
{
  "alert_id": "alert-uuid",
  "status": "acknowledged"
}
```

---

## Region Management Endpoints

### Get Regions

**GET** `/regions?limit=100&offset=0`

List all monitored regions with pagination.

**Response (200):**
```json
{
  "regions": [
    {
      "id": "region-uuid",
      "name": "Central Valley",
      "country": "United States",
      "latitude": 36.5,
      "longitude": -120.5,
      "area_km2": 52000,
      "population": 3500000,
      "primary_crop": "Almonds"
    }
  ],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 250
  }
}
```

### Create Region

**POST** `/regions`

Register new region for monitoring.

**Request Body:**
```json
{
  "name": "Central Valley",
  "country": "United States",
  "latitude": 36.5,
  "longitude": -120.5,
  "area_km2": 52000,
  "population": 3500000,
  "primary_crop": "Almonds"
}
```

---

## Analytics Endpoints

### Generate Report

**GET** `/analytics/report?days=30&region_id=<optional>`

Generate comprehensive drought analysis report.

**Query Parameters:**
- `days`: 7 | 30 | 90 | 365
- `region_id`: Optional specific region

**Response (200):**
```json
{
  "period": "Last 30 days",
  "droughtStatistics": {
    "total_records": 4500,
    "avg_anomaly": -0.42,
    "min_anomaly": -0.95,
    "max_anomaly": 0.35,
    "avg_confidence": 82.5
  },
  "severityDistribution": [
    { "severity_level": "severe", "count": 1200 },
    { "severity_level": "moderate", "count": 2000 },
    { "severity_level": "mild", "count": 1000 },
    { "severity_level": "none", "count": 300 }
  ],
  "alertStatistics": [
    { "status": "active", "count": 45 },
    { "status": "acknowledged", "count": 120 },
    { "status": "resolved", "count": 85 }
  ],
  "topAffectedRegions": [...]
}
```

---

## Error Handling

All error responses follow this format:

**400 Bad Request:**
```json
{
  "error": "Invalid request body"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process request"
}
```

---

## Data Models

### User
- `id`: UUID
- `email`: string (unique)
- `name`: string
- `role`: enum (admin, scientist, manager, viewer)
- `organization_id`: UUID (FK)
- `created_at`: timestamp
- `updated_at`: timestamp

### Region
- `id`: UUID
- `name`: string
- `country`: string
- `latitude`: decimal
- `longitude`: decimal
- `area_km2`: decimal
- `population`: integer
- `primary_crop`: string

### Drought Index
- `id`: UUID
- `region_id`: UUID (FK)
- `spi_3month`: decimal (Standardized Precipitation Index)
- `spi_6month`: decimal
- `ndvi`: decimal (Normalized Difference Vegetation Index)
- `soil_moisture`: decimal (0-100)
- `anomaly_score`: decimal (-1 to 1)
- `severity_level`: enum (none, mild, moderate, severe, extreme)
- `confidence`: decimal (0-100)
- `created_at`: timestamp
- `updated_at`: timestamp

### Alert
- `id`: UUID
- `region_id`: UUID (FK)
- `severity_level`: enum
- `alert_type`: string
- `message`: text
- `recommended_action`: text
- `status`: enum (active, acknowledged, resolved)
- `notification_channels`: array (email, sms, webhook)
- `created_at`: timestamp
- `updated_at`: timestamp

---

## Rate Limiting

Currently unlimited. Production deployment should implement:
- 100 requests/minute per user
- 1000 requests/minute per API key

## Webhooks

Configure webhooks for alert notifications:

```
POST /webhooks/drought-alert
```

Payload:
```json
{
  "event": "drought_alert_created",
  "alert": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Integration Examples

### Python Data Collection

```python
import requests

HEADERS = {
  "Authorization": f"Bearer {token}",
  "Content-Type": "application/json"
}

# Submit weather data
data = {
    "region_id": "region-uuid",
    "temperature": 28.5,
    "precipitation": 5.2,
    "humidity": 45.3,
    "wind_speed": 12.5,
    "evapotranspiration": 8.1,
    "source": "NOAA"
}

response = requests.post(
    "http://localhost:3000/api/data/weather",
    json=data,
    headers=HEADERS
)
```

### JavaScript Data Visualization

```javascript
const token = localStorage.getItem('auth_token');

// Get predictions
const response = await fetch(
  '/api/data/drought-indices?region_id=region-uuid&type=prediction',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

const { predictions } = await response.json();
// Use predictions for charting
```

---

## Support

For API support and documentation updates, contact the development team.
