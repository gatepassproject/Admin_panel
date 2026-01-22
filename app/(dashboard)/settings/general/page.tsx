'use client';

import React from 'react';
import {
    Building2,
    Clock,
    MapPin,
    Globe,
    ShieldCheck,
    Save,
    RefreshCw,
    Calendar,
    Settings as SettingsIcon,
    HelpCircle,
    Bell,
    Lock,
    Mail,
    Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GeneralSettingsPage() {
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="max-w-4xl space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-[#1e3a5f]" />
                        General Settings
                    </h2>
                    <p className="text-slate-500 font-medium">Configure CT Group profile and operational parameters.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Processing...' : 'Save Changes'}</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Institution Profile */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest">Institution Profile</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 group hover:border-[#1e3a5f]/40 transition-all cursor-pointer">
                            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden p-2">
                                <img
                                    src="https://www.ctgroup.in/public//frontend/assets/images/NAACCT.png"
                                    alt="CT Group Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Brand Identity</p>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Institution Name</label>
                                <input type="text" defaultValue="CT Group of Institutions" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold text-slate-900" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Name / Code</label>
                                    <input type="text" defaultValue="CT GROUP" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campus Category</label>
                                    <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-black text-slate-700">
                                        <option>University Campus</option>
                                        <option>Technical Institute</option>
                                        <option>Administrative Center</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Hours */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest">Entry Constraints</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Standard Gate Hours</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <input type="time" defaultValue="06:00" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700" />
                                        <input type="time" defaultValue="23:00" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700" />
                                    </div>
                                    <div className="flex items-center px-4 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                                        <span className="text-[10px] font-black uppercase">Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Weekend Lockdown</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <input type="time" defaultValue="08:00" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700" />
                                        <input type="time" defaultValue="21:00" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700" />
                                    </div>
                                    <div className="flex items-center px-4 py-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
                                        <span className="text-[10px] font-black uppercase">Restricted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 text-white flex items-start gap-4">
                            <HelpCircle className="w-6 h-6 text-[#fec20f] mt-0.5" />
                            <p className="text-[11px] font-bold text-slate-300 leading-relaxed uppercase tracking-wider">
                                <span className="text-[#fec20f] font-black">Control Protocol:</span> Global timing settings define the default bypass for smart card scanning. Manual override by authorized security personnel is recorded in the system audit logs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest">Campus Reach</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Support Email</label>
                            <input type="email" defaultValue="admin@ctgroup.in" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold text-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Emergency 24/7 Helpline</label>
                            <input type="tel" defaultValue="+91 181 5055127" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold text-slate-900" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campus Hub Address</label>
                            <textarea rows={3} defaultValue="CT Group of Institutions, Shahpur, Near Lambra, Nakodar Road, Jalandhar, Punjab 144020" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold text-slate-900 resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
