'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Droplets,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Brain,
  BarChart3,
  CheckCircle,
  Shield,
  Leaf,
  Users
} from 'lucide-react';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Telemetry',
      description: 'Monitor drought conditions across the continental grid with sub-second data synchronization.',
    },
    {
      icon: Brain,
      title: 'Neural Predictions',
      description: 'Deep learning models forecast drought severity and spatiotemporal anomalies 60+ days in advance.',
    },
    {
      icon: MapPin,
      title: 'Geospatial Intelligence',
      description: 'Visualizing atmospheric signals with high-fidelity geospatial heatmaps and administrative drill-down.',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Indicators',
      description: 'Comprehensive analysis of SPI, SPEI, VHI, and soil moisture balance through luminous analytics.',
    },
    {
      icon: Droplets,
      title: 'Resource Optimization',
      description: 'AI-driven management of water availability, reservoir stock, and strategic distribution.',
    },
    {
      icon: BarChart3,
      title: 'Historical Dynamics',
      description: 'Analyze multi-decadal trends and climate patterns to build planetary-scale resilience.',
    },
  ];

  const benefits = [
    'Autonomous Early Warning Grid',
    'Agricultural Impact Mitigation',
    'Strategic Water Allocation',
    'Neural Policy & Decision Support',
    'Climate Resilience Architecture',
    'Data-Driven Resource Distribution',
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 -z-10 bg-[#02040a]" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[180px] rounded-full -z-10" />

      {/* Modern High-End Top Nav */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6 group cursor-pointer transition-all">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <img src="/logo.png" alt="Mix Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Mix</span>
              <span className="text-[9px] font-black text-white/30 tracking-[0.4em] uppercase mt-1">Drought Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <Link href="/login" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-[0.3em] transition-colors">Sign In</Link>
            <Link href="/register">
              <Button className="bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] px-10 py-6 rounded-2xl hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Launch System
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Dynamic Hero Section */}
        <section className="relative px-8 pt-32 pb-40 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em]">Grid Status :: Fully Operational</span>
          </div>
          <h1 className="max-w-5xl mx-auto text-3xl md:text-4xl lg:text-[4rem] font-black text-white tracking-[-0.04em] leading-tight mb-8 italic uppercase animate-in fade-in zoom-in-95 duration-1000 whitespace-nowrap">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Drought Dynamics</span>
          </h1>
          <p className="max-w-xl mx-auto text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] leading-relaxed opacity-60 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Industry-leading neural engine for planetary-scale monitoring.
            Architecting climate resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white/90 transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.1)] group relative overflow-hidden">
                Generate Neural Access
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-12 bg-white/5 border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
              System Overview
            </Button>
          </div>
        </section>

        {/* Feature Grid with Cinematic Cards */}
        <section className="px-8 py-32 bg-white/[0.02] border-y border-white/5 reveal-section reveal-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4 mb-16 text-center">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Core Capabilities</span>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Planetary Intelligence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-700 shadow-2xl relative">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="p-6 pb-4 relative z-10">
                    <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/5 transition-all">
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-lg font-black text-white italic tracking-tighter uppercase mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 relative z-10">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest opacity-60">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cinematic Stats Section */}
        <section className="px-8 py-40 reveal-section reveal-hidden">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { l: 'Network Latency', v: '0.04ms' },
              { l: 'Data Nodes', v: '12,400+' },
              { l: 'Prediction Acc', v: '91.2%' },
              { l: 'Regions Sync', v: 'Global' }
            ].map(s => (
              <div key={s.l} className="flex flex-col gap-3 text-center">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">{s.l}</span>
                <span className="text-3xl font-black text-white italic tracking-tighter uppercase">{s.v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Architecture */}
        <section className="px-8 py-32 bg-white/[0.02] reveal-section reveal-hidden">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.5em] mb-12 text-center">System Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-5 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 transition-all group">
                  <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="text-emerald-500" size={18} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Matrix */}
        <section className="px-8 py-32 reveal-section reveal-hidden">
          <div className="max-w-4xl mx-auto rounded-[2rem] p-16 text-center glass-card border-white/5 relative overflow-hidden group shadow-[0_0_100px_rgba(255,255,255,0.05)] text-white">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -mr-64 -mt-64" />
            <Shield className="mx-auto mb-8 text-white opacity-40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" size={48} />
            <h3 className="text-4xl font-black mb-6 italic uppercase tracking-tighter">Initialize Protocol</h3>
            <p className="max-w-xl mx-auto text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 mb-10 leading-relaxed">
              Join the elite network of water resource managers and agricultural strategists building the future of planetary resilience.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-16 px-16 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Corporate Black Footer */}
      <footer className="border-t border-white/5 bg-black/60 px-8 py-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Mix Logo" className="w-6 h-6 object-contain opacity-40" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-white italic tracking-tighter uppercase opacity-40">Mix</span>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">© 2024 Planetary Grid Operations</span>
            </div>
          </div>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] md:text-right leading-loose max-w-md ml-auto">
            Advanced drought dynamics and management platform engineered for water resource planning and planetary resilience grid. Unauthorized telemetry prohibited.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .reveal-hidden {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />
    </div>
  );
}

