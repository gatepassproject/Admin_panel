'use client';

import React from 'react';
import {
    Terminal,
    Search,
    Filter,
    Activity,
    Server,
    Database,
    ShieldCheck,
    AlertCircle,
    XCircle,
    Cpu,
    RefreshCw,
    Download,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SystemLogsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filter, setFilter] = React.useState('All');

    const logs = [
        { id: 1, type: 'Info', source: 'AuthEngine', message: 'User CT2021042 successfully authenticated via MFA.', time: 'Just Now' },
        { id: 2, type: 'Warning', source: 'Hardware', message: 'Gate 03 latency exceeded 200ms threshold.', time: '5 mins ago' },
        { id: 3, type: 'Error', source: 'Firebase', message: 'Quota exceeded for Cloud Messaging (FCM) downstream.', time: '12 mins ago' },
        { id: 4, type: 'Critical', source: 'Security', message: 'Multiple brute-force attempts detected from IP 192.168.1.45', time: '22 mins ago' },
        { id: 5, type: 'Info', source: 'Database', message: 'Scheduled backup of "Students" collection completed.', time: '45 mins ago' },
        { id: 6, type: 'Info', source: 'API', message: 'Policy update broadcasted to all edge devices.', time: '1 hour ago' },
    ];

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-slate-900" />
                        Infrastructure Logs
                    </h2>
                    <p className="text-slate-500 font-medium">Real-time developer & admin audit trail for system health monitoring.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all shadow-sm">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export Logs</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Health Metrics */}
                {[
                    { label: 'Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'CPU Load', value: '14.2%', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'DB Health', value: 'Optimal', icon: Database, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Active Keys', value: '24/24', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="dashboard-card p-4 flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-sm font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Logs Console */}
            <div className="dashboard-card overflow-hidden bg-slate-950 border-slate-800">
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter live logs..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-slate-300 outline-none focus:border-blue-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'Info', 'Warning', 'Error'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    filter === t ? "bg-white text-slate-950" : "bg-white/5 text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-2 h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed no-scrollbar">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                            <span className="text-slate-600 shrink-0 w-24">[{log.time}]</span>
                            <span className={cn(
                                "shrink-0 w-20 font-black",
                                log.type === 'Info' && "text-blue-400",
                                log.type === 'Warning' && "text-amber-400",
                                log.type === 'Error' && "text-red-400",
                                log.type === 'Critical' && "text-red-600 bg-red-400/10 px-1 rounded",
                            )}>
                                {log.type.toUpperCase()}
                            </span>
                            <span className="text-slate-400 font-bold shrink-0 w-28">({log.source})</span>
                            <span className="text-slate-200 flex-1">{log.message}</span>
                            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center gap-4 p-3">
                        <span className="text-emerald-500 animate-pulse">●</span>
                        <span className="text-slate-500 italic">Listening for incoming telemetry...</span>
                    </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <Server className="w-3 h-3" />
                        Region: Asia-South1
                    </div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        Buffer: 1,024 MB
                    </div>
                </div>
            </div>
        </div>
    );
}
