'use client';

import React from 'react';
import {
    History,
    Search,
    Filter,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    User,
    DoorOpen,
    Clock,
    MoreVertical,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GateLogsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const logs = [
        { id: 1, user: 'Suresh Raina', role: 'Student', gate: 'Main Gate 01', type: 'Entry', time: '10:24 AM', date: '22 Oct 2025', status: 'Authorized' },
        { id: 2, user: 'Rahul Kumar', role: 'Student', gate: 'Hostel Gate B', type: 'Exit', time: '09:15 AM', date: '22 Oct 2025', status: 'Authorized' },
        { id: 3, user: 'Unknown', role: 'Visitor', gate: 'Main Gate 02', type: 'Entry', time: '08:45 AM', date: '22 Oct 2025', status: 'Denied' },
        { id: 4, user: 'Dr. Neha Singh', role: 'Faculty', gate: 'Main Gate 01', type: 'Entry', time: '08:30 AM', date: '22 Oct 2025', status: 'Authorized' },
        { id: 5, user: 'Priya Sharma', role: 'Student', gate: 'Hostel Gate B', type: 'Entry', time: '08:12 AM', date: '22 Oct 2025', status: 'Authorized' },
        { id: 6, user: 'Amit Patel', role: 'Staff', gate: 'Back Entrance', type: 'Exit', time: '07:45 AM', date: '22 Oct 2025', status: 'Authorized' },
        { id: 7, user: 'Ishaan Verma', role: 'Student', gate: 'Main Gate 01', type: 'Exit', time: '07:30 AM', date: '22 Oct 2025', status: 'Authorized' },
    ];

    const filteredLogs = logs.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.gate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History className="w-8 h-8 text-[#1e3a5f]" />
                        Master Gate Logs
                    </h2>
                    <p className="text-slate-500 font-medium">Immutable audit trail of every entry and exit event across campus.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all">
                    <Download className="w-4 h-4" />
                    <span>Download Log</span>
                </button>
            </div>

            {/* Table Section */}
            <div className="dashboard-card overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="relative group max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or gate..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all outline-none font-bold placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-all flex items-center gap-2 shadow-sm">
                            <Filter className="w-3.5 h-3.5" />
                            Filter Results
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-all flex items-center gap-2 shadow-sm">
                            <Clock className="w-3.5 h-3.5" />
                            All Time
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Entity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Gate Location</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm",
                                                log.status === 'Denied' ? "bg-red-50 text-[#c32026]" : "bg-blue-50 text-[#1e3a5f]"
                                            )}>
                                                {log.user === 'Unknown' ? '?' : log.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-tight">{log.user}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{log.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <DoorOpen className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold">{log.gate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            log.type === 'Entry' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {log.type === 'Entry' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                            {log.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-slate-900 leading-none">{log.time}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{log.date}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                                            log.status === 'Authorized' ? "text-emerald-500" : "text-[#c32026]"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", log.status === 'Authorized' ? "bg-emerald-500" : "bg-[#c32026]")} />
                                            {log.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredLogs.length} of 1,248 Master Entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1e3a5f] hover:border-[#1e3a5f] transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
