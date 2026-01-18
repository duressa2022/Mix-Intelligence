'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Droplets } from 'lucide-react';

interface DroughtIndexCardProps {
  region: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'extreme';
  anomalyScore: number;
  ndvi: number;
  soilMoisture: number;
  confidence: number;
  trend?: 'improving' | 'stable' | 'worsening';
}

const severityColors: Record<string, string> = {
  none: 'bg-emerald-500/10 text-emerald-500 border-none',
  mild: 'bg-amber-500/10 text-amber-500 border-none',
  moderate: 'bg-orange-500/10 text-orange-500 border-none',
  severe: 'bg-rose-500/10 text-rose-500 border-none',
  extreme: 'bg-rose-950/40 text-rose-300 border border-rose-500/20',
};

const severityLabels: Record<string, string> = {
  none: 'SYSTEM_NORMAL',
  mild: 'STAGE_I_WARN',
  moderate: 'STAGE_II_ALERT',
  severe: 'STAGE_III_CRITICAL',
  extreme: 'STAGE_IV_EMERGENCY',
};

export default function DroughtIndexCard({
  region,
  severity,
  anomalyScore,
  ndvi,
  soilMoisture,
  confidence,
  trend = 'stable',
}: DroughtIndexCardProps) {
  const isAlertLevel = severity === 'severe' || severity === 'extreme';

  return (
    <Card className={`glass-card border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem] relative group ${isAlertLevel ? 'ring-1 ring-rose-500/20' : ''}`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${isAlertLevel ? 'bg-rose-500' : 'bg-blue-500'} opacity-30 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />

      <CardHeader className="p-8 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
              {isAlertLevel && <AlertTriangle size={18} className="text-rose-500 animate-pulse" />}
              {region}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">KERNEL_SCAN_{new Date().toLocaleDateString()}</CardDescription>
          </div>
          <Badge className={`${severityColors[severity]} text-[9px] font-black tracking-tighter uppercase py-1 px-3 rounded-lg`}>
            {severityLabels[severity]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Moisture Deficit</p>
            <p className="text-3xl font-black text-white tracking-widest italic">{(anomalyScore * 100).toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Confidence</p>
            <p className="text-3xl font-black text-white tracking-widest italic">{Math.round(confidence)}%</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Droplets size={12} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Soil Saturation</span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold">{Math.round(soilMoisture)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.min(100, soilMoisture))}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                  <TrendingDown size={12} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Biomass Index (NDVI)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{ndvi.toFixed(2)}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.min(100, (ndvi + 1) * 50))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trend Forecast</span>
          <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${trend === 'worsening' ? 'bg-rose-500 text-white animate-pulse' :
              trend === 'stable' ? 'bg-white/5 text-white' : 'bg-emerald-500 text-white'
            }`}>
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

