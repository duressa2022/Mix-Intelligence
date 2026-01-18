'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell, MessageSquare, Mail, Smartphone,
    Send, History, ShieldAlert, CheckCircle2, Clock
} from 'lucide-react';

const mockActivity = [
    { id: 1, type: 'SMS', to: '4.5k Farmers', status: 'Delivered', time: '2m ago', alert: 'Early Warning' },
    { id: 2, type: 'Email', to: 'Regional Officials', status: 'Sent', time: '15m ago', alert: 'Policy Update' },
    { id: 3, type: 'WhatsApp', to: 'Agri-Coop Leads', status: 'Read', time: '1h ago', alert: 'Market Flux' },
    { id: 4, type: 'Push', to: 'Mobile App Users', status: 'Delivered', time: '3h ago', alert: 'Heat Warning' },
];

export default function AlertsPage() {
    const [isSending, setIsSending] = useState(false);

    const simulateDispatch = () => {
        setIsSending(true);
        setTimeout(() => setIsSending(false), 2000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full -z-10" />

            <div className="container mx-auto p-6 space-y-12 relative z-10 py-12">
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-end border-b border-white/5 pb-10">
                    <div className="space-y-3">
                        <h1 className="text-sm font-black text-white italic tracking-[0.4em] uppercase opacity-50 flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-white/20" /> Emergency Communications
                        </h1>
                        <h2 className="text-5xl font-black text-white tracking-widest uppercase italic italic">Alert Dispatch</h2>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-xl leading-relaxed opacity-60">
                            Manage multi-channel emergency communication systems. Broadcast early warnings across satellite and terrestrial grids.
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-[0.2em] text-[9px] px-8 py-7 hover:bg-white/10">
                            <History className="mr-3 h-4 w-4 opacity-40" /> Archive Logs
                        </Button>
                        <Button onClick={simulateDispatch} disabled={isSending} className="rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] px-10 py-7 hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            <Send className="mr-3 h-4 w-4" /> {isSending ? 'Initializing Signal...' : 'Override & Broadcast'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Total SMS Traffic', value: '184.2k', icon: <MessageSquare className="h-4 w-4 text-blue-400" /> },
                        { label: 'Email Saturation', value: '12.8k', icon: <Mail className="h-4 w-4 text-orange-400" /> },
                        { label: 'Network Uptime', value: '98.4%', icon: <Smartphone className="h-4 w-4 text-emerald-400" /> },
                        { label: 'Active Alerts', value: '04', icon: <Bell className="h-4 w-4 text-rose-500 animate-pulse" /> },
                    ].map((stat) => (
                        <Card key={stat.label} className="glass-card border-white/5 hover:border-white/10 transition-all rounded-[2rem] overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                                <CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em]">{stat.label}</CardTitle>
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">{stat.icon}</div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="live" className="space-y-12">
                    <TabsList className="bg-white/5 border border-white/10 p-1.5 shadow-2xl rounded-2xl">
                        <TabsTrigger value="live" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Transmission Feed</TabsTrigger>
                        <TabsTrigger value="channels" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Gateway Hub</TabsTrigger>
                        <TabsTrigger value="templates" className="px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black">Protocols</TabsTrigger>
                    </TabsList>

                    <TabsContent value="live" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                                <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Global Transmission Log</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="space-y-6">
                                    {mockActivity.map((act) => (
                                        <div key={act.id} className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center space-x-6">
                                                <div className="p-5 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                                                    {act.type === 'SMS' && <MessageSquare className="h-6 w-6 text-blue-400" />}
                                                    {act.type === 'Email' && <Mail className="h-6 w-6 text-orange-400" />}
                                                    {act.type === 'WhatsApp' && <Smartphone className="h-6 w-6 text-emerald-400" />}
                                                    {act.type === 'Push' && <Bell className="h-6 w-6 text-rose-500" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-lg font-black text-white italic tracking-tighter uppercase">{act.alert}</p>
                                                        <Badge variant="outline" className="text-[8px] font-black uppercase py-0.5 px-3 rounded-lg bg-white/5 border-white/10 text-white/60">{act.type}</Badge>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">Target Path: {act.to}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <div className="flex items-center text-[10px] font-black text-emerald-400 uppercase italic">
                                                    <CheckCircle2 className="h-3 w-3 mr-2" /> {act.status}
                                                </div>
                                                <div className="flex items-center text-[9px] font-black text-white/30 uppercase font-mono tracking-widest">
                                                    <Clock className="h-3 w-3 mr-2 opacity-50" /> {act.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="channels" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { title: 'SMS Gateway (Twilio)', metrics: [{ l: 'Signal Status', v: 'OPERATIONAL', c: 'text-emerald-400' }, { l: 'Active Grid Nu', v: '04', c: 'text-white' }], desc: 'Rate limit: 100 msg/sec encryption enabled.' },
                                { title: 'Email Relay (SendGrid)', metrics: [{ l: 'Reputation Score', v: '99.8%', c: 'text-emerald-400' }, { l: 'Bounce Rate', v: '0.1%', c: 'text-white' }], desc: 'DMARC/SPF/DKIM protocols verified.' }
                            ].map(gate => (
                                <Card key={gate.title} className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden group">
                                    <CardHeader className="p-10">
                                        <CardTitle className="text-lg font-black text-white italic tracking-widest uppercase">{gate.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-10 pt-0 space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            {gate.metrics.map(m => (
                                                <div key={m.l} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">{m.l}</p>
                                                    <p className={`text-xl font-black italic tracking-tighter ${m.c}`}>{m.v}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed">{gate.desc}</p>
                                        <Button variant="outline" className="w-full py-7 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                                            Manage Neural Gateway
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-10 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10">
                                <CardTitle className="text-xl font-black text-white italic tracking-widest uppercase">Multi-lingual Signal Protocols</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 pt-0">
                                <div className="grid gap-6">
                                    {['Amharic', 'Oromo', 'Somali', 'English'].map(lang => (
                                        <div key={lang} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                            <span className="text-[11px] font-black text-white/80 uppercase tracking-widest group-hover:text-white transition-colors">{lang} Extreme Heat Protocol</span>
                                            <Badge variant="outline" className="text-[9px] font-black text-blue-400 uppercase tracking-widest">View Protocol</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

