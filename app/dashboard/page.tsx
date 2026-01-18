'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardHeader from '@/components/dashboard-header';
import AlertsDashboard from '@/components/alerts-dashboard';
import DroughtForecast from '@/components/drought-forecast';
import DroughtIndexCard from '@/components/drought-index-card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Droplets, AlertTriangle, TrendingUp, Clock,
  Activity, Database, FileText, RefreshCw, CheckCircle, LayoutDashboard, Settings2,
  Brain, Cpu, Zap, History, Shield, Gauge, Leaf, ShieldAlert, Map as MapIcon, ClipboardCheck, ArrowUpRight,
  Bell, MessageSquare, Mail, Smartphone, Send, CheckCircle2, BarChart3, PieChart as PieChartIcon, MapPin, Globe, Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dynamically import Map component
const DroughtMap = dynamic(() => import('@/components/drought-map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full glass-card animate-pulse flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/20">Loading Map Engine...</div>
});

interface DashboardStats {
  totalRegions: number;
  severeAreas: number;
  activeAlerts: number;
  averageDroughtIndex: number;
}

interface AnalyticsData {
  droughtStatistics: {
    total_records: number;
    avg_anomaly: number;
    avg_confidence: number;
  };
  severityDistribution: Array<{ severity_level: string; count: number }>;
  alertStatistics: Array<{ status: string; count: number }>;
  topAffectedRegions: any[];
}

const mockAlertActivity = [
  { id: 1, type: 'SMS', to: '4.5k Farmers', status: 'Delivered', time: '2m ago', alert: 'Early Warning' },
  { id: 2, type: 'Email', to: 'Regional Officials', status: 'Sent', time: '15m ago', alert: 'Policy Update' },
  { id: 3, type: 'WhatsApp', to: 'Agri-Coop Leads', status: 'Read', time: '1h ago', alert: 'Market Flux' },
  { id: 4, type: 'Push', to: 'Mobile App Users', status: 'Delivered', time: '3h ago', alert: 'Heat Warning' },
];

const mockEnvironmentalData = [
  { name: 'Aug', spi: -0.5, spei: -0.8, vci: 45 },
  { name: 'Sep', spi: -1.2, spei: -1.5, vci: 38 },
  { name: 'Oct', spi: -1.8, spei: -2.1, vci: 25 },
  { name: 'Nov', spi: -2.0, spei: -2.4, vci: 15 },
  { name: 'Dec', spi: -1.5, spei: -1.9, vci: 18 },
  { name: 'Jan', spi: -1.1, spei: -1.4, vci: 22 },
];

