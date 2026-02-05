'use client';

import React from 'react';
import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Briefcase,
    Zap,
    Clock,
    Hash,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewUserModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
}

export function ViewUserModal({ user, isOpen, onClose }: ViewUserModalProps) {
    if (!isOpen || !user) return null;

    const details = [
        { label: 'Official Role', value: user.role, icon: Shield, color: 'text-indigo-600 bg-indigo-50/50', accent: 'indigo' },
        { label: 'Email Address', value: user.email, icon: Mail, color: 'text-rose-600 bg-rose-50/50', accent: 'rose' },
        { label: 'Contact Number', value: user.phone || user.guardian_phone || 'Not Provided', icon: Phone, color: 'text-emerald-600 bg-emerald-50/50', accent: 'emerald' },
        { label: 'Department / Unit', value: user.department || user.dept || user.branch || 'Not Assigned', icon: Briefcase, color: 'text-amber-600 bg-amber-50/50', accent: 'amber' },
        { label: 'Roll Number', value: user.roll_no || user.student_id || user.reg_no || 'N/A', icon: Hash, color: 'text-blue-600 bg-blue-50/50', accent: 'blue' },
        { label: 'Batch / Year', value: user.batch || user.year || 'N/A', icon: GraduationCap, color: 'text-purple-600 bg-purple-50/50', accent: 'purple' },
        { label: 'Current Status', value: user.status || 'Inside', icon: Zap, color: 'text-violet-600 bg-violet-50/50', accent: 'violet', isStatus: true },
        { label: 'Registration Date', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pending', icon: Clock, color: 'text-slate-600 bg-slate-50/50', accent: 'slate' },
        { label: 'Permanent Address', value: user.address || 'No address recorded in the system.', icon: MapPin, color: 'text-slate-600 bg-slate-50/50', accent: 'slate', fullWidth: true },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[90vh] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                {/* Premium Header */}
                <div className="shrink-0 p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white relative overflow-hidden text-center md:text-left">
                    {/* Abstract Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-24 -mb-24" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl md:rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="w-20 h-20 md:w-28 md:w-28 bg-white/10 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-4xl font-black backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden">
                                <span className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                                    {user.full_name?.[0]}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-xl md:rounded-2xl border-[3px] md:border-4 border-[#1e293b] flex items-center justify-center shadow-lg">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                                <h3 className="text-xl md:text-3xl font-black tracking-tight drop-shadow-sm truncate max-w-full">
                                    {user.full_name}
                                </h3>
                                <div className="px-2.5 py-0.5 md:px-3 md:py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-blue-300 shrink-0">
                                    Verified {user.role}
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center justify-center md:justify-start gap-1.5 truncate">
                                <Mail className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-60" />
                                {user.email}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 m-4 md:relative md:m-0 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all border border-white/5 group"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content Grid - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8fafc] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 pb-2">
                        {details.map((item, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "group bg-white p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-slate-200/60 shadow-sm flex items-start gap-4 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 hover:border-blue-200",
                                    item.fullWidth && "md:col-span-2"
                                )}
                            >
                                <div className={cn(
                                    "p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-105 shadow-sm",
                                    item.color,
                                    item.isStatus && "animate-pulse"
                                )}>
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1 group-hover:text-blue-500 transition-colors">
                                        {item.label}
                                    </p>
                                    <p className={cn(
                                        "text-xs md:text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors break-words",
                                        !item.fullWidth && "truncate"
                                    )}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="shrink-0 px-6 md:px-10 py-5 md:py-8 bg-white border-t border-slate-100 flex items-center justify-between">
                    <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Ref: {user.uid?.slice(-8).toUpperCase()}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-10 py-3.5 md:py-4 bg-slate-900 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Dismiss Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
