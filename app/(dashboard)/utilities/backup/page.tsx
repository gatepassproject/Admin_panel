'use client';

import React from 'react';
import {
    Database,
    RotateCcw,
    Download,
    Cloud,
    HardDrive,
    History,
    CheckCircle2,
    RefreshCw,
    AlertTriangle,
    Clock,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackupRestorePage() {
    const [isBackingUp, setIsBackingUp] = React.useState(false);

    const handleBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => {
            setIsBackingUp(false);
            alert('Full system snapshot created successfully.');
        }, 3000);
    };

    const backups = [
        { id: 1, name: 'Weekly_Full_Snapshot_v2.4', date: '22 Oct 2025', time: '04:00 AM', size: '154 MB', type: 'Auto' },
        { id: 2, name: 'Post_User_Import_Batch_4', date: '20 Oct 2025', time: '11:24 PM', size: '142 MB', type: 'Manual' },
        { id: 3, name: 'System_Init_Stable', date: '15 Oct 2025', time: '08:00 AM', size: '128 MB', type: 'Manual' },
    ];

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Database className="w-8 h-8 text-[#1e3a5f]" />
                        Backup & Restore
                    </h2>
                    <p className="text-slate-500 font-medium">Protect campus data with versioned snapshots and disaster recovery tools.</p>
                </div>
                <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="flex items-center gap-3 px-8 py-3 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#1e3a5f]/20 transition-all disabled:opacity-50"
                >
                    {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                    <span>Create Snapshot Now</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Storage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="dashboard-card p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-blue-50 text-[#1e3a5f] rounded-2xl">
                                    <Cloud className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cloud Sync Status</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">Google Cloud Storage</h3>
                                <p className="text-xs text-slate-500 font-medium mt-2">Daily auto-sync enabled at 02:00 AM</p>
                            </div>
                        </div>

                        <div className="dashboard-card p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                    <HardDrive className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1.2 GB / 50 GB</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Used</p>
                                <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[2.4%]" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">97.6% Capacity Remaining</p>
                            </div>
                        </div>
                    </div>

                    {/* Snapshot History Table */}
                    <div className="dashboard-card overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Snapshot Repository
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Snapshot Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created On</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Size</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {backups.map((bk) => (
                                        <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-[#1e3a5f]/10 group-hover:text-[#1e3a5f] transition-all">
                                                        <Database className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-900">{bk.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-900 leading-none">{bk.time}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{bk.date}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-600 uppercase">{bk.size}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                                    bk.type === 'Auto' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                                )}>{bk.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all" title="Restore">
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-slate-900 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                Data Integrity
                            </h3>
                            <div className="space-y-4">
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Every snapshot is encrypted with <span className="text-white font-bold">AES-256</span> and validated for consistency before storage.
                                </p>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Integrity Check</span>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">PASSED</span>
                                    </div>
                                    <p className="text-xs font-black">Oct 22, 2025 • 03:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card p-8 border-dashed border-2 border-[#1e3a5f]/20 bg-[#1e3a5f]/5 text-[#1e3a5f]">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <AlertTriangle className="w-5 h-5 text-[#c32026]" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Recovery Note</h4>
                                <p className="text-xs font-medium leading-relaxed opacity-80">
                                    Restoring a snapshot will overwrite current data. Ensure all active gate devices are <span className="font-bold underline">Offline</span> before initiating recovery.
                                </p>
                                <button className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-all">
                                    Full Recovery Guide <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
