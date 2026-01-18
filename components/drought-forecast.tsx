'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';

interface Forecast {
  date: string;
  predictedSeverity: string;
  probability: number;
}

const severityValues: Record<string, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  extreme: 4,
};

export default function DroughtForecast({ regionId = 'sample' }: { regionId?: string }) {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, [regionId]);

  const fetchForecast = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `/api/data/drought-indices?region_id=${regionId}&type=prediction`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.predictions) {
        const chartData = data.predictions.map((p: Forecast) => ({
          date: new Date(p.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          severity: severityValues[p.predictedSeverity],
          probability: p.probability,
          rawDate: p.date,
        }));
        setForecast(chartData);
      }
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <TrendingDown size={18} className="text-rose-500" />
          Predictive Analytics
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest opacity-60">
          30-Day drought severity trajectory & confidence
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
            Executing predictive algorithms...
          </div>
        ) : forecast.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-rose-500/20 flex items-center justify-center">
              <TrendingDown size={20} className="text-rose-500/40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Calibrating Planetary Projections...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#ffffff40"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={15}
                style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              />
              <YAxis
                domain={[0, 4]}
                stroke="#ffffff40"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-10}
                style={{ fontWeight: 900 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  padding: '16px'
                }}
                itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase' }}
                cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                formatter={(value: any, name: string) => {
                  if (name === 'Predicted Severity') {
                    const labels = ['Stable', 'Warning', 'Alert', 'Critical', 'Emergency'];
                    return [labels[Math.round(value as number)] || value, name];
                  }
                  return [`${value}%`, name];
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', top: -10 }}
              />
              <Line
                type="monotone"
                dataKey="severity"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4, stroke: '#000' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444', shadow: '0 0 10px #ef4444' }}
                name="Predicted Severity"
                animationDuration={2000}
              />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#000' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', shadow: '0 0 10px #3b82f6' }}
                name="Confidence (%)"
                animationDuration={2500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

