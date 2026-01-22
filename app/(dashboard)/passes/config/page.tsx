'use client';

import React from 'react';
import {
    Settings2,
    Save,
    Clock,
    ShieldCheck,
    AlertTriangle,
    Calendar,
    Users,
    ChevronRight,
    Lock,
    Unlock,
    RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PassConfigurationPage() {
    const [isSaving, setIsSaving] = React.useState(false);
    const [configs, setConfigs] = React.useState({
        maxMonthlyPasses: 4,
        allowAutomaticApproval: true,
        autoApprovalDayThreshold: 2,
        unauthorizedEntryAlert: true,
        requireParentalConsent: true,
        bufferTimeMinutes: 30,
        holidayLogic: 'Strict',
        emergencyBypass: false
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Gate Pass configurations updated successfully.');
        }, 1500);
    };

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-[#1e3a5f]" />
                        Pass Configuration
                    </h2>
                    <p className="text-slate-500 font-medium">Define global policies, approval workflows, and security constraints for gate passes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setConfigs({
                            maxMonthlyPasses: 4,
                            allowAutomaticApproval: true,
                            autoApprovalDayThreshold: 2,
                            unauthorizedEntryAlert: true,
                            requireParentalConsent: true,
                            bufferTimeMinutes: 30,
                            holidayLogic: 'Strict',
                            emergencyBypass: false
                        })}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset Defaults</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Policy</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Policy Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Core Pass Policies
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Fundamental rules applied to every pass request.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Max Passes per Month</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="15"
                                        value={configs.maxMonthlyPasses}
                                        onChange={(e) => setConfigs({ ...configs, maxMonthlyPasses: parseInt(e.target.value) })}
                                        className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]"
                                    />
                                    <span className="w-12 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl font-black text-[#1e3a5f]">
                                        {configs.maxMonthlyPasses}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Applies to standard localized outings.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Buffer Time (Minutes)</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={configs.bufferTimeMinutes}
                                        onChange={(e) => setConfigs({ ...configs, bufferTimeMinutes: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#1e3a5f]/5"
                                    >
                                        <option value={15}>15 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={45}>45 Minutes</option>
                                        <option value={60}>1 Hour</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Extra time allowed before reporting delay.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#1e3a5f]/20 transition-all">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">Parental Consent</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Requires OTP verification</p>
                                </div>
                                <button
                                    onClick={() => setConfigs({ ...configs, requireParentalConsent: !configs.requireParentalConsent })}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        configs.requireParentalConsent ? "bg-emerald-500" : "bg-slate-300"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                        configs.requireParentalConsent ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#1e3a5f]/20 transition-all">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">Security Alerts</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Notify HOD on late returns</p>
                                </div>
                                <button
                                    onClick={() => setConfigs({ ...configs, unauthorizedEntryAlert: !configs.unauthorizedEntryAlert })}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        configs.unauthorizedEntryAlert ? "bg-emerald-500" : "bg-slate-300"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                        configs.unauthorizedEntryAlert ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                Automated Workflows
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Logic for hands-free pass processing.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600">
                                    <Unlock className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-black text-[#854d0e] uppercase tracking-tight">Auto-Approval Logic</h4>
                                        <button
                                            onClick={() => setConfigs({ ...configs, allowAutomaticApproval: !configs.allowAutomaticApproval })}
                                            className={cn(
                                                "w-10 h-5 rounded-full transition-all relative",
                                                configs.allowAutomaticApproval ? "bg-amber-500" : "bg-slate-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                                configs.allowAutomaticApproval ? "left-5.5" : "left-0.5"
                                            )} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">Automatically approve local outing requests if submitted by 5-star rated students with zero violations in the last 30 days.</p>

                                    {configs.allowAutomaticApproval && (
                                        <div className="mt-4 pt-4 border-t border-amber-200/50 flex items-center gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-none">Day Limit</p>
                                                <input
                                                    type="number"
                                                    value={configs.autoApprovalDayThreshold}
                                                    onChange={(e) => setConfigs({ ...configs, autoApprovalDayThreshold: parseInt(e.target.value) })}
                                                    className="w-16 bg-white/50 border border-amber-200 rounded-lg px-2 py-1 text-xs font-black text-amber-900 outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter max-w-[140px]">Max duration (days) for auto-approval eligibility.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-[#1e3a5f] text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Policy Summary</h3>
                            <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">These rules are applied in real-time to the Student App and HOD Portal.</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-bold py-2 border-b border-white/10">
                                    <span className="text-white/60">Strictness Level:</span>
                                    <span className="text-emerald-400">OPTIMIZED</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold py-2 border-b border-white/10">
                                    <span className="text-white/60">Conflict Resolution:</span>
                                    <span className="text-amber-400">MANUAL BYPASS</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold py-2">
                                    <span className="text-white/60">Active Profiles:</span>
                                    <span>Hostel v2.4</span>
                                </div>
                            </div>
                        </div>
                        <Lock className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="dashboard-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/50">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#c32026] mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Critical Notice
                        </h4>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                            Changing these policies will trigger a system-wide re-validation of all "Pending" pass requests currently in the approval queue.
                        </p>
                    </div>

                    <div className="p-1">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Quick Shortcuts</h4>
                        <div className="space-y-2">
                            {[
                                { title: 'Emergency Protocols', icon: AlertTriangle, color: 'text-red-500' },
                                { title: 'Holiday Exceptions', icon: Calendar, color: 'text-blue-500' },
                                { title: 'Group Pass Rules', icon: Users, color: 'text-purple-500' },
                            ].map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#1e3a5f] hover:translate-x-1 transition-all group shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("w-4 h-4", item.color)} />
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#1e3a5f]">{item.title}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e3a5f]" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