const SEVERITY_COLORS: Record<string, string> = {
  none: '#22c55e',
  mild: '#eab308',
  moderate: '#f97316',
  severe: '#ef4444',
  extreme: '#7f1d1d',
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalRegions: 0,
    severeAreas: 0,
    activeAlerts: 0,
    averageDroughtIndex: 0,
  });
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Data Ops States
  const [etlStatus, setEtlStatus] = useState<string>('Ready');
  const [lastRun, setLastRun] = useState<string>('-');
  const [integrity, setIntegrity] = useState(99.2);
  const [latency, setLatency] = useState(12.4);
  const [loadDistribution, setLoadDistribution] = useState([
    { name: 'Weather Data Stream', count: 0, color: 'bg-emerald-500', width: 0 },
    { name: 'Satellite Raster Tiles', count: 0, color: 'bg-sky-500', width: 0 },
    { name: 'Socioeconomic Baseline', count: 0, color: 'bg-white/30', width: 0 },
  ]);
  const [ingestionLogs, setIngestionLogs] = useState<any[]>([]);
  const [streamHealth, setStreamHealth] = useState<any[]>([]);

  // AI Intelligence States
  const [aiTelemetry, setAiTelemetry] = useState<any>(null);
  const [inferencePulse, setInferencePulse] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  // Decision Support States
  const [decisionAdvisory, setDecisionAdvisory] = useState<any>(null);

  // Intelligence & Environmental States
  const [dispatchLogs, setDispatchLogs] = useState<any[]>([]);
  const [environmentalTrends, setEnvironmentalTrends] = useState<any[]>([]);
  const [impactData, setImpactData] = useState<any>(null);

  // Alerts State
  const [isSending, setIsSending] = useState(false);

  // Settings State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
    fetchAnalytics();
    fetchTopDroughtArea();
    fetchDecisionAdvisory();
    fetchDispatchLogs();
    fetchEnvironmentalTrends();
    fetchSettings();

    // LONG POLLING
    const pollInterval = setInterval(() => {
      fetchDashboardData();
      fetchTopDroughtArea();
      fetchIngestionStats();
      fetchAIIntelligence();
      fetchEnvironmentalTrends();
      fetchAnalytics();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [router]);

  const fetchIngestionStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/data/ingest/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setIntegrity(data.metrics.integrity);
      setLatency(data.metrics.latency);
      setIngestionLogs(data.events);
      setStreamHealth(data.heatmap);

      setLoadDistribution([
        { name: 'Weather Data Stream', count: data.metrics.weatherCount, color: 'bg-emerald-500', width: Math.min(100, (data.metrics.weatherCount / 1000) * 100) },
        { name: 'Satellite Raster Tiles', count: data.metrics.satelliteCount, color: 'bg-sky-500', width: Math.min(100, (data.metrics.satelliteCount / 1000) * 100) },
        { name: 'Socioeconomic Baseline', count: data.metrics.soilCount, color: 'bg-white/30', width: Math.min(100, (data.metrics.soilCount / 1000) * 100) },
      ]);
    } catch (e) {
      console.error('Failed to fetch ingestion stats:', e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const alertsRes = await fetch('/api/alerts?status=active&limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const alertsData = await alertsRes.json();
      const alerts = alertsData.alerts || [];

      const droughtRes = await fetch('/api/data/drought-indices?type=affected&severity=severe', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const droughtData = await droughtRes.json();
      const affectedAreas = droughtData.affectedAreas || [];

      setStats({
        totalRegions: 124, // Assuming 124 regions for now, this could be fetched from /api/regions
        severeAreas: affectedAreas.length,
        activeAlerts: alerts.filter((a: any) => a.status === 'active').length,
        averageDroughtIndex: affectedAreas.length > 0
          ? affectedAreas.reduce((sum: number, area: any) => sum + area.anomaly_score, 0) / affectedAreas.length
          : 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [topDroughtArea, setTopDroughtArea] = useState<any>(null);

  const fetchTopDroughtArea = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/data/drought-indices?type=affected&severity=severe', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.affectedAreas && data.affectedAreas.length > 0) {
        setTopDroughtArea(data.affectedAreas[0]);
      }
    } catch (e) {
      console.error('Failed to fetch top drought area:', e);
    }
  };

  const fetchAIIntelligence = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/ai/intelligence', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAiTelemetry(data.summary);
      setInferencePulse(data.trends);
      setRadarData(data.radar);
    } catch (e) {
      console.error('Failed to fetch AI intelligence:', e);
    }
  };

  const fetchDecisionAdvisory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/decisions/advisory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDecisionAdvisory(data);
    } catch (e) {
      console.error('Failed to fetch decision advisory:', e);
    }
  };

  const fetchDispatchLogs = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/alerts/dispatch', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDispatchLogs(data.dispatches);
    } catch (e) {
      console.error('Failed to fetch dispatch logs:', e);
    }
  };

  const fetchEnvironmentalTrends = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/environmental/trends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEnvironmentalTrends(data.trends);
      setImpactData(data.impact);
    } catch (e) {
      console.error('Failed to fetch environmental trends:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const [profileRes, systemRes] = await Promise.all([
        fetch('/api/settings/profile', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/settings/system', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const profileData = await profileRes.json();
      const systemData = await systemRes.json();
      setUserProfile(profileData);
      setSystemSettings(systemData);
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/analytics/report?days=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleTriggerEtl = async () => {
    setEtlStatus('Running...');
    try {
      const token = localStorage.getItem('auth_token');
      // Execute weather collection in real-time
      const res = await fetch('/api/data/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          datasource: 'Global Sync Trigger',
          regions: [
            { region_id: 1, temperature: 25, precipitation: 0.1, humidity: 45, wind_speed: 12, evapotranspiration: 4, ndvi: 0.32, vci: 28, soil_moisture: 18 }
          ]
        })
      });
      if (res.ok) {
        setEtlStatus('Success');
        setLastRun(new Date().toLocaleTimeString());
        fetchIngestionStats();
      } else {
        setEtlStatus('Error');
      }
    } catch (e) {
      setEtlStatus('Error');
    }
  };

  const handleInitializeProtocol = async (strategyId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/decisions/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ strategyId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchDecisionAdvisory(); // Refresh stats and list
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error('Failed to initialize protocol');
    }
  };

  const handleBroadcast = async () => {
    // ... same as before
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userProfile)
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
      }
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdateSystem = async (settingsKey: string, value: any) => {
    setIsSavingSettings(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/settings/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [settingsKey]: value })
      });
      if (res.ok) {
        toast.success('System configuration synchronized');
        fetchSettings();
      }
    } catch (e) {
      toast.error('Failed to update system config');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color,
    description,
  }: {
    icon: any;
    label: string;
    value: number | string;
    unit?: string;
    color: string;
    description?: string;
  }) => (
    <Card className="glass-card border-white/10 shadow-2xl group hover:border-white/30 transition-all duration-500 overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-8 -mt-8 rounded-full ${color.split(' ')[0]}`} />
      <CardContent className="pt-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black text-white tracking-tighter">
              {value}
              {unit && <span className="text-lg font-medium text-muted-foreground/60 ml-1">{unit}</span>}
            </p>
            {description && <p className="text-[11px] text-muted-foreground mt-2 font-medium">{description}</p>}
          </div>
          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <DashboardHeader
        title="MIX COMMAND CENTER"
        subtitle="Global Intelligence & Autonomous Operations Hub"
      />

      <main className="px-6 py-8 container mx-auto relative z-10">
        <Tabs defaultValue="overview" className="space-y-10">
          <div className="flex items-center justify-center border-b border-white/5 pb-6 overflow-x-auto">
            <TabsList className="bg-white/5 border border-white/10 p-1.5 shadow-2xl rounded-2xl flex-shrink-0">
              <TabsTrigger value="overview" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="console" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <Settings2 className="mr-2 h-4 w-4" /> Data Ops
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <Brain className="mr-2 h-4 w-4" /> AI Intelligence
              </TabsTrigger>
              <TabsTrigger value="decision-support" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <ShieldAlert className="mr-2 h-4 w-4" /> Decisions
              </TabsTrigger>
              <TabsTrigger value="alerts" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <Bell className="mr-2 h-4 w-4" /> Alerts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="environmental" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <Globe className="mr-2 h-4 w-4" /> Env. Intel
              </TabsTrigger>
              <TabsTrigger value="settings" className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                <Settings2 className="mr-2 h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard icon={Droplets} label="Regions" value={stats.totalRegions} color="bg-blue-500" description="Active grid coverage" />
              <StatCard icon={AlertTriangle} label="Zones" value={stats.severeAreas} color="bg-rose-500" description="Severe drought detected" />
              <StatCard icon={Clock} label="Dispatches" value={stats.activeAlerts} color="bg-amber-500" description="Active emergency alerts" />
              <StatCard icon={TrendingUp} label="Global Index" value={(stats.averageDroughtIndex * 100).toFixed(1)} unit="%" color="bg-indigo-500" description="Average moisture deficit" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <AlertsDashboard />
                <DroughtForecast regionId="sample" />
              </div>
              <div className="space-y-10">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                  <DroughtMap />
                </div>
                {topDroughtArea ? (
                  <DroughtIndexCard
                    region={topDroughtArea.name}
                    severity={topDroughtArea.severity_level}
                    anomalyScore={topDroughtArea.anomaly_score}
                    ndvi={topDroughtArea.ndvi || 0.35}
                    soilMoisture={topDroughtArea.soil_moisture || 35}
                    confidence={topDroughtArea.confidence || 87}
                    trend="worsening"
                  />
                ) : (
                  <div className="glass-card p-10 text-center border-white/10 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">No Critical Anomalies Found</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Data Console */}
          <TabsContent value="console" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard icon={Activity} label="Weather Feed" value="Active" color="bg-emerald-500" description="Open-Meteo Edge Gateway" />
              <StatCard icon={Database} label="Satellite" value="Syncing" color="bg-sky-500" description="NASA / Sentinel Hub v2" />
              <StatCard icon={FileText} label="Local Input" value="2" unit="Pending" color="bg-orange-500" description="Regional socioeconomic data" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-10">
                <Card className="glass-card border-white/5 shadow-2xl overflow-hidden rounded-[2rem]">
                  <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">Pipeline Control</CardTitle>
                      <CardDescription className="text-muted-foreground/70 font-medium tracking-wide">Manage autonomous ETL architecture.</CardDescription>
                    </div>
                    <Button size="lg" onClick={handleTriggerEtl} disabled={etlStatus === 'Running...'} className="rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      {etlStatus === 'Running...' ? <RefreshCw className="mr-3 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-3 h-4 w-4" />}
                      {etlStatus === 'Running...' ? 'Executing...' : 'Trigger Global Sync'}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8">
                    <Tabs defaultValue="quality">
                      <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
                        <TabsTrigger value="quality" className="rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white">Validation Matrix</TabsTrigger>
                        <TabsTrigger value="logs" className="rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white">Kernel Logs</TabsTrigger>
                      </TabsList>
                      <TabsContent value="quality" className="space-y-6">
                        <Table>
                          <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5">
                              <TableHead className="font-extrabold text-white text-[10px] uppercase tracking-widest">Timestamp</TableHead>
                              <TableHead className="font-extrabold text-white text-[10px] uppercase tracking-widest">Source</TableHead>
                              <TableHead className="font-extrabold text-white text-[10px] uppercase tracking-widest text-rose-400">Anomaly</TableHead>
                              <TableHead className="font-extrabold text-white text-[10px] uppercase tracking-widest">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ingestionLogs.length > 0 ? ingestionLogs.map((log, i) => (
                              <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="text-muted-foreground font-mono text-[11px]">{new Date(log.ts).toLocaleTimeString()}</TableCell>
                                <TableCell className="font-bold text-white/90">{log.source}</TableCell>
                                <TableCell className="text-emerald-400 font-black">{log.type}</TableCell>
                                <TableCell><Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-tight">{log.status}</Badge></TableCell>
                              </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-white/20 text-[10px] uppercase font-black tracking-widest">Awaiting Live Telemetry...</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent value="logs">
                        <div className="rounded-[1.5rem] bg-black/60 border border-white/5 p-8 font-mono text-[11px] leading-6 text-slate-300 shadow-inner h-[280px] overflow-y-auto">
                          <p className="text-emerald-400/80">[KERN] Autonomous Data Processor initialized.</p>
                          <p className="text-slate-500">10:05:01 - PULL_STREAM :: 25.4k records ingested.</p>
                          <p className="text-rose-500/80 font-bold">[ERR] 10:05:03 - INVALID_TELEMETRY :: NODE_45</p>
                          <p className="text-sky-500 font-bold">PIPELINE_EXEC_COMPLETE :: STATUS_CODE_0</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-10">
                <Card className="border-none shadow-2xl bg-gradient-to-br from-white/10 to-white/5 text-white rounded-[2rem] overflow-hidden group border border-white/10">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-[10px] font-black tracking-widest uppercase italic text-white/40">Stream Health Matrix</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-2">Data Integrity</p>
                        <p className="text-5xl font-black text-white tracking-widest italic">{integrity.toFixed(1)}%</p>
                      </div>
                      <Activity className={`h-12 w-12 text-white/10 ${integrity < 99 ? 'animate-pulse text-amber-500/20' : ''}`} />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">24H Neural Health Scans</p>
                      <div className="h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={streamHealth}>
                            <Bar dataKey="health" fill="#10b981" radius={[2, 2, 0, 0]} opacity={0.4} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      {loadDistribution.map((load, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                            <span className="text-white/40">{load.name}</span>
                            <span className="text-white">{load.count} PKTS</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${load.color} transition-all duration-1000`} style={{ width: `${load.width}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { l: 'Inference Load', v: aiTelemetry?.inferenceLoad || '0.0', s: 'ops/s', i: Zap, c: 'text-blue-400' },
                { l: 'Neural Uptime', v: '99.9', s: '%', i: Shield, c: 'text-emerald-400' },
                { l: 'Drift Index', v: aiTelemetry?.driftIndex || '0.000', s: 'δ', i: Activity, c: 'text-rose-400' },
                { l: 'Compute Grid', v: aiTelemetry?.modelName || 'Neural', s: aiTelemetry?.modelVersion || 'v1', i: Cpu, c: 'text-purple-400' }
              ].map(m => (
                <Card key={m.l} className="glass-card border-white/10 p-8 rounded-[2rem] group hover:border-white/30 transition-all duration-500 overflow-hidden relative">
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{m.l}</span>
                    <m.i className={`h-5 w-5 ${m.c} opacity-40`} />
                  </div>
                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-4xl font-black text-white italic tracking-tighter uppercase">{m.v}</span>
                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest ml-1">{m.s}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Neural Inference Pulse</CardTitle>
                    <CardDescription className="text-white/30 font-medium uppercase tracking-widest text-[9px] mt-2">7-Day Global Probability Baseline.</CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full ring-1 ring-emerald-500/20">Active Invariant</Badge>
                </CardHeader>
                <CardContent className="p-10 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={inferencePulse}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                      <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} style={{ fontWeight: 900 }} />
                      <YAxis stroke="#ffffff20" fontSize={10} style={{ fontWeight: 900 }} />
                      <Tooltip contentStyle={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="probability" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProb)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Model Diagnostics</CardTitle>
                    <CardDescription className="text-white/30 font-medium uppercase tracking-widest text-[9px] mt-2">Multi-vector confidence radar.</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic tracking-widest uppercase leading-none">{aiTelemetry?.avgConfidence || '0.0'}%</p>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Aggregated Confidence</p>
                  </div>
                </CardHeader>
                <CardContent className="p-10 h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Confidence" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 4: Decision Support */}
          <TabsContent value="decision-support" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {decisionAdvisory?.strategies?.slice(0, 3).map((strat: any, i: number) => (
                <Card key={i} className={`glass-card border-white/10 border-t-2 ${strat.strategy_type === 'irrigation' ? 'border-t-blue-500' :
                  strat.strategy_type === 'policy' ? 'border-t-purple-500' : 'border-t-emerald-500'
                  } shadow-2xl rounded-[2.5rem] overflow-hidden`}>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 flex items-center gap-3">
                      {strat.strategy_type === 'irrigation' ? <Droplets size={16} className="text-blue-400" /> :
                        strat.strategy_type === 'policy' ? <FileText size={16} className="text-purple-400" /> :
                          <Leaf size={16} className="text-emerald-400" />} {strat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4">
                    <p className="text-white font-black italic tracking-tighter uppercase mb-2">{strat.description}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-6">Target: {strat.region_name} | {strat.implementation_status}</p>
                    <Button
                      onClick={() => handleInitializeProtocol(strat.id)}
                      disabled={strat.implementation_status === 'ongoing' || strat.implementation_status === 'completed'}
                      className="w-full bg-white text-black font-black uppercase tracking-widest text-[9px] py-6 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:bg-white/10 disabled:text-white/20"
                    >
                      {strat.implementation_status === 'ongoing' ? 'Active' :
                        strat.implementation_status === 'completed' ? 'Finalized' : 'Initialize Protocol'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {(!decisionAdvisory?.strategies || decisionAdvisory.strategies.length === 0) && (
                <div className="lg:col-span-3 py-20 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Awaiting Strategic Invariants...</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Water Stress Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5">
                        <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Region</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Reservoir %</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Soil Stress</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {decisionAdvisory?.waterStress?.map((row: any, i: number) => (
                        <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="font-black text-white italic text-[11px] uppercase">{row.name}</TableCell>
                          <TableCell className="font-mono text-xs text-blue-400">{row.reservoir_fill_percentage}%</TableCell>
                          <TableCell className="font-mono text-xs text-rose-400">{row.soil_stress_index}</TableCell>
                          <TableCell>
                            <Badge className={`${row.stress_category === 'Critical' ? 'bg-rose-500/20 text-rose-500' :
                              row.stress_category === 'Severe' ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'
                              } border-none text-[8px] font-black uppercase tracking-tighter`}>{row.stress_category}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col justify-center items-center p-10 space-y-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Operational Readiness</p>
                  <div className="relative">
                    <div className="text-7xl font-black text-white italic tracking-tighter">98<span className="text-2xl text-white/20 ml-1">%</span></div>
                    <Activity className="absolute -top-4 -right-8 text-emerald-500/40 animate-pulse" size={40} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8 w-full">
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{decisionAdvisory?.stats?.plannedCount || 0}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Planned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{decisionAdvisory?.stats?.ongoingCount || 0}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ongoing</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{decisionAdvisory?.stats?.completedCount || 0}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Execute</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 5: Alerts Dispatch */}
          <TabsContent value="alerts" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Global Transmission Log</CardTitle>
                  <CardDescription className="text-white/30 font-medium uppercase tracking-widest text-[9px]">Real-time emergency broadcast status.</CardDescription>
                </div>
                <Button onClick={handleBroadcast} disabled={isSending} className="rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] px-10 py-6 hover:bg-white/90 disabled:bg-white/10 disabled:text-white/20">
                  <Send className={`mr-3 h-4 w-4 ${isSending ? 'animate-bounce' : ''}`} /> {isSending ? 'Transmitting...' : 'Override & Broadcast'}
                </Button>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  {dispatchLogs.length > 0 ? dispatchLogs.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex items-center space-x-6">
                        <div className="p-5 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                          {act.type === 'SMS' && <MessageSquare className="h-6 w-6 text-blue-400" />}
                          {act.type === 'Email' && <Mail className="h-6 w-6 text-orange-400" />}
                          {act.type === 'WhatsApp' && <Smartphone className="h-6 w-6 text-emerald-400" />}
                          {act.type === 'Push' && <Bell className="h-6 w-6 text-rose-500" />}
                        </div>
                        <div>
                          <p className="text-lg font-black text-white italic tracking-tighter uppercase">{act.alert}</p>
                          <p className="text-[10px] font-bold text-white/30 uppercase mt-1 tracking-widest">Target: {act.to}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="flex items-center text-[10px] font-black text-emerald-400 uppercase italic">
                          <CheckCircle2 className="h-3 w-3 mr-2" /> {act.status}
                        </div>
                        <div className="flex items-center text-[9px] font-black text-white/20 uppercase font-mono tracking-widest">
                          <Clock className="h-3 w-3 mr-2 opacity-50" /> {act.time}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">No recent transmissions detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Master Analytics */}
          <TabsContent value="analytics" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard icon={BarChart3} label="Total Records" value={analyticsData?.droughtStatistics?.total_records || 0} color="bg-indigo-500" description="Drought grid data points" />
              <StatCard icon={TrendingUp} label="Avg Anomaly" value={((analyticsData?.droughtStatistics?.avg_anomaly || 0) * 100).toFixed(1)} unit="%" color="bg-orange-500" description="Deviation from historical mean" />
              <StatCard icon={PieChartIcon} label="Confidence" value={Math.round(analyticsData?.droughtStatistics?.avg_confidence || 0)} unit="%" color="bg-emerald-500" description="Model consensus score" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-10 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analyticsData?.severityDistribution || []} dataKey="count" nameKey="severity_level" cx="50%" cy="50%" outerRadius={100} innerRadius={60} stroke="none">
                        {analyticsData?.severityDistribution?.map((entry) => (
                          <Cell key={entry.severity_level} fill={SEVERITY_COLORS[entry.severity_level] || '#999'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Regional Severity</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-4 max-h-[350px] overflow-y-auto">
                  {analyticsData?.topAffectedRegions?.slice(0, 5).map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[region.severity_level] }} />
                        <div>
                          <p className="text-[11px] font-black text-white italic tracking-tighter uppercase">{region.name}</p>
                          <p className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Intensity Grid</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white italic leading-none">{(region.anomaly_score * 100).toFixed(1)}%</p>
                        <Badge className="bg-white/10 text-[8px] font-black uppercase mt-1 border-none">{region.severity_level}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 7: Environmental Intel */}
          <TabsContent value="environmental" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Atmospheric Convergence</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-white/30 uppercase tracking-[.3em] mt-2">SPI & SPEI anomalies.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={environmentalTrends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                      <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                      <YAxis stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                      <Tooltip contentStyle={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="spi" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#000' }} />
                      <Line type="monotone" dataKey="spei" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Vegetation Pulse</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-white/30 uppercase tracking-[.3em] mt-2">Satellite VCI Index %.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={environmentalTrends}>
                      <defs>
                        <linearGradient id="colorVci" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                      <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                      <YAxis domain={[0, 100]} stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                      <Area type="monotone" dataKey="vci" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVci)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: 'Agricultural Loss Grid', icon: <Leaf className="text-emerald-500" />, items: [{ l: 'Crop Failure Risk', v: 'CRITICAL (78%)' }, { l: 'Livestock Stress', v: '8.2 / 10' }] },
                { title: 'Humanitarian Signal', icon: <Users className="text-blue-500" />, items: [{ l: 'Vulnerability Index', v: '2.4M People' }, { l: 'Market Stability', v: 'WARN' }] }
              ].map(group => (
                <Card key={group.title} className="glass-card border-white/10 p-10 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-lg font-black tracking-widest uppercase italic text-white flex items-center gap-4 mb-8">
                    {group.icon} {group.title}
                  </h3>
                  <div className="space-y-6 relative z-10">
                    {group.items.map(item => (
                      <div key={item.l} className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{item.l}</span>
                        <span className="text-xs font-black text-white italic uppercase tracking-widest">
                          {item.l.includes('Population') ? impactData?.pop || item.v :
                            item.l.includes('Economic') ? impactData?.economic || item.v : item.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Profile Management</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-white/30 uppercase tracking-[.3em] mt-2">Manage your neural identity.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        value={userProfile?.full_name || ''}
                        onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Organization</label>
                      <input
                        type="text"
                        value={userProfile?.organization || ''}
                        onChange={(e) => setUserProfile({ ...userProfile, organization: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Link (Phone)</label>
                      <input
                        type="text"
                        value={userProfile?.phone || ''}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSavingSettings}
                      className="w-full bg-white text-black font-black uppercase tracking-widest text-[10px] py-8 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Synchronizing Intelligence...' : 'Update Neural Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                  <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">System Protocol Config</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-white/30 uppercase tracking-[.3em] mt-2">Global operational parameters.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Polling Frequency</label>
                      <Badge className="bg-white/10 text-white border-none">{systemSettings?.data_polling?.interval_ms}ms</Badge>
                    </div>
                    <div className="flex gap-4">
                      {[1000, 5000, 10000, 30000].map(ms => (
                        <Button
                          key={ms}
                          onClick={() => handleUpdateSystem('data_polling', { ...systemSettings.data_polling, interval_ms: ms })}
                          className={`flex-1 text-[9px] font-black uppercase ${systemSettings?.data_polling?.interval_ms === ms ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'} rounded-xl py-6`}
                        >
                          {ms / 1000}s
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Drought Criticality Trigger</label>
                      <Badge className="bg-rose-500/20 text-rose-500 border-none">{systemSettings?.alert_thresholds?.high * 100}% Anomaly</Badge>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      value={systemSettings?.alert_thresholds?.high || 0.8}
                      onChange={(e) => handleUpdateSystem('alert_thresholds', { ...systemSettings.alert_thresholds, high: parseFloat(e.target.value) })}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <Card className="bg-black/40 border-white/5 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Autonomous Sync Status</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase mt-1">Global protocols are synchronized across 8 regional sectors.</p>
                      </div>
                    </div>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
