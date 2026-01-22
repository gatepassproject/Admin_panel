'use client';

import React from 'react';
import {
    CheckCircle2,
    Search,
    Filter,
    Download,
    Calendar,
    User,
    Clock,
    TrendingUp,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AttendanceTrackingPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const attendanceData = [
        { id: 1, name: 'Suresh Raina', idNo: 'CT2021001', dept: 'Engineering', status: 'Present', lastSeen: '10:24 AM', gate: 'Main Gate 01', records: '2' },
        { id: 2, name: 'Rahul Kumar', idNo: 'CT2021042', dept: 'Engineering', status: 'Out', lastSeen: '09:15 AM', gate: 'Hostel Gate B', records: '1' },
        { id: 3, name: 'Priya Sharma', idNo: 'CT2021156', dept: 'Computer App', status: 'Present', lastSeen: '08:12 AM', gate: 'Hostel Gate B', records: '1' },
        { id: 4, name: 'Ishaan Verma', idNo: 'CT2021089', dept: 'Management', status: 'Out', lastSeen: '07:30 AM', gate: 'Main Gate 01', records: '1' },
        { id: 5, name: 'Ananya Das', idNo: 'CT2021201', dept: 'Engineering', status: 'Present', lastSeen: '10:05 AM', gate: 'Main Gate 03', records: '2' },
        { id: 6, name: 'Vikram Singh', idNo: 'CT2021112', dept: 'Comp App', status: 'Present', lastSeen: '08:45 AM', gate: 'Main Gate 01', records: '2' },
    ];

    const filteredAttendance = attendanceData.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.idNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        Attendance Intelligence
                    </h2>
                    <p className="text-slate-500 font-medium">Auto-derived presence tracking based on gate mobility logs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">94.2% Overall Presence</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all">
                        <Calendar className="w-4 h-4" />
                        <span>Today</span>
                    </button>
                </div>
            </div>

            {/* Attendance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="dashboard-card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                            <div className="relative group max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by student name or Roll No..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all outline-none font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-[#1e3a5f] transition-all">DEPT</button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-[#1e3a5f] transition-all">STATUS</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Department</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Scanned</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredAttendance.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[#1e3a5f] text-xs">
                                                        {student.name.charAt(0)}{student.name.split(' ')[1]?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 leading-tight">{student.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{student.idNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{student.dept}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                                                    student.status === 'Present' ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"
                                                )}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    {student.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-900">{student.lastSeen}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">@{student.gate}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-[#1e3a5f] text-white">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Dept Insights
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Engineering', rate: 92 },
                                { name: 'Comp App', rate: 96 },
                                { name: 'Management', rate: 89 },
                                { name: 'Pharmacy', rate: 94 },
                            ].map((dept, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">{dept.name}</span>
                                        <span className="text-white">{dept.rate}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${dept.rate}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Consistency Alert</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    12 students have missed their exit scans in the last 24 hours. This may affect attendance accuracy for <span className="text-slate-900 font-bold">SOE</span> department.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
