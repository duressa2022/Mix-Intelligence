'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-6 py-5 container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <img src="/logo.png" alt="Mix Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-[0.3em] uppercase">{title}</h1>
              {subtitle && <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1 opacity-60">{subtitle}</p>}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {user && (
              <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{user.name}</p>
                <p className="text-[9px] text-muted-foreground font-medium lowercase tracking-tighter opacity-50">{user.email}</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10 rounded-xl px-5 border border-white/10">
              <LogOut size={14} className="mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
            </Button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-5 space-y-4 md:hidden py-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
            {user && (
              <div className="py-2">
                <p className="text-xs font-black text-white uppercase">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full bg-white/5 border-white/10 text-white rounded-xl py-6" onClick={handleLogout}>
              <LogOut size={16} className="mr-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logout System</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

