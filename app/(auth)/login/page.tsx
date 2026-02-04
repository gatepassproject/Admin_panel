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
    Fingerprint,
    Building2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { auth, firestore as db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { DEPARTMENTS, getDepartmentCollectionName, type DepartmentCode, getAllCategories, getDepartmentsByCategory } from '@/lib/constants/departments';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator
} from "@/components/ui/select";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = React.useState<'department' | 'credentials'>('department');

    // Clear cookies on mount to ensure fresh login
    React.useEffect(() => {
        document.cookie = 'session=; path=/; max-age=0;';
        document.cookie = 'user_role=; path=/; max-age=0;';
        document.cookie = 'user_department=; path=/; max-age=0;';
    }, []);
    const [department, setDepartment] = React.useState<DepartmentCode | ''>('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleDepartmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!department) {
            setError('Please select a department');
            return;
        }
        setError('');
        setStep('credentials');
    };

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!department) throw new Error('Department not selected');

            console.log('🏁 Initiating Professional Remote Authentication...');

            // Call the new Server-Side Login API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, department })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Identity focus rejected.');
            }

            console.log('✅ Identity Verified via Secure API. Finalizing session...');

            // SUCCESS! Set session (descriptive UID), role, and department cookies
            const { user } = data;
            document.cookie = `session=${user.uid}; path=/; max-age=86400; samesite=lax`;
            document.cookie = `user_role=${user.role}; path=/; max-age=86400; samesite=lax`;
            document.cookie = `user_department=${user.department || department}; path=/; max-age=86400; samesite=lax`;

            // Force a hard navigation to ensure middleware runs
            window.location.href = '/';

        } catch (err: any) {
            console.error('Login Sequence Failure:', err);
            setError(err.message || 'Authentication sequence failed. Access denied.');
        } finally {
            setIsLoading(false);
        }
    };

    const categories = getAllCategories();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {step === 'department' ? (
                <>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase italic flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-[#c32026] rounded-full inline-block" />
                            Select Department
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">Choose your department to access the system.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake shadow-lg shadow-red-500/5">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Department</label>
                            <div className="relative group/input">
                                <Select value={department} onValueChange={(value) => setDepartment(value as DepartmentCode)}>
                                    <SelectTrigger className="w-full pl-6 pr-4 py-8 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-0 focus:border-[#1e3a5f] focus:bg-white transition-all duration-300 shadow-sm hover:border-[#1e3a5f]/30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 rounded-xl group-hover/input:bg-[#1e3a5f]/10 transition-colors duration-300">
                                                <Building2 className="w-4 h-4 text-slate-400 group-hover/input:text-[#1e3a5f] transition-colors duration-300" />
                                            </div>
                                            <SelectValue placeholder="Select your department..." />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {categories.map(category => (
                                            <SelectGroup key={category}>
                                                <SelectLabel>{category}</SelectLabel>
                                                {getDepartmentsByCategory(category).map(dept => (
                                                    <SelectItem key={dept.code} value={dept.code}>
                                                        <span className="font-mono text-xs opacity-50 mr-2">{dept.code}</span>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                                <SelectSeparator />
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!department}
                            className="group relative w-full overflow-hidden py-5 bg-[#1e3a5f] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_-12px_rgba(30,58,95,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 w-12 bg-white/10 skew-x-[30deg] -translate-x-[150%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                            <span className="relative flex items-center justify-center gap-3">
                                Continue to Login <ArrowRight className="w-5 h-5" />
                            </span>
                        </button>
                    </form>
                </>
            ) : step === 'credentials' ? (
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
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#fec20f]" /> : <>Authorize Identity <ArrowRight className="w-5 h-5" /></>}
                            </span>
                        </button>
                    </form>
                </>
            ) : null}

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
