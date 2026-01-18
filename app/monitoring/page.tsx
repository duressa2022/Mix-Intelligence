'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area
} from 'recharts';
import { MapPin, Droplets, Leaf, TrendingDown, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Dynamically import Map component to avoid SSR issues with Leaflet
const DroughtMap = dynamic(() => import('@/components/drought-map'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map Engine...</div>
});

const mockTimeseriesData = [
    { name: 'Aug', spi: -0.5, spei: -0.8, vci: 45 },
    { name: 'Sep', spi: -1.2, spei: -1.5, vci: 38 },
    { name: 'Oct', spi: -1.8, spei: -2.1, vci: 25 },
    { name: 'Nov', spi: -2.0, spei: -2.4, vci: 15 },
    { name: 'Dec', spi: -1.5, spei: -1.9, vci: 18 },
    { name: 'Jan', spi: -1.1, spei: -1.4, vci: 22 },
];

const mockWaterData = [
    { name: 'Reservoir A', capacity: 100, current: 35 },
    { name: 'Reservoir B', capacity: 150, current: 85 },
    { name: 'Reservoir C', capacity: 80, current: 20 },
    { name: 'Groundwater', capacity: 200, current: 110 },
];

export default function MonitoringPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

            <div className="container mx-auto p-6 space-y-12 relative z-10 py-12">
                <div className="flex flex-col space-y-3">
                    <h1 className="text-sm font-black text-white italic tracking-[0.4em] uppercase opacity-50 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-white/20" /> National Monitoring Hub
                    </h1>
                    <h2 className="text-5xl font-black text-white tracking-widest uppercase italic italic">Geospatial Intelligence</h2>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-2xl leading-relaxed opacity-60">
                        Professional geospatial and scientific monitoring of climate anomalies and environmental health across the continental grid.
                    </p>
                </div>

                <Tabs defaultValue="geospatial" className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <TabsList className="bg-white/5 border border-white/10 p-1.5 shadow-2xl rounded-2xl">
                            <TabsTrigger value="geospatial" className="px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                                <MapPin className="mr-3 h-4 w-4" /> Geospatial
                            </TabsTrigger>
                            <TabsTrigger value="indicators" className="px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                                <TrendingDown className="mr-3 h-4 w-4" /> Indicators
                            </TabsTrigger>
                            <TabsTrigger value="water" className="px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                                <Droplets className="mr-3 h-4 w-4" /> Water
                            </TabsTrigger>
                            <TabsTrigger value="impact" className="px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-white data-[state=active]:text-black">
                                <Users className="mr-3 h-4 w-4" /> Impact
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Sync</span>
                                <span className="text-xs font-black text-emerald-400 font-mono tracking-tighter">SUCCESS :: 0ms</span>
                            </div>
                            <div className="h-10 w-[1px] bg-white/5" />
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white font-black text-[9px] px-4 py-1.5 rounded-xl uppercase tracking-widest">
                                Live Telemetry
                            </Badge>
                        </div>
                    </div>

                    {/* Tab 1: Geospatial Heatmap */}
                    <TabsContent value="geospatial" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                            <CardHeader className="p-8 pb-4 border-b border-white/5 bg-white/5">
                                <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center justify-between">
                                    Regional Severity Index (RSI)
                                    <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px] font-black p-2">GEO_SCAN_ACTIVE</Badge>
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest opacity-60">Visualizing drought stress levels across administrative zones.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 bg-black/40">
                                <DroughtMap />
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { title: 'Critical Zones', value: '4 Sectors', color: 'bg-rose-500', desc: 'Immediate intervention recommended' },
                                { title: 'At-Risk Monitoring', value: '12 Sectors', color: 'bg-amber-500', desc: 'Pre-drought monitoring active' },
                                { title: 'Stable Infrastructure', value: '42 Sectors', color: 'bg-emerald-500', desc: 'Precipitation within normal range' },
                            ].map(s => (
                                <Card key={s.title} className="glass-card border-white/5 group hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden relative">
                                    <div className={`absolute top-0 left-0 w-full h-1 ${s.color} opacity-20`} />
                                    <CardHeader className="pb-2 p-8 pt-10">
                                        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{s.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-2">{s.value}</div>
                                        <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest leading-relaxed">{s.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Tab 2: Scientific Indicators */}
                    <TabsContent value="indicators" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem]">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase">Atmospheric Signal</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest opacity-60">SPI & SPEI Convergence analysis.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 h-[450px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mockTimeseriesData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                            <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900, textTransform: 'uppercase' }} />
                                            <YAxis stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                                itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', top: -30 }} />
                                            <Line type="monotone" dataKey="spi" stroke="#3b82f6" strokeWidth={4} name="SPI-3" dot={{ r: 4, strokeWidth: 2, fill: '#000' }} animationDuration={1500} />
                                            <Line type="monotone" dataKey="spei" stroke="#ef4444" strokeWidth={4} name="SPEI-3" dot={{ r: 4, strokeWidth: 2, fill: '#000' }} animationDuration={2000} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem]">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase">Vegetation Health (VHI)</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest opacity-60">Biomass health via predictive satellite imaging.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 h-[450px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={mockTimeseriesData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                            <defs>
                                                <linearGradient id="colorVci" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                            <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900, textTransform: 'uppercase' }} />
                                            <YAxis domain={[0, 100]} stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                                itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                            />
                                            <Area type="monotone" dataKey="vci" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVci)" name="VCI Index %" animationDuration={2500} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab 3: Water Balance */}
                    <TabsContent value="water" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem]">
                            <CardHeader className="p-8">
                                <CardTitle className="text-xl font-black text-white italic tracking-tighter uppercase">Storage Dynamics</CardTitle>
                                <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest opacity-60">Strategic resource monitoring grid (Million m³).</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 h-[500px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockWaterData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff08" />
                                        <XAxis type="number" stroke="#ffffff30" fontSize={10} style={{ fontWeight: 900 }} />
                                        <YAxis dataKey="name" type="category" width={120} stroke="#ffffff60" fontSize={10} style={{ fontWeight: 900, textTransform: 'uppercase' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                            itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', top: -30 }} />
                                        <Bar dataKey="capacity" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" name="Capacity High" radius={[0, 12, 12, 0]} barSize={24} />
                                        <Bar dataKey="current" fill="#3b82f6" name="Live Storage" radius={[0, 12, 12, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    {/* Tab 4: Socioeconomic Impact */}
                    <TabsContent value="impact" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                {
                                    title: 'Agricultural Losses', icon: <Leaf className="text-emerald-500" />, items: [
                                        { label: 'Crop Failure Risk', val: 'CRITICAL (78%)', status: 'destructive' },
                                        { label: 'Livestock Stress Index', val: '8.2 / 10' },
                                        { label: 'Projected Economic Impact', val: '$12.4M USD', color: 'text-rose-500' }
                                    ]
                                },
                                {
                                    title: 'Humanitarian Exposure', icon: <Users className="text-blue-500" />, items: [
                                        { label: 'Population Vulnerability', val: '2.4M People' },
                                        { label: 'Market Stability', val: 'INFLATION_WARN', status: 'outline' },
                                        { label: 'Water Price Index', val: '+45% YoY', color: 'text-amber-500' }
                                    ]
                                }
                            ].map(group => (
                                <Card key={group.title} className="glass-card border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="p-8">
                                        <CardTitle className="text-lg font-black tracking-widest uppercase italic text-white flex items-center gap-4">
                                            {group.icon} {group.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                                        {group.items.map(item => (
                                            <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-4">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                                {item.status ? (
                                                    <Badge variant={item.status as any} className="text-[9px] font-black italic tracking-tighter py-1 px-4 rounded-lg bg-rose-500/10 text-rose-500 border-none animate-pulse">
                                                        {item.val}
                                                    </Badge>
                                                ) : (
                                                    <span className={`text-sm font-black italic tracking-widest ${item.color || 'text-white'}`}>{item.val}</span>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

