'use client';

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Ensure this only runs on the client to avoid SSR issues with 'L'
let DefaultIcon: any = null;
if (typeof window !== 'undefined') {
    DefaultIcon = L.icon({
        iconUrl: icon.src,
        shadowUrl: iconShadow.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
}

const severityColors: Record<string, string> = {
    none: '#10b981',   // Emerald
    mild: '#f59e0b',   // Amber
    moderate: '#f97316', // Orange
    severe: '#ef4444',  // Red
    extreme: '#b91c1c', // Deep Dark Red
};

interface DroughtLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    severity_level: string;
    anomaly_score: number;
}

// Moved outside to avoid re-creation on every render
const RegionMarker = ({ loc }: { loc: DroughtLocation }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loadingWeather, setLoadingWeather] = useState(false);

    const handlePopupOpen = async () => {
        if (weather) return; // Already fetched
        setLoadingWeather(true);
        try {
            const res = await fetch(`/api/weather?lat=${loc.latitude}&lon=${loc.longitude}`);
            if (res.ok) {
                const data = await res.json();
                setWeather(data);
            }
        } catch (e) {
            console.error("Weather fetch failed", e);
        } finally {
            setLoadingWeather(false);
        }
    };

    return (
        <CircleMarker
            center={[loc.latitude || 0, loc.longitude || 0]}
            radius={12}
            eventHandlers={{
                click: handlePopupOpen,
                popupopen: handlePopupOpen
            }}
            pathOptions={{
                color: severityColors[loc.severity_level] || '#22c55e',
                fillColor: severityColors[loc.severity_level] || '#22c55e',
                fillOpacity: 0.8
            }}
        >
            <Tooltip permanent direction="center" className="bg-transparent border-none shadow-none text-[8px] font-black text-white p-0">
                {Math.round(Math.abs(loc.anomaly_score * 100))}
            </Tooltip>
            <Popup>
                <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg">{loc.name}</h3>
                    <div className="mb-2">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full text-white uppercase tracking-widest" style={{ backgroundColor: severityColors[loc.severity_level], boxShadow: `0 0 15px ${severityColors[loc.severity_level]}40` }}>
                            {loc.severity_level} :: {Math.round(Math.abs(loc.anomaly_score * 100))}% DEFICIT
                        </span>
                    </div>
                    <p className="text-sm">Anomaly Score: <span className="font-medium">{(loc.anomaly_score * 100).toFixed(0)}%</span></p>

                    <div className="mt-3 border-t pt-2">
                        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Live Weather</h4>
                        {loadingWeather ? (
                            <p className="text-xs text-gray-400">Loading...</p>
                        ) : weather ? (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-500">Temp</p>
                                    <p className="font-medium">{weather.temperature}°C</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Humidity</p>
                                    <p className="font-medium">{weather.humidity}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Rain</p>
                                    <p className="font-medium">{weather.precipitation}mm</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Soil</p>
                                    <p className="font-medium">{weather.soilMoisture}m³/m³</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-red-400">Weather data unavailable</p>
                        )}
                    </div>
                </div>
            </Popup>
        </CircleMarker>
    );
};

export default function MapClient({ locations }: { locations: DroughtLocation[] }) {
    const center: [number, number] = [20, 0];
    const zoom = 2;

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <RegionMarker key={loc.id} loc={loc} />
            ))}
        </MapContainer>
    );
}
