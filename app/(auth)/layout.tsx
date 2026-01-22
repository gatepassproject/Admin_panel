import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-geist-sans">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#1e3a5f]/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#c32026]/5 blur-[120px] rounded-full delay-1000 animate-pulse" />

                {/* Modern Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#1e3a5f 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <div className="w-full max-w-[440px] relative z-10 flex flex-col space-y-8">
                {/* Brand Header */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#c32026]/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200 border border-slate-100 relative z-10 p-4 transform hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="w-full h-full text-[#1e3a5f]" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex flex-col uppercase italic">
                            <span className="text-[#1e3a5f]">Smart Gate</span>
                            <span className="text-[#c32026] -mt-2">Pass</span>
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-slate-200" />
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Institutional Console</p>
                            <div className="h-px w-8 bg-slate-200" />
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(30,58,95,0.1)] overflow-hidden transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(30,58,95,0.15)] ring-1 ring-slate-100/50">
                    <div className="p-10">
                        {children}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center space-y-4 px-6">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        &copy; 2026 CT Group Security Division
                        <br />
                        <span className="opacity-50 font-medium">Empowering Campus Safety through Innovation</span>
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-slate-900">Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span className="text-[9px] font-black uppercase text-slate-900">Uptime 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
