'use client';

import React from 'react';
import {
    ShieldCheck,
    Lock,
    Key,
    UserX,
    Fingerprint,
    ShieldAlert,
    Save,
    RotateCcw,
    Eye,
    EyeOff,
    Terminal,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SecuritySettingsPage() {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showPassword, setShowPassword] = React.useState(false);
    const [settings, setSettings] = React.useState({
        mfaEnabled: true,
        sessionTimeout: 30,
        enforceStrongPasswords: true,
        logAllAdminActions: true,
        autoLockOnIdle: true,
        ipRestriction: false,
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.security) setSettings(data.security);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'security', data: settings })
            });
            if (res.ok) {
                alert('Security policies updated successfully.');
            } else {
                alert('Failed to save settings.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading settings...</div>;

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-[#c32026]" />
                        Security Infrastructure
                    </h2>
                    <p className="text-slate-500 font-medium">Protect the admin portal with enterprise-grade access control and encryption.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c32026] hover:bg-[#c32026]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#c32026]/20 transition-all disabled:opacity-50" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Policy</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Auth Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <Key className="w-5 h-5 text-[#1e3a5f]" />
                                Authentication & Access
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Control how users authenticate and maintain sessions.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-[#1e3a5f]/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1e3a5f]">
                                        <Fingerprint className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Multi-Factor Authentication (MFA)</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Required for all Admin & HOD accounts</p>
                                    </div>
                                </div>
                                <ToggleButton active={settings.mfaEnabled} onClick={() => setSettings({ ...settings, mfaEnabled: !settings.mfaEnabled })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1e3a5f]">
                                        <Clock className="w-3.5 h-3.5" />
                                        Session Timeout
                                    </div>
                                    <select
                                        value={settings.sessionTimeout}
                                        onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none shadow-sm"
                                    >
                                        <option value={15}>15 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={45}>45 Minutes (Optimized)</option>
                                        <option value={60}>1 Hour</option>
                                    </select>
                                    <p className="text-[10px] text-slate-400 font-medium">Auto-logout after inactivity.</p>
                                </div>

                                <div className="space-y-3 p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1e3a5f]">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            Password Policy
                                        </div>
                                        <ToggleButton active={settings.enforceStrongPasswords} onClick={() => setSettings({ ...settings, enforceStrongPasswords: !settings.enforceStrongPasswords })} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 mt-1">Min 8 chars, 1 Special, 1 Number.</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Prevents brute-force vulnerabilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-[#c32026]" />
                                Admin Audit Trail
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Log every internal action for security compliance.</p>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">System Action Logging</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                    Record every database mutation, login attempt, and policy change. Logs are stored for <span className="text-slate-900 font-black">365 days</span>.
                                </p>
                            </div>
                            <ToggleButton active={settings.logAllAdminActions} onClick={() => setSettings({ ...settings, logAllAdminActions: !settings.logAllAdminActions })} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-slate-900 text-white">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[#fec20f]" />
                            Public API Key
                        </h4>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group">
                            <code className="text-[10px] font-bold text-slate-300 truncate mr-4">
                                ct_gate_live_#7281_82x92...
                            </code>
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium">
                            Use this key to authorize IoT devices at the edge. Keep it confidential.
                        </p>
                    </div>

                    <div className="dashboard-card p-6 border-dashed border-2 border-[#c32026]/10 bg-red-50/10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                <UserX className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#c32026] mb-1">Blacklist Protocol</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    3 devices were automatically banned due to multiple <span className="text-[#c32026] font-bold">invalid handshakes</span> in the last hour.
                                </p>
                                <button className="mt-3 text-[10px] font-black text-[#c32026] uppercase underline tracking-widest">Review Banned Hardware</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleButton({ active, onClick }: { active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-6 rounded-full transition-all relative shrink-0",
                active ? "bg-emerald-500" : "bg-slate-300"
            )}
        >
            <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                active ? "left-7" : "left-1"
            )} />
        </button>
    );
}
