'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const MapClient = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-gray-100">Loading Map Data...</div>
});

interface DroughtLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  severity_level: string;
  anomaly_score: number;
}

export default function DroughtMap() {
  const [locations, setLocations] = useState<DroughtLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDroughtLocations();
    const interval = setInterval(fetchDroughtLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDroughtLocations = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      // Fetch all affected areas (removed filtered query to show more data)
      const response = await fetch('/api/data/drought-indices?type=affected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLocations(data.affectedAreas || []);
    } catch (error) {
      console.error('Failed to fetch drought locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[500px] flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          Global Drought Monitor
        </CardTitle>
        <CardDescription>
          Real-time drought severity visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <MapClient locations={locations} />
      </CardContent>
    </Card>
  );
}
