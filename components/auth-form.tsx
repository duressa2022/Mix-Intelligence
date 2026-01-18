'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organizationName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (onSuccess) onSuccess();
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
          </div>
        )}

        {mode === 'register' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Neural Identity"
                required={mode === 'register'}
                className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Organization</label>
              <Input
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Planetary Sector"
                className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Telemetry Node (Email)</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="node@planetary.resilience"
            required
            className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Neural Key (Password)</label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            required
            className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 transition-all"
          />
        </div>

        <Button type="submit" className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] hover:bg-white/90 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:scale-100" disabled={loading}>
          {loading ? 'Synchronizing...' : mode === 'login' ? 'Initialize Telemetry' : 'Generate Neural Access'}
        </Button>
      </form>
    </div>
  );
}
