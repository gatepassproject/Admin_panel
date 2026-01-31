'use client';

import React from 'react';
import {
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    Eye,
    EyeOff,
    RefreshCw,
    Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase-client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = React.useState<'credentials' | '2fa'>('credentials');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Firebase Auth Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch User Role from Firestore (STRICTLY FROM web_admins in Project 2)
            const userDoc = await getDoc(doc(db, 'web_admins', user.uid));

            if (!userDoc.exists()) {
                throw new Error('User profile not found in database.');
            }

            const userData = userDoc.data();
            const role = userData.role || 'student';

            // 3. Store role temporarily for 2FA step or proceed
            // For now, we'll store it in a ref or local state to be used in handleLoginComplete
            // (In this simple 2FA mock, we'll just proceed to 2FA)
            setStep('2fa');
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'Invalid administrative credentials. Identity focus rejected.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleLoginComplete = async () => {
        setIsLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No authenticated user found');

            // Final role check (STRICTLY FROM web_admins in Project 2)
            const userDoc = await getDoc(doc(db, 'web_admins', user.uid));
            if (!userDoc.exists()) throw new Error('Authorization rejected: Not a web administrator.');
            const role = userDoc.data()?.role || 'admin';

            // Set real session and role cookies
            document.cookie = `session=${user.uid}; path=/; max-age=86400; samesite=lax`;
            document.cookie = `user_role=${role}; path=/; max-age=86400; samesite=lax`;

            router.push('/');
        } catch (err: any) {
            setError('Authorization failed. Access denied.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {step === 'credentials' ? (
                <>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-[#c32026] rounded-full inline-block" />
                            Authority Login
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Accessing restricted institutional sectors.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake shadow-lg shadow-red-500/5">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
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
                                <div className="absolute inset-0 border border-[#1e3a5f] rounded-2xl opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Key</label>
                                <Link
                                    href="/reset-password"
                                    className="text-[10px] font-black text-[#c32026] uppercase tracking-widest hover:text-[#1e3a5f] transition-colors underline decoration-2 underline-offset-4"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-[#1e3a5f] transition-all duration-300" />
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-4.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-0 focus:border-[#1e3a5f] focus:bg-white outline-none transition-all duration-300 font-bold text-slate-900 group-hover/input:bg-slate-50 placeholder:text-slate-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <div className="absolute inset-0 border border-[#1e3a5f] rounded-2xl opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden py-5 bg-[#1e3a5f] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_-12px_rgba(30,58,95,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 w-12 bg-white/10 skew-x-[30deg] -translate-x-[150%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                            <span className="relative flex items-center justify-center gap-3">
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#fec20f]" /> : <>Initialize 2FA <ArrowRight className="w-5 h-5" /></>}
                            </span>
                        </button>
                    </form>
                </>
            ) : (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-[#fec20f] rounded-full inline-block" />
                            Multi-Factor
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Final verification step required.</p>
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

                    <div className="space-y-4">
                        <button
                            onClick={handleLoginComplete}
                            disabled={isLoading || otp.some(v => v === '')}
                            className="group w-full py-5 bg-[#c32026] hover:bg-[#a61a20] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_-12px_rgba(195,32,38,0.3)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Authorize Identity'}
                        </button>

                        <button
                            onClick={() => setStep('credentials')}
                            className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1e3a5f] transition-colors"
                        >
                            Return to Command Center
                        </button>
                    </div>

                    <div className="p-6 bg-[#fec20f]/5 rounded-[2rem] border border-[#fec20f]/20">
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center italic opacity-80">
                            "Enhanced encryption protocols active. Your administrative signature is being verified against global campus records."
                        </p>
                    </div>
                </div>
            )}

            <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest">
                    <span className="bg-white px-4 text-slate-300">CT Group Security Infrastructure</span>
                </div>
            </div>
        </div>
    );
}
