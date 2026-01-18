'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertTriangle, Droplets, Leaf, ShieldAlert,
    TrendingUp, Map as MapIcon, ClipboardCheck, ArrowUpRight
} from 'lucide-react';

export default function DecisionSupportPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-rose-600/10 blur-[150px] rounded-full -z-10" />

            <div className="container mx-auto p-6 space-y-12 relative z-10 py-12">
                <div className="flex flex-col space-y-3">
                    <h1 className="text-sm font-black text-white italic tracking-[0.4em] uppercase opacity-50 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-white/20" /> Strategic Intelligence
                    </h1>
                    <h2 className="text-5xl font-black text-white tracking-widest uppercase italic italic">Decision Support</h2>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-2xl leading-relaxed opacity-60">
                        Expert system providing actionable policy and management recommendations based on deep-learning telemetry.
                    </p>
                </div>

                <Tabs defaultValue="advisories" className="space-y-12">
                    <TabsList className="bg-white/5 border border-white/10 p-1.5 shadow-2xl rounded-2xl">
                        <TabsTrigger value="advisories" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Current Advisories</TabsTrigger>
                        <TabsTrigger value="resources" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Resource Shifts</TabsTrigger>
                        <TabsTrigger value="planning" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Strategic Planning</TabsTrigger>
                    </TabsList>

                    <TabsContent value="advisories" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {[
                                {
                                    title: 'Agricultural Advice', icon: <Leaf className="text-emerald-400" />, border: 'border-t-emerald-500',
                                    content: { title: 'Crop Rotation Required', desc: 'Oromia East has 78% probability of severe drought. Recommend maize planting suspension.', priority: 'High', color: 'rose' }
                                },
                                {
                                    title: 'Water Management', icon: <Droplets className="text-blue-400" />, border: 'border-t-blue-500',
                                    content: { title: 'Urgent Rationing', desc: 'Reservoir levels in Somali region dropped below 20%. Recommend immediate rationing protocols.', priority: 'Critical', color: 'rose' }
                                },
                                {
                                    title: 'Humanitarian Aid', icon: <ShieldAlert className="text-amber-400" />, border: 'border-t-amber-500',
                                    content: { title: 'Food Security Monitor', desc: 'Monitor market prices in Arsi zone. Staple food prices up 15%. Pre-position aid units.', priority: 'Medium', color: 'blue' }
                                }
                            ].map(col => (
                                <Card key={col.title} className={`glass-card border-white/5 border-t-2 ${col.border} shadow-2xl rounded-[2.5rem] overflow-hidden group`}>
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-3">
                                            {col.icon} {col.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 space-y-6">
                                        <div className={`p-6 bg-white/5 rounded-[2rem] border border-white/5 group-hover:bg-white/10 transition-colors`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-sm font-black text-white italic tracking-tighter uppercase">{col.content.title}</h3>
                                                <Badge variant="outline" className={`text-[8px] font-black uppercase py-1 px-3 rounded-lg border-none ${col.content.priority === 'Critical' ? 'bg-rose-500 text-white animate-pulse' :
                                                        col.content.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {col.content.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60 mb-6">{col.content.desc}</p>
                                            <Button className="w-full bg-white text-black font-black uppercase tracking-widest text-[9px] py-6 rounded-xl hover:bg-white/90 shadow-2xl">
                                                Initialize Protocol
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                                <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Distribution Allocation Matrix</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="space-y-8">
                                    {[
                                        { region: 'Bale Zone Cluster', need: 'Critical', volume: '250,000 m³', status: 'IN_TRANSIT' },
                                        { region: 'Hararghe West Sector', need: 'High', volume: '180,000 m³', status: 'QUEUED' },
                                        { region: 'Jijiga Administrative', need: 'Moderate', volume: '120,000 m³', status: 'SCHEDULED' },
                                    ].map((row) => (
                                        <div key={row.region} className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center space-x-6">
                                                <div className={`p-4 rounded-2xl bg-black/40 border border-white/10 ${row.need === 'Critical' ? 'text-rose-500' : 'text-blue-500'}`}>
                                                    <MapIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white italic tracking-tighter uppercase">{row.region}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Allocation: {row.volume}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-3">
                                                <Badge variant={row.need === 'Critical' ? 'destructive' : 'default'} className={`text-[9px] font-black uppercase italic py-1 px-4 border-none rounded-lg ${row.need === 'Critical' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                                    }`}>{row.need}</Badge>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase font-mono tracking-widest opacity-40">{row.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="planning" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10">
                                    <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Insurance Trigger Feed</CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 pt-0">
                                    <div className="p-8 bg-black/40 border border-dashed border-white/10 rounded-[2rem] space-y-6">
                                        <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            <span>Signal: SPI-6_THRESHOLD</span>
                                            <span className="text-rose-500">BREACH_DETECTED</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest leading-relaxed">Parametric insurance payouts initiated for 4,500 smallholder farmers in Region X cluster.</p>
                                        <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 group hover:no-underline">
                                            Stream Disbursement Details <ArrowUpRight className="ml-2 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10">
                                    <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Infrastructure Topology</CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 pt-0 space-y-6">
                                    {[
                                        { label: 'Deep borehole drilling (Bale)', val: '85%', status: 'active' },
                                        { label: 'Rainwater harvesting pits', val: '1,200 Units', status: 'stable' }
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center text-[10px] font-black text-white/80 uppercase tracking-widest">
                                                <ClipboardCheck className="mr-3 h-4 w-4 text-emerald-500" />
                                                {item.label}
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-400 font-mono italic">{item.val}</span>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full h-16 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5">
                                        Expand Infrastructure Map
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

