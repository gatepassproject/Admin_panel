'use client';

import React from 'react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [step, setStep] = React.useState<'email' | 'otp' | 'new-password' | 'success'>('email');
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 1200);
    };

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleVerifyOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('new-password');
        }, 1200);
    };

    const handleSetNewPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('success');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {step === 'email' && (
                <>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-[#c32026] rounded-full inline-block" />
                            Recovery
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Reset your master access credentials.</p>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Command Email</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-[#1e3a5f] transition-all duration-300" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@ctgroup.com"
                                    className="w-full pl-14 pr-4 py-4.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-0 focus:border-[#1e3a5f] focus:bg-white outline-none transition-all duration-300 font-bold text-slate-900 group-hover/input:bg-slate-50 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full py-5 bg-[#1e3a5f] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_-12px_rgba(30,58,95,0.3)] transition-all duration-300"
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#fec20f]" /> : <>Send Recovery Code <ArrowRight className="w-5 h-5" /></>}
                            </span>
                        </button>
                    </form>
                </>
            )}

            {step === 'otp' && (
                <div className="space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-[#fec20f] rounded-full inline-block" />
                            Verify
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Enter the recovery code sent to {email}.</p>
                    </div>

                    <div className="flex justify-between gap-2.5">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                className="w-full aspect-[3/4] text-center text-2xl font-black bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-[#fec20f] focus:bg-white focus:ring-0 outline-none transition-all duration-300 shadow-inner"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.some(v => v === '')}
                        className="w-full py-5 bg-[#1e3a5f] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all"
                    >
                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Confirm Code'}
                    </button>
                </div>
            )}

            {step === 'new-password' && (
                <form onSubmit={handleSetNewPassword} className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-emerald-500 rounded-full inline-block" />
                            New Access
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Establish your new master key.</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            required
                            type="password"
                            placeholder="New Master Password"
                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
                        />
                        <input
                            required
                            type="password"
                            placeholder="Confirm Master Password"
                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl"
                    >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> : 'Reset Password'}
                    </button>
                </form>
            )}

            {step === 'success' && (
                <div className="text-center space-y-6 py-4">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl mx-auto flex items-center justify-center border-4 border-emerald-100 shadow-xl shadow-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Access Restored</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80 px-4">Your administrative credentials have been successfully updated.</p>
                    </div>
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-3 w-full py-5 bg-[#1e3a5f] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20"
                    >
                        Sign in to Console <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            )}

            {step !== 'success' && (
                <div className="pt-4 text-center">
                    <Link href="/login" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Authorization
                    </Link>
                </div>
            )}
        </div>
    );
}
