import Link from 'next/link';
import AuthForm from '@/components/auth-form';
import { Droplets } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#02040a] relative overflow-hidden flex items-center justify-center px-4 font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[180px] rounded-full -z-10" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-[2rem] mb-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <Droplets className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">
            Initialize Grid
          </h1>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] leading-relaxed">
            Architect planetary-scale resilience
          </p>
        </div>

        <div className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <AuthForm mode="register" />
        </div>

        <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-10">
          Already synchronize?{' '}
          <Link href="/login" className="text-white hover:text-blue-400 transition-colors">
            Neural Access
          </Link>
        </p>
      </div>
    </div>
  );
}
