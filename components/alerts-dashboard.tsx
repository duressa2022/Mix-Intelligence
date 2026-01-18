'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  region_id: string;
  severity_level: string;
  alert_type: string;
  message: string;
  recommended_action: string;
  status: string;
  created_at: string;
  notification_channels: string[];
}

const severityIcons: Record<string, React.ReactNode> = {
  mild: <Bell className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" size={18} />,
  moderate: <AlertTriangle className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" size={18} />,
  severe: <AlertTriangle className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" size={18} />,
  extreme: <AlertTriangle className="text-rose-700 drop-shadow-[0_0_8px_rgba(190,18,60,0.5)]" size={18} />,
};

const statusColors: Record<string, string> = {
  active: 'bg-rose-500/10 text-rose-500 border-none',
  acknowledged: 'bg-amber-500/10 text-amber-500 border-none',
  resolved: 'bg-emerald-500/10 text-emerald-500 border-none',
};

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/alerts?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alert_id: alertId, status: 'acknowledged' }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alert_id: alertId, status: 'resolved' }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground font-black uppercase tracking-widest text-[10px]">Synchronizing Alerts...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center">
          <Bell className="mr-3 h-3.5 w-3.5 text-white" /> Live Intelligence Feed
        </h2>
        <div className="bg-white/5 p-1 rounded-xl border border-white/5">
          <Button
            variant="ghost"
            size="sm"
            className={`text-[9px] font-black uppercase tracking-widest px-6 rounded-lg transition-all ${filter === 'active' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/40'}`}
            onClick={() => setFilter('active')}
          >
            Critical
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-[9px] font-black uppercase tracking-widest px-6 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/40'}`}
            onClick={() => setFilter('all')}
          >
            Archive
          </Button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <Card className="glass-card border-none py-12 text-center rounded-[2rem]">
          <CardContent>
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/20 mb-4" />
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Scan complete. All sectors operational.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {alerts.map((alert) => (
            <Card key={alert.id} className="glass-card border-white/5 hover:border-white/15 transition-all duration-300 relative group rounded-[1.5rem] overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.severity_level === 'extreme' ? 'bg-rose-700' :
                alert.severity_level === 'severe' ? 'bg-rose-500' :
                  alert.severity_level === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

              <CardHeader className="pb-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 transition-transform group-hover:scale-110">
                      {severityIcons[alert.severity_level]}
                    </div>
                    <div>
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-white leading-relaxed">
                        {alert.alert_type}
                      </CardTitle>
                      <CardDescription className="text-[10px] font-bold text-muted-foreground/60 uppercase mt-1 tracking-wider">
                        TELEMETRY_ID: {alert.region_id}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${statusColors[alert.status]} text-[9px] font-black uppercase px-3 py-1 rounded-lg tracking-tight`}>
                    {alert.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-6">
                <p className="text-[13px] leading-relaxed text-slate-300 font-medium">{alert.message}</p>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden group/advice">
                  <div className="absolute inset-0 bg-blue-500/5 transition-opacity" />
                  <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-2 flex items-center relative z-10">
                    <CheckCircle className="mr-2 h-3 w-3" /> System Recommendation
                  </p>
                  <p className="text-xs text-white/80 font-medium relative z-10 leading-relaxed">{alert.recommended_action}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-muted-foreground/40" />
                    <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {alert.status === 'active' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[9px] font-black uppercase text-white hover:bg-white/10 rounded-xl px-4 h-8"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {alert.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[9px] font-black uppercase text-emerald-400 hover:bg-emerald-400/10 rounded-xl px-4 h-8"
                        onClick={() => handleResolve(alert.id)}
                      >
                        Resolve Event
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

